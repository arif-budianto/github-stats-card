export function renderViewsCard(data = {}) {
  const width = 390;
  const height = 96;
  const countRaw = cleanText(data.count || "0");
  const count = escapeXml(countRaw);
  const trackedLabelRaw = cleanText(data.trackedLabel || data.username || "profile");
  const username = escapeXml(truncateText(trackedLabelRaw, 12));
  const badgeWidth = 164;
  const trackedWidth = 96;

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Profile views ${count}">
  <defs>
    <linearGradient id="views-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111a2d"/>
      <stop offset="100%" stop-color="#0f1728"/>
    </linearGradient>
    <linearGradient id="views-accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#60a5fa"/>
    </linearGradient>
    <radialGradient id="views-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(318 30) rotate(148) scale(128 64)">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
    <pattern id="views-grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M24 0H0V24" fill="none" stroke="#60a5fa" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${width}" height="${height}" rx="20" fill="url(#views-bg)"/>
  <rect width="${width}" height="${height}" rx="20" fill="url(#views-grid)"/>
  <ellipse cx="318" cy="28" rx="130" ry="70" fill="url(#views-glow)"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="19" fill="none" stroke="#2a3950"/>

  <rect x="20" y="16" width="${badgeWidth}" height="28" rx="10" fill="#0a1323" fill-opacity="0.92" stroke="#314257"/>
  <rect x="20" y="16" width="${badgeWidth}" height="28" rx="10" fill="url(#views-accent)" opacity="0.08"/>
  <rect x="26" y="20" width="28" height="20" rx="7" fill="#38bdf824" stroke="#38bdf82e"/>
  <svg x="32.5" y="23.5" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M1.5 8.5C4 4.4 7.6 2.3 12 2.3s8 2.1 10.5 6.2c-2.5 4.1-6.1 6.2-10.5 6.2S4 12.6 1.5 8.5Z" fill="none" stroke="#38bdf8" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="12" cy="8.5" r="2.7" fill="none" stroke="#38bdf8" stroke-width="1.7"/>
  </svg>
  <text x="68" y="35" fill="#dbeafe" font-size="11" font-weight="800" letter-spacing="1.2" font-family="'Segoe UI',Ubuntu,sans-serif">PROFILE VIEWS</text>

  <text x="20" y="68" fill="#f8fafc" font-size="${getCountFontSize(countRaw)}" font-weight="800" font-family="'Segoe UI',Ubuntu,sans-serif">${count}</text>
  <text x="118" y="68" fill="#93c5fd" font-size="14" font-weight="700" font-family="'Segoe UI',Ubuntu,sans-serif">live counter</text>
  <rect x="20" y="78" width="112" height="3" rx="999" fill="url(#views-accent)"/>

  <g transform="translate(274 24)">
    <rect width="${trackedWidth}" height="44" rx="14" fill="#0a1323" fill-opacity="0.88" stroke="#314257"/>
    <text x="${trackedWidth / 2}" y="18" fill="#93a4b8" font-size="10" font-weight="800" letter-spacing="0.8" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="middle">TRACKED</text>
    <text x="${trackedWidth / 2}" y="33" fill="#e2e8f0" font-size="10.5" font-weight="700" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="middle">${username}</text>
  </g>
</svg>`;
}

function getCountFontSize(value) {
  if (value.length <= 5) return 28;
  if (value.length <= 8) return 25;
  return 22;
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function truncateText(text, maxChars) {
  return text.length > maxChars ? `${text.slice(0, maxChars - 3)}...` : text;
}

function escapeXml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
