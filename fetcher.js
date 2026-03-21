const GITHUB_API = "https://api.github.com/graphql";
const REQUEST_TIMEOUT_MS = 8000;
const LANGS_CACHE_TTL_MS = 1000 * 60 * 30;
const PROGRESS_CACHE_TTL_MS = 1000 * 60 * 30;
const HERO_CACHE_TTL_MS = 1000 * 60 * 30;
const VIEWS_CACHE_TTL_MS = 1000 * 60;
const KOMAREV_VIEWS_URL = "https://komarev.com/ghpvc/";
const langsCache = new Map();
const progressCache = new Map();
const heroCache = new Map();
const viewsCache = new Map();

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

export async function fetchProgress(username) {
  const cacheKey = String(username || "").toLowerCase();
  const cached = progressCache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < PROGRESS_CACHE_TTL_MS) {
    return cached.data;
  }

  const yearsQuery = `
    query($login: String!) {
      user(login: $login) {
        createdAt
        contributionsCollection {
          contributionYears
          hasAnyRestrictedContributions
          restrictedContributionsCount
        }
      }
    }
  `;

  try {
    const yearsJson = await githubGraphQL(yearsQuery, { login: username });
    const user = yearsJson?.data?.user;
    if (!user) throw new Error("User not found or token invalid");

    const years = [...(user.contributionsCollection?.contributionYears ?? [])].sort((a, b) => a - b);
    const joinedAt = user.createdAt;
    const restrictedCount = user.contributionsCollection?.restrictedContributionsCount ?? 0;
    const hasRestricted = Boolean(user.contributionsCollection?.hasAnyRestrictedContributions || restrictedCount > 0);

    const allDays = [];
    let totalContributions = 0;

    for (const year of years) {
      const from = `${year}-01-01T00:00:00Z`;
      const to = `${year}-12-31T23:59:59Z`;
      const calendar = await fetchContributionCalendar(username, from, to);
      totalContributions += calendar.totalContributions || 0;

      for (const week of calendar.weeks ?? []) {
        for (const day of week.contributionDays ?? []) {
          allDays.push({
            date: day.date,
            count: day.contributionCount || 0,
          });
        }
      }
    }

    const sortedDays = allDays
      .filter((day) => day.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const { current, longest } = calculateStreaks(sortedDays);
    const data = {
      totalContributions,
      joinedAt,
      currentStreak: current.length,
      currentStreakStart: current.start,
      currentStreakEnd: current.end,
      longestStreak: longest.length,
      longestStreakStart: longest.start,
      longestStreakEnd: longest.end,
      hasRestricted,
      restrictedCount,
    };

    progressCache.set(cacheKey, { data, fetchedAt: Date.now() });
    return data;
  } catch (error) {
    if (cached?.data) {
      return cached.data;
    }
    throw error;
  }
}

export async function fetchHero(username) {
  const cacheKey = String(username || "").toLowerCase();
  const cached = heroCache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < HERO_CACHE_TTL_MS) {
    return cached.data;
  }

  const query = `
    query($login: String!) {
      user(login: $login) {
        name
        login
        followers {
          totalCount
        }
        repositories(ownerAffiliations: OWNER, isFork: false) {
          totalCount
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
          }
        }
      }
    }
  `;

  try {
    const json = await githubGraphQL(query, { login: username });
    const user = json?.data?.user;
    if (!user) throw new Error("User not found or token invalid");

    const data = {
      name: user.name || user.login,
      login: user.login,
      followers: user.followers?.totalCount || 0,
      repositories: user.repositories?.totalCount || 0,
      contributions: user.contributionsCollection?.contributionCalendar?.totalContributions || 0,
    };

    heroCache.set(cacheKey, { data, fetchedAt: Date.now() });
    return data;
  } catch (error) {
    if (cached?.data) {
      return cached.data;
    }
    throw error;
  }
}

export async function fetchProfileViews(username) {
  const cacheKey = String(username || "").toLowerCase();
  const cached = viewsCache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < VIEWS_CACHE_TTL_MS) {
    return cached.data;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const url = `${KOMAREV_VIEWS_URL}?username=${encodeURIComponent(username || "")}&label=PROFILE%20VIEWS&color=0ea5e9&style=flat-square`;
    const res = await fetch(url, {
      headers: {
        Accept: "image/svg+xml",
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Views badge responded ${res.status}`);
    }

    const svg = await res.text();
    const count = extractViewsCount(svg);
    const data = {
      username: username || "",
      count,
    };

    viewsCache.set(cacheKey, { data, fetchedAt: Date.now() });
    return data;
  } catch (error) {
    if (cached?.data) {
      return cached.data;
    }
    if (error?.name === "AbortError") {
      throw new Error("Views counter timeout");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function githubGraphQL(query, variables) {
  const token = resolveGithubToken(variables?.login);
  if (!token) throw new Error(`GitHub token is not configured for ${variables?.login || "this user"}`);

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

function resolveGithubToken(username) {
  const candidates = buildEnvTokenCandidates(username);
  for (const envKey of candidates) {
    if (process.env[envKey]) {
      return process.env[envKey];
    }
  }
  return null;
}

function buildEnvTokenCandidates(username) {
  const raw = String(username || "").trim();
  if (!raw) return [];

  const normalizedOriginal = normalizeEnvUsername(raw);
  const normalizedLower = normalizeEnvUsername(raw.toLowerCase());
  const normalizedUpper = normalizeEnvUsername(raw.toUpperCase());

  return [...new Set([
    `GITHUB_TOKEN__${normalizedOriginal}`,
    `GITHUB_TOKEN__${normalizedLower}`,
    `GITHUB_TOKEN__${normalizedUpper}`,
  ])];
}

function normalizeEnvUsername(username) {
  return String(username || "")
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function fetchContributionCalendar(username, from, to) {
  const query = `
    query($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  const json = await githubGraphQL(query, { login: username, from, to });
  return json?.data?.user?.contributionsCollection?.contributionCalendar ?? { totalContributions: 0, weeks: [] };
}

function calculateStreaks(days) {
  let longest = { length: 0, start: null, end: null };
  let currentWindow = null;
  let lastPositiveIndex = -1;

  for (let i = 0; i < days.length; i += 1) {
    if (days[i].count > 0) {
      lastPositiveIndex = i;
      break;
    }
  }

  let activeRun = null;
  for (let i = 0; i < days.length; i += 1) {
    const day = days[i];
    if (day.count > 0) {
      if (!activeRun) {
        activeRun = { length: 1, start: day.date, end: day.date };
      } else if (isNextDay(activeRun.end, day.date)) {
        activeRun.length += 1;
        activeRun.end = day.date;
      } else {
        if (activeRun.length > longest.length) {
          longest = { ...activeRun };
        }
        activeRun = { length: 1, start: day.date, end: day.date };
      }
      lastPositiveIndex = i;
    }
  }

  if (activeRun && activeRun.length > longest.length) {
    longest = { ...activeRun };
  }

  if (lastPositiveIndex === -1) {
    return {
      current: { length: 0, start: null, end: null },
      longest,
    };
  }

  let current = { length: 0, start: null, end: null };
  for (let i = lastPositiveIndex; i >= 0; i -= 1) {
    const day = days[i];
    if (day.count === 0) {
      break;
    }

    if (!current.length) {
      current = { length: 1, start: day.date, end: day.date };
      continue;
    }

    if (isNextDay(day.date, current.start)) {
      current.length += 1;
      current.start = day.date;
    } else {
      break;
    }
  }

  return { current, longest };
}

function isNextDay(previousDate, nextDate) {
  const previous = new Date(`${previousDate}T00:00:00Z`);
  const next = new Date(`${nextDate}T00:00:00Z`);
  return next.getTime() - previous.getTime() === 24 * 60 * 60 * 1000;
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

function extractViewsCount(svg) {
  const texts = [...String(svg || "").matchAll(/<text\b[^>]*>([^<]+)<\/text>/g)]
    .map((match) => String(match[1] || "").trim())
    .filter(Boolean);

  const numeric = texts.filter((text) => /[\d,]+/.test(text));
  if (numeric.length === 0) {
    throw new Error("Unable to parse views counter");
  }

  return numeric[numeric.length - 1];
}
