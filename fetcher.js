const GITHUB_API = "https://api.github.com/graphql";
const REQUEST_TIMEOUT_MS = 8000;
const LANGS_CACHE_TTL_MS = 1000 * 60 * 30;
const langsCache = new Map();

export async function fetchStats(username) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        name
        login
        contributionsCollection {
          totalCommitContributions
          restrictedContributionsCount
        }
        repositoriesContributedTo(contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
          totalCount
        }
        pullRequests(first: 1) { totalCount }
        openIssues: issues(states: OPEN) { totalCount }
        closedIssues: issues(states: CLOSED) { totalCount }
        repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
          nodes { stargazers { totalCount } }
        }
      }
    }
  `;

  const json = await githubGraphQL(query, { login: username });
  const user = json?.data?.user;
  if (!user) throw new Error("User not found or token invalid");

  const stars = user.repositories.nodes.reduce((s, r) => s + r.stargazers.totalCount, 0);
  const commits = user.contributionsCollection.totalCommitContributions
    + user.contributionsCollection.restrictedContributionsCount;
  const prs = user.pullRequests.totalCount;
  const issues = user.openIssues.totalCount + user.closedIssues.totalCount;
  const contributed = user.repositoriesContributedTo.totalCount;

  const rank = calcRank({ stars, commits, prs, issues, contributed });

  return {
    name: user.name || user.login,
    stars,
    commits,
    prs,
    issues,
    contributed,
    rank,
  };
}

export async function fetchLangs(username) {
  const cacheKey = String(username || "").toLowerCase();
  const cached = langsCache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < LANGS_CACHE_TTL_MS) {
    return cached.data;
  }

  const query = `
    query($login: String!) {
      user(login: $login) {
        repositories(ownerAffiliations: OWNER, isFork: false, first: 100) {
          nodes {
            languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
              edges { size node { name color } }
            }
          }
        }
      }
    }
  `;

  try {
    const json = await githubGraphQL(query, { login: username });
    const repos = json?.data?.user?.repositories?.nodes ?? [];
    const langMap = {};

    for (const repo of repos) {
      for (const edge of repo.languages?.edges ?? []) {
        const name = edge.node.name;
        if (!langMap[name]) langMap[name] = { name, color: edge.node.color, size: 0 };
        langMap[name].size += edge.size;
      }
    }

    const data = Object.values(langMap).sort((a, b) => b.size - a.size);
    if (data.length > 0) {
      langsCache.set(cacheKey, { data, fetchedAt: Date.now() });
    }

    return data;
  } catch (error) {
    if (cached?.data?.length) {
      return cached.data;
    }
    throw error;
  }
}

async function githubGraphQL(query, variables) {
  const token = process.env.PAT_1;
  if (!token) throw new Error("PAT_1 is not configured");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(GITHUB_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`GitHub API responded ${res.status}`);
    }

    const json = await res.json();
    if (json?.errors?.length) {
      throw new Error(json.errors[0]?.message || "GitHub GraphQL error");
    }

    return json;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("GitHub API timeout");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function calcRank({ stars, commits, prs, issues, contributed }) {
  const score =
    stars * 0.2 +
    commits * 0.5 +
    prs * 0.8 +
    issues * 0.3 +
    contributed * 0.6;

  if (score >= 3000) return "S+";
  if (score >= 2000) return "S";
  if (score >= 1500) return "A+";
  if (score >= 1000) return "A";
  if (score >= 700)  return "A-";
  if (score >= 500)  return "B+";
  if (score >= 350)  return "B";
  if (score >= 200)  return "B-";
  return "C";
}
