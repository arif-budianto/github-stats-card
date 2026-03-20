export function renderHeroCard(data, options = {}) {
  const {
    name,
    login,
    followers,
    repositories,
    contributions,
  } = data;

  const titlePrimary = escapeXml(options.titlePrimary || "Senior Network Engineer");
  const titleSecondary = escapeXml(options.titleSecondary || "Full-Stack Developer");
  const experience = escapeXml(options.experience || "14+ Years in IT");
  const tagline = escapeXml(
    options.tagline || "Building ISP automation, backend systems, and production-grade infrastructure.",
  );

  const safeName = escapeXml(name || login || "GitHub Profile");
  const safeLogin = escapeXml(login || "");

  return `<svg width="1280" height="320" viewBox="0 0 1280 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${safeName} hero card">
  <defs>
    <linearGradient id="hero-bg" x1="96" y1="24" x2="1184" y2="296" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#081120"/>
      <stop offset="55%" stop-color="#0d1b34"/>
      <stop offset="100%" stop-color="#101b2d"/>
    </linearGradient>
    <linearGradient id="hero-panel" x1="48" y1="40" x2="1232" y2="280" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#102742" stop-opacity="0.92"/>
      <stop offset="55%" stop-color="#111f37" stop-opacity="0.84"/>
      <stop offset="100%" stop-color="#14253b" stop-opacity="0.88"/>
    </linearGradient>
    <linearGradient id="hero-accent" x1="80" y1="0" x2="700" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="50%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
    <linearGradient id="hero-title" x1="0" y1="0" x2="680" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#dbeafe"/>
    </linearGradient>
    <radialGradient id="hero-glow-left" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(240 144) rotate(28) scale(292 184)">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="hero-glow-right" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1022 126) rotate(20) scale(250 164)">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hero-sweep" x1="0" y1="0" x2="420" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="50%" stop-color="#7dd3fc" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <pattern id="hero-grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M28 0H0V28" fill="none" stroke="#60a5fa" stroke-opacity="0.08" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1280" height="320" rx="28" fill="url(#hero-bg)"/>
  <rect width="1280" height="320" rx="28" fill="url(#hero-grid)"/>
  <ellipse cx="238" cy="150" rx="282" ry="152" fill="url(#hero-glow-left)"/>
  <ellipse cx="1028" cy="122" rx="252" ry="158" fill="url(#hero-glow-right)"/>
  <rect x="-240" y="48" width="420" height="220" fill="url(#hero-sweep)" opacity="0.5" transform="rotate(-8 -240 48)">
    <animate attributeName="x" values="-280;1300" dur="18s" repeatCount="indefinite"/>
  </rect>

  <rect x="24" y="24" width="1232" height="272" rx="24" fill="url(#hero-panel)" stroke="#2b3b53"/>
  <path d="M42 252C178 214 356 274 494 244C642 210 796 276 962 242C1060 222 1158 224 1238 238" stroke="#60a5fa" stroke-opacity="0.12" stroke-width="2"/>
  <path d="M42 258C182 272 292 228 432 244C590 262 744 218 882 240C1022 264 1136 258 1234 248" stroke="#a78bfa" stroke-opacity="0.08" stroke-width="2"/>

  <rect x="72" y="62" width="194" height="3" rx="999" fill="url(#hero-accent)"/>
  <text x="72" y="96" fill="#7dd3fc" font-size="18" font-weight="700" font-family="'Segoe UI',Ubuntu,sans-serif" letter-spacing="4">NETWORK x SOFTWARE x INFRA</text>
  <text x="72" y="134" fill="#94a3b8" font-size="22" font-weight="700" font-family="'Segoe UI',Ubuntu,monospace">${safeLogin}</text>
  <text x="72" y="206" fill="url(#hero-title)" font-size="72" font-weight="800" font-family="'Segoe UI',Ubuntu,sans-serif">${safeName}</text>
  <text x="72" y="246" fill="#dbeafe" font-size="24" font-weight="700" font-family="'Segoe UI',Ubuntu,sans-serif">${titlePrimary}  |  ${titleSecondary}  |  ${experience}</text>
  <text x="72" y="278" fill="#67e8f9" font-size="18" font-weight="600" font-family="'Segoe UI',Ubuntu,sans-serif">${tagline}</text>

  <g transform="translate(976 56)">
    <rect width="226" height="42" rx="999" fill="#081120" fill-opacity="0.76" stroke="#334155"/>
    <circle cx="22" cy="21" r="5" fill="#22d3ee">
      <animate attributeName="opacity" values="0.45;1;0.45" dur="2.8s" repeatCount="indefinite"/>
    </circle>
    <circle cx="22" cy="21" r="10" fill="none" stroke="#22d3ee" stroke-opacity="0.2" stroke-width="1.5"/>
    <text x="40" y="26" fill="#e2e8f0" font-size="14" font-weight="800" font-family="'Segoe UI',Ubuntu,sans-serif" letter-spacing="0.8">PROGRAMMER LEGEND PROFILE</text>
  </g>

  ${renderMetricPill(948, 120, "Followers", formatNumber(followers), "#60a5fa")}
  ${renderMetricPill(1110, 120, "Repositories", formatNumber(repositories), "#22d3ee")}
  ${renderMetricPill(948, 196, "Contributions", formatNumber(contributions), "#a78bfa")}
  ${renderMetricPill(1110, 196, "Mode", "Private-Aware", "#7dd3fc")}
</svg>`;
}

function renderMetricPill(x, y, label, value, accent) {
  const safeLabel = escapeXml(label);
  const safeValue = escapeXml(value);
  return `<g transform="translate(${x} ${y})">
    <rect width="138" height="58" rx="18" fill="#0a1323" fill-opacity="0.64" stroke="#2f425a"/>
    <text x="16" y="23" fill="#94a3b8" font-size="12" font-weight="700" font-family="'Segoe UI',Ubuntu,sans-serif" letter-spacing="1.2">${safeLabel.toUpperCase()}</text>
    <text x="16" y="44" fill="${accent}" font-size="22" font-weight="800" font-family="'Segoe UI',Ubuntu,sans-serif">${safeValue}</text>
  </g>`;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value) || 0);
}

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
