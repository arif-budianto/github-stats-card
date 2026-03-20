const GITHUB_API = "https://api.github.com/graphql";

export async function fetchStats(username) {
  const token = process.env.PAT_1;
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

  const res = await fetch(GITHUB_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  const json = await res.json();
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
  const token = process.env.PAT_1;
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

  const res = await fetch(GITHUB_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  const json = await res.json();
  const repos = json?.data?.user?.repositories?.nodes ?? [];

  const langMap = {};
  for (const repo of repos) {
    for (const edge of repo.languages?.edges ?? []) {
      const name = edge.node.name;
      if (!langMap[name]) langMap[name] = { name, color: edge.node.color, size: 0 };
      langMap[name].size += edge.size;
    }
  }

  return Object.values(langMap).sort((a, b) => b.size - a.size);
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
