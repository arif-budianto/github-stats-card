export function renderHeroCard(data, options = {}) {
  const {
    name,
    login,
    followers,
    repositories,
    contributions,
  } = data;

  const width = 1280;
  const height = 420;
  const titlePrimaryRaw = cleanText(options.titlePrimary || "Senior Network Engineer");
  const titleSecondaryRaw = cleanText(options.titleSecondary || "Full-Stack Developer");
  const experienceRaw = cleanText(options.experience || "14+ Years in IT");
  const taglineRaw = cleanText(
    options.tagline || "Building ISP automation, backend systems, and production-grade infrastructure.",
  );
  const safeLogin = escapeXml(cleanText(login || ""));
  const displayNameRaw = truncateText(cleanText(name || login || "GitHub Profile"), 26);
  const safeName = escapeXml(displayNameRaw);
  const roleLine = escapeXml(
    truncateText([titlePrimaryRaw, titleSecondaryRaw].filter(Boolean).join(" | "), 50),
  );
  const experienceLine = escapeXml(truncateText(experienceRaw, 28));
  const taglineLines = wrapText(taglineRaw, 60, 2).map((line) => escapeXml(line));
  const nameFontSize = getNameFontSize(displayNameRaw);
  const initials = escapeXml(getInitials(displayNameRaw));

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${safeName} hero card">
  <defs>
    <linearGradient id="hero-bg" x1="84" y1="24" x2="1196" y2="396" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0f1a2d"/>
      <stop offset="55%" stop-color="#111c32"/>
      <stop offset="100%" stop-color="#162235"/>
    </linearGradient>
    <linearGradient id="hero-panel" x1="24" y1="24" x2="1256" y2="396" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#162339" stop-opacity="0.96"/>
      <stop offset="100%" stop-color="#111a2b" stop-opacity="0.94"/>
    </linearGradient>
    <linearGradient id="hero-side" x1="844" y1="48" x2="1208" y2="372" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0d1727" stop-opacity="0.96"/>
      <stop offset="100%" stop-color="#111c2d" stop-opacity="0.92"/>
    </linearGradient>
    <linearGradient id="hero-accent" x1="72" y1="0" x2="760" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="52%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
    <linearGradient id="hero-title" x1="72" y1="0" x2="760" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#dbeafe"/>
    </linearGradient>
    <radialGradient id="hero-glow-left" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(242 168) rotate(24) scale(340 220)">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="hero-glow-right" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1024 154) rotate(18) scale(282 198)">
      <stop offset="0%" stop-color="#818cf8" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#818cf8" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hero-sweep" x1="0" y1="0" x2="420" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="50%" stop-color="#7dd3fc" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="hero-orbit" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#60a5fa"/>
    </linearGradient>
    <pattern id="hero-grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M28 0H0V28" fill="none" stroke="#60a5fa" stroke-opacity="0.08" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${width}" height="${height}" rx="28" fill="url(#hero-bg)"/>
  <rect width="${width}" height="${height}" rx="28" fill="url(#hero-grid)"/>
  <ellipse cx="242" cy="170" rx="330" ry="210" fill="url(#hero-glow-left)"/>
  <ellipse cx="1030" cy="150" rx="274" ry="196" fill="url(#hero-glow-right)"/>
  <rect x="-240" y="36" width="420" height="300" fill="url(#hero-sweep)" opacity="0.52" transform="rotate(-8 -240 36)">
    <animate attributeName="x" values="-280;1300" dur="20s" repeatCount="indefinite"/>
  </rect>

  <rect x="24" y="24" width="1232" height="372" rx="28" fill="url(#hero-panel)" stroke="#2d3e57"/>
  <path d="M52 370C196 344 344 388 500 366C650 344 780 388 914 368C1036 350 1138 356 1228 372" stroke="#60a5fa" stroke-opacity="0.06" stroke-width="2"/>
  <path d="M52 388C194 404 324 368 482 382C634 396 770 364 920 378C1044 390 1146 390 1226 384" stroke="#a78bfa" stroke-opacity="0.05" stroke-width="2"/>
  <line x1="812" y1="60" x2="812" y2="360" stroke="#334155" stroke-opacity="0.75"/>

  <rect x="72" y="62" width="224" height="3" rx="999" fill="url(#hero-accent)"/>
  <text x="72" y="98" fill="#7dd3fc" font-size="18" font-weight="700" font-family="'Segoe UI',Ubuntu,sans-serif" letter-spacing="3.2">NETWORK x SOFTWARE x INFRA</text>
  <text x="72" y="136" fill="#94a3b8" font-size="22" font-weight="700" font-family="'Segoe UI',Ubuntu,monospace">${safeLogin}</text>
  <text x="72" y="216" fill="url(#hero-title)" font-size="${nameFontSize}" font-weight="800" font-family="'Segoe UI',Ubuntu,sans-serif">${safeName}</text>
  <text x="72" y="264" fill="#dbeafe" font-size="24" font-weight="700" font-family="'Segoe UI',Ubuntu,sans-serif">${roleLine}</text>
  <text x="72" y="300" fill="#93c5fd" font-size="19" font-weight="700" font-family="'Segoe UI',Ubuntu,sans-serif">${experienceLine}</text>
  ${renderTaglineLines(taglineLines, 72, 338)}

  <g transform="translate(844 48)">
    <rect width="364" height="324" rx="24" fill="url(#hero-side)" stroke="#314457"/>
    <rect x="24" y="22" width="110" height="34" rx="999" fill="#0a1323" fill-opacity="0.9" stroke="#334155"/>
    <circle cx="46" cy="39" r="5" fill="#22d3ee">
      <animate attributeName="opacity" values="0.45;1;0.45" dur="2.8s" repeatCount="indefinite"/>
    </circle>
    <circle cx="46" cy="39" r="11" fill="none" stroke="#22d3ee" stroke-opacity="0.24" stroke-width="1.5"/>
    <text x="64" y="44" fill="#e2e8f0" font-size="13" font-weight="800" font-family="'Segoe UI',Ubuntu,sans-serif" letter-spacing="0.8">PROFILE</text>

    <g transform="translate(298 72)">
      <circle cx="0" cy="0" r="38" fill="none" stroke="url(#hero-orbit)" stroke-width="2.5" stroke-opacity="0.9" stroke-dasharray="8 10">
        <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="26s" repeatCount="indefinite"/>
      </circle>
      <circle cx="0" cy="0" r="52" fill="none" stroke="#7dd3fc" stroke-opacity="0.12" stroke-width="1.5" stroke-dasharray="3 8">
        <animateTransform attributeName="transform" type="rotate" from="360 0 0" to="0 0 0" dur="32s" repeatCount="indefinite"/>
      </circle>
      <circle cx="0" cy="0" r="27" fill="#101a2d" stroke="#2d3e57"/>
      <text x="0" y="7" fill="#f8fafc" font-size="21" font-weight="800" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="middle">${initials}</text>
    </g>

    <text x="24" y="104" fill="#f8fafc" font-size="24" font-weight="800" font-family="'Segoe UI',Ubuntu,sans-serif">GitHub Snapshot</text>
    <text x="24" y="128" fill="#93a4b8" font-size="14" font-weight="600" font-family="'Segoe UI',Ubuntu,sans-serif">Private-aware metrics for profile view</text>
    <line x1="24" y1="144" x2="340" y2="144" stroke="#334155" stroke-opacity="0.8"/>

    ${renderMetricCard(24, 160, 150, 74, "Followers", formatNumber(followers), "#60a5fa")}
    ${renderMetricCard(190, 160, 150, 74, "Repositories", formatNumber(repositories), "#22d3ee")}
    ${renderMetricCard(24, 252, 150, 74, "Contributions", formatNumber(contributions), "#a78bfa")}
    ${renderMetricCard(190, 252, 150, 74, "Mode", "Private-Aware", "#7dd3fc")}
  </g>
</svg>`;
}

function renderTaglineLines(lines, x, startY) {
  return lines.map((line, index) => (
    `<text x="${x}" y="${startY + (index * 28)}" fill="#67e8f9" font-size="18" font-weight="600" font-family="'Segoe UI',Ubuntu,sans-serif">${line}</text>`
  )).join("");
}

function renderMetricCard(x, y, width, height, label, value, accent) {
  const safeLabel = escapeXml(label);
  const safeValue = escapeXml(value);
  const valueFontSize = getMetricValueFontSize(value);
  return `<g transform="translate(${x} ${y})">
    <rect width="${width}" height="${height}" rx="18" fill="#0a1323" fill-opacity="0.82" stroke="#2f425a"/>
    <rect x="1.5" y="1.5" width="${width - 3}" height="24" rx="16" fill="#ffffff" fill-opacity="0.04"/>
    <text x="16" y="24" fill="#94a3b8" font-size="11" font-weight="700" font-family="'Segoe UI',Ubuntu,sans-serif" letter-spacing="1.1">${safeLabel.toUpperCase()}</text>
    <text x="16" y="52" fill="${accent}" font-size="${valueFontSize}" font-weight="800" font-family="'Segoe UI',Ubuntu,sans-serif">${safeValue}</text>
  </g>`;
}

function getNameFontSize(name) {
  if (name.length <= 10) return 74;
  if (name.length <= 14) return 66;
  if (name.length <= 18) return 58;
  if (name.length <= 22) return 52;
  return 48;
}

function getMetricValueFontSize(value) {
  const text = String(value || "");
  if (text.length <= 6) return 26;
  if (text.length <= 10) return 21;
  return 16;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value) || 0);
}

function getInitials(value) {
  const parts = cleanText(value).split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return "GH";
  return parts.map((part) => part[0].toUpperCase()).join("");
}

function wrapText(text, maxChars, maxLines) {
  const words = cleanText(text).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];

  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
      continue;
    }

    if (current) {
      lines.push(current);
    }
    current = word;

    if (lines.length === maxLines - 1) {
      break;
    }
  }

  if (lines.length < maxLines && current) {
    lines.push(current);
  }

  if (words.join(" ").length > lines.join(" ").length) {
    lines[lines.length - 1] = truncateText(lines[lines.length - 1], maxChars);
  }

  return lines.slice(0, maxLines);
}

function truncateText(text, maxChars) {
  return text.length > maxChars ? `${text.slice(0, maxChars - 1)}...` : text;
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
