export function renderLangsCard({ langs }) {
  const bg = "#0d1117";
  const surface = "#161b22";
  const border = "#21262d";
  const textPrimary = "#e6edf3";
  const textSecondary = "#7d8590";
  const palette = ["#0ea5e9","#8b5cf6","#10b981","#f59e0b","#ef4444","#ec4899","#14b8a6","#f97316"];

  const topLangs = langs.slice(0, 8);
  const total = topLangs.reduce((s, l) => s + l.size, 0);
  const items = topLangs.map((l, i) => ({
    name: l.name,
    pct: total > 0 ? (l.size / total) * 100 : 0,
    color: l.color || palette[i % palette.length],
  }));

  const width = 800;
  const paddingX = 28;
  const headerH = 56;
  const rowH = 28;
  const legendRows = Math.ceil(items.length / 2);
  const legendH = legendRows * rowH;
  const height = headerH + legendH + 28;

  // Donut zone: right side
  const donutR = 80;
  const donutInner = 50;
  const donutCx = width - paddingX - donutR - 8;
  const donutCy = headerH + legendH / 2;

  // Legend zone: left side, max width = donutCx - donutR - paddingX - gap
  const legendMaxW = donutCx - donutR - paddingX - 20;
  const colW = Math.floor(legendMaxW / 2);

  let cum = 0;
  const arcs = items.map((item) => {
    const startA = (cum / 100) * 2 * Math.PI - Math.PI / 2;
    cum += item.pct;
    const endA = (cum / 100) * 2 * Math.PI - Math.PI / 2;
    const x1 = donutCx + donutR * Math.cos(startA);
    const y1 = donutCy + donutR * Math.sin(startA);
    const x2 = donutCx + donutR * Math.cos(endA);
    const y2 = donutCy + donutR * Math.sin(endA);
    const xi1 = donutCx + donutInner * Math.cos(endA);
    const yi1 = donutCy + donutInner * Math.sin(endA);
    const xi2 = donutCx + donutInner * Math.cos(startA);
    const yi2 = donutCy + donutInner * Math.sin(startA);
    const large = item.pct > 50 ? 1 : 0;
    return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${donutR} ${donutR} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L${xi1.toFixed(1)} ${yi1.toFixed(1)} A${donutInner} ${donutInner} 0 ${large} 0 ${xi2.toFixed(1)} ${yi2.toFixed(1)}Z" fill="${item.color}" opacity="0.9"/>`;
  }).join("");

  const half = Math.ceil(items.length / 2);
  const legendSVG = items.map((item, i) => {
    const col = i < half ? 0 : 1;
    const row = i < half ? i : i - half;
    const x = paddingX + col * colW;
    const y = headerH + row * rowH + rowH / 2;
    return `<g>
      <circle cx="${x + 6}" cy="${y}" r="5" fill="${item.color}"/>
      <text x="${x + 18}" y="${y + 4}" font-size="12.5" fill="${textSecondary}" font-family="'Segoe UI',Ubuntu,sans-serif">${escapeXml(item.name)}</text>
      <text x="${x + colW - 8}" y="${y + 4}" font-size="12.5" font-weight="700" fill="${textPrimary}" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="end">${item.pct.toFixed(1)}%</text>
    </g>`;
  }).join("");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img">
  <defs>
    <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <filter id="ds">
      <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#0ea5e9" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" rx="14" fill="${bg}"/>
  <rect width="${width}" height="${height}" rx="14" fill="none" stroke="${border}" stroke-width="1"/>
  <rect x="0" y="0" width="${width}" height="${headerH}" rx="14" fill="${surface}" opacity="0.7"/>
  <rect x="0" y="${headerH - 14}" width="${width}" height="14" fill="${surface}" opacity="0.7"/>

  <rect x="${paddingX}" y="12" width="160" height="2.5" rx="2" fill="url(#lg)"/>
  <text x="${paddingX}" y="${headerH - 14}" font-size="16" font-weight="700" fill="${textPrimary}" font-family="'Segoe UI',Ubuntu,sans-serif">Most Used Languages</text>

  ${legendSVG}

  <circle cx="${donutCx}" cy="${donutCy}" r="${donutR}" fill="none" stroke="${border}" stroke-width="1" opacity="0.3"/>
  <g filter="url(#ds)">${arcs}</g>
  <circle cx="${donutCx}" cy="${donutCy}" r="${donutInner}" fill="${bg}"/>
</svg>`;
}

function escapeXml(str) {
  return String(str||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
