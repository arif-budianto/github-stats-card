export function renderStatsCard({ name, stars, commits, prs, issues, contributed, rank }) {
  const rankGrade = rank || "B+";
  const rankLabel = rankGrade === "A+" ? "SSS" : rankGrade;
  const bg = "#0f172a";
  const surface = "#162033";
  const border = "#243247";
  const textPrimary = "#e2e8f0";
  const textSecondary = "#93a4b8";
  const accent = "#38bdf8";

  const rows = [
    { icon: starIcon(), label: "Total Stars Earned", value: formatNum(stars) },
    { icon: commitIcon(), label: "Total Commits", value: formatNum(commits) },
    { icon: prIcon(), label: "Total Pull Requests", value: formatNum(prs) },
    { icon: issueIcon(), label: "Total Issues", value: formatNum(issues) },
    { icon: contribIcon(), label: "Contributed To", value: formatNum(contributed) },
  ];

  const width = 800;
  const paddingX = 34;
  const headerH = 108;
  const rowH = 50;
  const height = headerH + rows.length * rowH + 18;

  const rankR = 34;
  const rankCx = width - paddingX - rankR - 8;
  const rankCy = 50;
  const circ = 2 * Math.PI * rankR;
  const offset = circ * (1 - rankToScore(rankGrade));
  const title = escapeXml(truncateText(`${name || ""}'s GitHub Stats`, 28));

  const rowsSVG = rows.map((row, i) => {
    const y = headerH + i * rowH;
    const mid = y + rowH / 2 + 1;
    const divider = `<line x1="${paddingX}" y1="${y}" x2="${width - paddingX}" y2="${y}" stroke="${border}" stroke-width="1" opacity="${i === 0 ? 0.9 : 0.55}"/>`;
    return `
    <g>
      ${divider}
      <g transform="translate(${paddingX},${mid - 8})" fill="${textSecondary}" opacity="0.92">${row.icon}</g>
      <text x="${paddingX + 30}" y="${mid}" font-size="15" fill="${textSecondary}" font-family="'Segoe UI',Ubuntu,sans-serif" dominant-baseline="middle">${row.label}</text>
      <text x="${width - paddingX}" y="${mid}" font-size="16" font-weight="700" fill="${textPrimary}" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="end" dominant-baseline="middle">${row.value}</text>
    </g>`;
  }).join("");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img">
  <defs>
    <linearGradient id="stats-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#101a31"/>
      <stop offset="55%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#111b2f"/>
    </linearGradient>
    <linearGradient id="stats-surface" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#172338"/>
      <stop offset="100%" stop-color="#121c2d"/>
    </linearGradient>
    <linearGradient id="stats-accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#60a5fa"/>
    </linearGradient>
    <radialGradient id="stats-glow-a" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="stats-glow-b" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="stats-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="50%" stop-color="#7dd3fc" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <pattern id="stats-grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#60a5fa" stroke-width="0.8" opacity="0.08"/>
    </pattern>
  </defs>

  <rect width="${width}" height="${height}" rx="14" fill="url(#stats-bg)"/>
  <rect width="${width}" height="${height}" rx="14" fill="url(#stats-grid)"/>
  <circle cx="170" cy="92" r="180" fill="url(#stats-glow-a)">
    <animate attributeName="cx" values="140;210;140" dur="18s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="86;112;86" dur="14s" repeatCount="indefinite"/>
  </circle>
  <circle cx="654" cy="84" r="210" fill="url(#stats-glow-b)">
    <animate attributeName="cx" values="654;610;654" dur="16s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="84;112;84" dur="18s" repeatCount="indefinite"/>
  </circle>
  <rect x="-220" y="0" width="360" height="${height}" fill="url(#stats-sweep)" opacity="0.5">
    <animate attributeName="x" values="-260;820" dur="18s" repeatCount="indefinite"/>
  </rect>
  <rect x="0" y="0" width="${width}" height="${height}" rx="14" fill="${bg}" opacity="0.34"/>
  <rect width="${width}" height="${height}" rx="14" fill="none" stroke="${border}" stroke-width="1"/>
  <path d="M14 0h772c7.732 0 14 6.268 14 14v78H0V14C0 6.268 6.268 0 14 0Z" fill="url(#stats-surface)" opacity="0.84"/>

  <rect x="${paddingX}" y="22" width="120" height="3" rx="999" fill="${accent}"/>
  <text x="${paddingX}" y="66" font-size="17" font-weight="700" fill="${textPrimary}" font-family="'Segoe UI',Ubuntu,sans-serif">${title}</text>

  <circle cx="${rankCx}" cy="${rankCy}" r="${rankR}" fill="none" stroke="${border}" stroke-width="6"/>
  <circle cx="${rankCx}" cy="${rankCy}" r="${rankR}" fill="none" stroke="url(#stats-accent)"
    stroke-width="6" stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
    stroke-linecap="round" transform="rotate(-90 ${rankCx} ${rankCy})"/>
  <circle cx="${rankCx}" cy="${rankCy}" r="${rankR + 10}" fill="none" stroke="#7dd3fc" stroke-opacity="0.12" stroke-width="1.5" stroke-dasharray="3 8">
    <animateTransform attributeName="transform" type="rotate" from="0 ${rankCx} ${rankCy}" to="360 ${rankCx} ${rankCy}" dur="24s" repeatCount="indefinite"/>
  </circle>
  <text x="${rankCx}" y="${rankCy + 6}" font-size="${rankLabel.length > 2 ? 15 : 18}" font-weight="800" fill="${textPrimary}"
    font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="middle">${rankLabel}</text>

  ${rowsSVG}
</svg>`;
}

function rankToScore(rank) {
  const map = { "S+":1,"S":0.95,"A+":0.88,"A":0.80,"A-":0.74,"B+":0.66,"B":0.58,"B-":0.50,"C":0.38 };
  return map[rank] ?? 0.5;
}
function formatNum(n) {
  const num = parseInt(n) || 0;
  return num >= 1000 ? (num/1000).toFixed(1)+"k" : String(num);
}
function escapeXml(str) {
  return String(str||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function truncateText(text, maxChars) {
  return text.length > maxChars ? `${text.slice(0, maxChars - 1)}…` : text;
}
function starIcon() { return `<svg width="14" height="14" viewBox="0 0 16 16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>`; }
function commitIcon() { return `<svg width="14" height="14" viewBox="0 0 16 16"><path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/></svg>`; }
function prIcon() { return `<svg width="14" height="14" viewBox="0 0 16 16"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354Z"/></svg>`; }
function issueIcon() { return `<svg width="14" height="14" viewBox="0 0 16 16"><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"/></svg>`; }
function contribIcon() { return `<svg width="14" height="14" viewBox="0 0 16 16"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z"/></svg>`; }
