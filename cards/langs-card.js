export function renderLangsCard({ langs }) {
  const bg = "#0d1117";
  const border = "#21262d";
  const textPrimary = "#e6edf3";
  const textSecondary = "#7d8590";

  const palette = [
    "#0ea5e9","#8b5cf6","#10b981","#f59e0b","#ef4444",
    "#ec4899","#14b8a6","#f97316","#6366f1","#84cc16"
  ];

  const topLangs = langs.slice(0, 8);
  const total = topLangs.reduce((s, l) => s + l.size, 0);
  const items = topLangs.map((l, i) => ({
    name: l.name,
    pct: total > 0 ? (l.size / total) * 100 : 0,
    color: l.color || palette[i % palette.length],
  }));

  const width = 440;
  const donutCx = width - 110;
  const donutCy = 100;
  const donutR = 72;
  const donutInner = 46;
  const topPad = 58;
  const rowH = 26;
  const leftCols = Math.ceil(items.length / 2);
  const height = Math.max(topPad + leftCols * rowH + 28, donutCy + donutR + 28);

  let cumulativePct = 0;
  const arcs = items.map((item) => {
    const startAngle = (cumulativePct / 100) * 2 * Math.PI - Math.PI / 2;
    cumulativePct += item.pct;
    const endAngle = (cumulativePct / 100) * 2 * Math.PI - Math.PI / 2;
    const x1 = donutCx + donutR * Math.cos(startAngle);
    const y1 = donutCy + donutR * Math.sin(startAngle);
    const x2 = donutCx + donutR * Math.cos(endAngle);
    const y2 = donutCy + donutR * Math.sin(endAngle);
    const largeArc = item.pct > 50 ? 1 : 0;
    const xi1 = donutCx + donutInner * Math.cos(endAngle);
    const yi1 = donutCy + donutInner * Math.sin(endAngle);
    const xi2 = donutCx + donutInner * Math.cos(startAngle);
    const yi2 = donutCy + donutInner * Math.sin(startAngle);
    return `<path d="M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${donutR} ${donutR} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${xi1.toFixed(2)} ${yi1.toFixed(2)} A ${donutInner} ${donutInner} 0 ${largeArc} 0 ${xi2.toFixed(2)} ${yi2.toFixed(2)} Z" fill="${item.color}" opacity="0.92"/>`;
  }).join("\n");

  const half = Math.ceil(items.length / 2);
  const legendRows = items.map((item, i) => {
    const col = i < half ? 0 : 1;
    const row = i < half ? i : i - half;
    const x = col === 0 ? 20 : 230;
    const y = topPad + row * rowH;
    return `<g transform="translate(${x},${y})">
      <circle cx="6" cy="6" r="5" fill="${item.color}"/>
      <text x="16" y="11" font-size="12" fill="${textSecondary}" font-family="'Segoe UI',Ubuntu,sans-serif">${escapeXml(item.name)}</text>
      <text x="190" y="11" font-size="12" font-weight="700" fill="${textPrimary}" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="end">${item.pct.toFixed(1)}%</text>
    </g>`;
  }).join("\n");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Most Used Languages">
  <defs>
    <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <filter id="ds" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#0ea5e9" flood-opacity="0.25"/>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" rx="14" fill="${bg}"/>
  <rect width="${width}" height="${height}" rx="14" fill="none" stroke="${border}" stroke-width="1"/>
  <rect x="0" y="0" width="${width}" height="46" rx="14" fill="#161b22" opacity="0.6"/>
  <rect x="0" y="32" width="${width}" height="14" fill="#161b22" opacity="0.6"/>

  <rect x="20" y="14" width="140" height="2.5" rx="2" fill="url(#lg)"/>
  <text x="20" y="36" font-size="15" font-weight="700" fill="${textPrimary}" font-family="'Segoe UI',Ubuntu,sans-serif" letter-spacing="0.2">Most Used Languages</text>

  <circle cx="${donutCx}" cy="${donutCy}" r="${donutR}" fill="none" stroke="${border}" stroke-width="1" opacity="0.4"/>
  <g filter="url(#ds)">${arcs}</g>
  <circle cx="${donutCx}" cy="${donutCy}" r="${donutInner}" fill="${bg}"/>

  ${legendRows}
</svg>`;
}

function escapeXml(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
