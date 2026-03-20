export function renderProgressCard({
  totalContributions,
  joinedAt,
  currentStreak,
  currentStreakStart,
  currentStreakEnd,
  longestStreak,
  longestStreakStart,
  longestStreakEnd,
  hasRestricted,
}) {
  const width = 800;
  const height = 294;
  const paddingX = 32;
  const bg = "#0f172a";
  const border = "#243247";
  const surface = "#162033";
  const textPrimary = "#e2e8f0";
  const textSecondary = "#93a4b8";
  const accentBlue = "#60a5fa";
  const accentCyan = "#22d3ee";
  const accentViolet = "#a78bfa";

  const totalValue = formatNumber(totalContributions);
  const totalRange = `${formatDate(joinedAt)} - Present`;
  const currentRange = currentStreak > 0 ? formatRange(currentStreakStart, currentStreakEnd) : "No active streak";
  const longestRange = longestStreak > 0 ? formatRange(longestStreakStart, longestStreakEnd) : "No streak data";
  const ringScore = clamp(currentStreak / Math.max(longestStreak || 1, 3), 0.12, 1);
  const ringR = 66;
  const ringCirc = 2 * Math.PI * ringR;
  const ringOffset = ringCirc * (1 - ringScore);

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Contribution progress">
  <defs>
    <linearGradient id="progress-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#101a31"/>
      <stop offset="55%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#111b2f"/>
    </linearGradient>
    <linearGradient id="progress-surface" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#172338"/>
      <stop offset="100%" stop-color="#121c2d"/>
    </linearGradient>
    <linearGradient id="progress-ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentBlue}"/>
      <stop offset="100%" stop-color="${accentViolet}"/>
    </linearGradient>
    <radialGradient id="progress-glow-a" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accentCyan}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${accentCyan}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="progress-glow-b" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accentViolet}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${accentViolet}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="progress-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="50%" stop-color="#7dd3fc" stop-opacity="0.07"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <pattern id="progress-grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#60a5fa" stroke-width="0.8" opacity="0.08"/>
    </pattern>
  </defs>

  <rect width="${width}" height="${height}" rx="16" fill="url(#progress-bg)"/>
  <rect width="${width}" height="${height}" rx="16" fill="url(#progress-grid)"/>
  <circle cx="148" cy="112" r="150" fill="url(#progress-glow-a)">
    <animate attributeName="cx" values="132;188;132" dur="18s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="96;118;96" dur="15s" repeatCount="indefinite"/>
  </circle>
  <circle cx="626" cy="124" r="166" fill="url(#progress-glow-b)">
    <animate attributeName="cx" values="626;586;626" dur="20s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="124;152;124" dur="16s" repeatCount="indefinite"/>
  </circle>
  <rect x="-220" y="0" width="360" height="${height}" fill="url(#progress-sweep)" opacity="0.44">
    <animate attributeName="x" values="-240;820" dur="20s" repeatCount="indefinite"/>
  </rect>
  <rect x="0" y="0" width="${width}" height="${height}" rx="16" fill="${bg}" opacity="0.3"/>
  <rect width="${width}" height="${height}" rx="16" fill="none" stroke="${border}" stroke-width="1"/>
  <path d="M16 0h768c8.837 0 16 7.163 16 16v64H0V16C0 7.163 7.163 0 16 0Z" fill="url(#progress-surface)" opacity="0.82"/>

  <rect x="${paddingX}" y="22" width="128" height="3" rx="999" fill="${accentCyan}"/>
  <text x="${paddingX}" y="58" font-size="17" font-weight="700" fill="${textPrimary}" font-family="'Segoe UI',Ubuntu,sans-serif">Contribution Momentum</text>

  <g transform="translate(${width - paddingX - 138},20)">
    <rect width="138" height="40" rx="999" fill="#0b1220" opacity="0.66" stroke="#334155" stroke-width="1.1"/>
    <rect x="1.5" y="1.5" width="135" height="18" rx="999" fill="#ffffff" opacity="0.05"/>
    <circle cx="20" cy="20" r="5" fill="${hasRestricted ? accentCyan : accentBlue}">
      <animate attributeName="opacity" values="0.45;1;0.45" dur="2.6s" repeatCount="indefinite"/>
    </circle>
    <circle cx="20" cy="20" r="9" fill="none" stroke="${hasRestricted ? accentCyan : accentBlue}" stroke-opacity="0.2" stroke-width="1.5"/>
    <text x="34" y="25" font-size="12" font-weight="700" letter-spacing="0.3" fill="${textPrimary}" font-family="'Segoe UI',Ubuntu,sans-serif">${hasRestricted ? "PRIVATE-AWARE" : "PROFILE DATA"}</text>
  </g>

  <line x1="266" y1="94" x2="266" y2="242" stroke="#475569" stroke-width="1" opacity="0.55"/>
  <line x1="534" y1="94" x2="534" y2="242" stroke="#475569" stroke-width="1" opacity="0.55"/>

  <g transform="translate(98,124)">
    <text x="0" y="0" font-size="46" font-weight="800" fill="${accentBlue}" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="middle">${totalValue}</text>
    <text x="0" y="46" font-size="18" font-weight="600" fill="${accentBlue}" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="middle">Total Contributions</text>
    <text x="0" y="88" font-size="15" font-weight="600" fill="${accentCyan}" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="middle">${escapeXml(totalRange)}</text>
  </g>

  <g transform="translate(400,120)">
    <circle cx="0" cy="0" r="${ringR + 12}" fill="none" stroke="#7dd3fc" stroke-opacity="0.1" stroke-width="1.5" stroke-dasharray="3 9">
      <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="24s" repeatCount="indefinite"/>
    </circle>
    <circle cx="0" cy="0" r="${ringR}" fill="none" stroke="${border}" stroke-width="8"/>
    <circle cx="0" cy="0" r="${ringR}" fill="none" stroke="url(#progress-ring)" stroke-width="8"
      stroke-dasharray="${ringCirc.toFixed(2)}" stroke-dashoffset="${ringOffset.toFixed(2)}"
      stroke-linecap="round" transform="rotate(-90 0 0)"/>
    <path d="M-8 -80 C-14 -92 2 -96 4 -108 C12 -98 18 -84 9 -73 C3 -66 -5 -68 -8 -80Z" fill="${accentBlue}" opacity="0.96">
      <animateTransform attributeName="transform" type="translate" values="0 0;0 -3;0 0" dur="3.2s" repeatCount="indefinite"/>
    </path>
    <text x="0" y="14" font-size="34" font-weight="800" fill="${accentViolet}" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="middle">${safeNumber(currentStreak)}</text>
    <text x="0" y="92" font-size="18" font-weight="700" fill="${accentViolet}" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="middle">Current Streak</text>
    <text x="0" y="128" font-size="15" font-weight="600" fill="${accentCyan}" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="middle">${escapeXml(currentRange)}</text>
  </g>

  <g transform="translate(670,124)">
    <text x="0" y="0" font-size="46" font-weight="800" fill="${accentBlue}" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="middle">${safeNumber(longestStreak)}</text>
    <text x="0" y="46" font-size="18" font-weight="600" fill="${accentBlue}" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="middle">Longest Streak</text>
    <text x="0" y="88" font-size="15" font-weight="600" fill="${accentCyan}" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="middle">${escapeXml(longestRange)}</text>
  </g>
</svg>`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function safeNumber(value) {
  return Number.isFinite(value) ? String(value) : "0";
}

function formatNumber(value) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("en-US").format(num);
}

function formatDate(input) {
  if (!input) return "Unknown";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatRange(start, end) {
  if (!start || !end) return "No date range";
  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "No date range";
  }

  const sameYear = startDate.getUTCFullYear() === endDate.getUTCFullYear();
  const sameMonth = sameYear && startDate.getUTCMonth() === endDate.getUTCMonth();

  if (sameMonth) {
    return `${shortMonth(startDate)} ${startDate.getUTCDate()} - ${endDate.getUTCDate()}, ${endDate.getUTCFullYear()}`;
  }

  if (sameYear) {
    return `${shortMonth(startDate)} ${startDate.getUTCDate()} - ${shortMonth(endDate)} ${endDate.getUTCDate()}, ${endDate.getUTCFullYear()}`;
  }

  return `${shortMonth(startDate)} ${startDate.getUTCDate()}, ${startDate.getUTCFullYear()} - ${shortMonth(endDate)} ${endDate.getUTCDate()}, ${endDate.getUTCFullYear()}`;
}

function shortMonth(date) {
  return date.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
}

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
