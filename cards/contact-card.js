export function renderContactCard(options = {}) {
  const width = 390;
  const height = 96;
  const label = escapeXml(cleanText(options.label || "Contact").toUpperCase());
  const valueRaw = truncateText(cleanText(options.value || "Available"), 30);
  const value = escapeXml(valueRaw);
  const accent = normalizeColor(options.accent, "#38bdf8");
  const icon = renderIcon(cleanText(options.icon || "globe"), accent);
  const valueFontSize = getValueFontSize(valueRaw);
  const badgeWidth = 136;

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label} ${value}">
  <defs>
    <linearGradient id="contact-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111a2d"/>
      <stop offset="100%" stop-color="#0f1728"/>
    </linearGradient>
    <linearGradient id="contact-accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${withOpacity(accent, 0.45)}"/>
    </linearGradient>
    <radialGradient id="contact-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(316 26) rotate(148) scale(126 62)">
      <stop offset="0%" stop-color="${withOpacity(accent, 0.18)}"/>
      <stop offset="100%" stop-color="${withOpacity(accent, 0)}"/>
    </radialGradient>
    <pattern id="contact-grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M24 0H0V24" fill="none" stroke="#60a5fa" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${width}" height="${height}" rx="20" fill="url(#contact-bg)"/>
  <rect width="${width}" height="${height}" rx="20" fill="url(#contact-grid)"/>
  <ellipse cx="318" cy="28" rx="130" ry="70" fill="url(#contact-glow)"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="19" fill="none" stroke="#2a3950"/>
  <rect x="20" y="16" width="${badgeWidth}" height="28" rx="10" fill="#0a1323" fill-opacity="0.92" stroke="#314257"/>
  <rect x="20" y="16" width="${badgeWidth}" height="28" rx="10" fill="url(#contact-accent)" opacity="0.08"/>
  <rect x="26" y="20" width="28" height="20" rx="7" fill="${withOpacity(accent, 0.14)}" stroke="${withOpacity(accent, 0.18)}"/>
  <svg x="32" y="22" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">${icon}</svg>
  <text x="68" y="35" fill="#dbeafe" font-size="11" font-weight="800" letter-spacing="1.2" font-family="'Segoe UI',Ubuntu,sans-serif">${label}</text>
  <text x="20" y="68" fill="#f8fafc" font-size="${valueFontSize}" font-weight="800" font-family="'Segoe UI',Ubuntu,sans-serif">${value}</text>
  <rect x="20" y="78" width="96" height="3" rx="999" fill="url(#contact-accent)"/>
  <circle cx="356" cy="50" r="12" fill="none" stroke="${withOpacity(accent, 0.22)}" stroke-width="1.5"/>
  <circle cx="356" cy="50" r="4" fill="${accent}">
    <animate attributeName="opacity" values="0.35;1;0.35" dur="2.8s" repeatCount="indefinite"/>
  </circle>
</svg>`;
}

function getValueFontSize(value) {
  if (value.length <= 18) return 24;
  if (value.length <= 24) return 20;
  return 17;
}

function renderIcon(type, accent) {
  const stroke = accent;
  switch (type.toLowerCase()) {
    case "mail":
    case "email":
      return `<path d="M2 4.5A2.5 2.5 0 0 1 4.5 2h15A2.5 2.5 0 0 1 22 4.5v11A2.5 2.5 0 0 1 19.5 18h-15A2.5 2.5 0 0 1 2 15.5Zm1.8.7 8.1 5.6a2 2 0 0 0 2.2 0l8.1-5.6" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    case "whatsapp":
      return `<path d="M12 3.5A8.5 8.5 0 0 0 4.7 16l-1 4 4-1a8.5 8.5 0 1 0 4.3-15.5Z" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.2 8.5c.2-.4.4-.4.7-.4h.6c.2 0 .4 0 .5.4l.7 1.8c.1.3 0 .5-.2.7l-.5.6c.5 1 1.4 1.8 2.4 2.3l.7-.5c.2-.1.4-.2.7-.1l1.7.7c.4.2.4.4.4.6v.6c0 .4-.2.6-.5.7-.6.2-1.2.3-1.8.2-3.1-.6-5.6-3-6.2-6.1-.1-.6 0-1.2.2-1.8Z" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    case "linkedin":
      return `<path d="M4.5 8.5V19.5" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/><path d="M4.5 4.8a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6Z" fill="${stroke}"/><path d="M10 19.5V11.8c0-1.7 1.3-3.1 3-3.1s3 1.4 3 3.1v7.7" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 12c0-1.8 1.4-3.2 3.2-3.2 1.7 0 3 1.4 3 3.2" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>`;
    default:
      return `<circle cx="12" cy="12" r="8.5" fill="none" stroke="${stroke}" stroke-width="1.8"/><path d="M3.8 12h16.4M12 3.5a13.5 13.5 0 0 1 0 17M12 3.5a13.5 13.5 0 0 0 0 17" fill="none" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round"/>`;
  }
}

function normalizeColor(value, fallback) {
  const color = String(value || "").trim();
  if (/^#?[0-9a-fA-F]{6}$/.test(color)) {
    return color.startsWith("#") ? color : `#${color}`;
  }
  return fallback;
}

function withOpacity(hex, opacity) {
  const color = normalizeColor(hex, "#38bdf8").slice(1);
  const alpha = Math.round(Math.max(0, Math.min(1, opacity)) * 255).toString(16).padStart(2, "0");
  return `#${color}${alpha}`;
}

function truncateText(text, maxChars) {
  return text.length > maxChars ? `${text.slice(0, maxChars - 3)}...` : text;
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
