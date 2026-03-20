export function renderLangsCard({ langs }) {
  const bg = "#0d1117";
  const surface = "#161b22";
  const border = "#21262d";
  const textPrimary = "#e6edf3";
  const textSecondary = "#7d8590";
  const palette = ["#0ea5e9","#8b5cf6","#10b981","#f59e0b","#ef4444","#ec4899","#14b8a6","#f97316"];

  const items = langs.slice(0, 8).map((l, i) => {
    const total = langs.slice(0, 8).reduce((s, x) => s + x.size, 0);
    return {
      name: l.name,
      pct: total > 0 ? (l.size / total) * 100 : 0,
      color: l.color || palette[i % palette.length],
    };
  });

  // Recalculate total after slicing
  const total = langs.slice(0, 8).reduce((s, l) => s + l.size, 0);
  const finalItems = langs.slice(0, 8).map((l, i) => ({
    name: l.name,
    pct: total > 0 ? (l.size / total) * 100 : 0,
    color: l.color || palette[i % palette.length],
  }));

  // Layout constants
  const width = 800;
  const paddingX = 28;
  const headerH = 56;
  const rowH = 30;
  const numRows = Math.ceil(finalItems.length / 2);
  const legendAreaW = 420; // fixed legend area width, left side
  const donutZoneX = legendAreaW + paddingX; // donut starts here
  const donutZoneW = width - donutZoneX - paddingX; // remaining width for donut
  const donutR = Math.floor(donutZoneW / 2) - 10; // donut radius fits in zone
  const donutInner = Math.floor(donutR * 0.55);
  const donutCx = donutZoneX + donutZoneW / 2;
  const contentH = numRows * rowH;
  const height = headerH + Math.max(contentH, donutR * 2 + 20) + 24;
  const donutCy = headerH + Math.max(contentH, donutR * 2 + 20) / 2;

  // Donut arcs
  let cum = 0;
  const arcs = finalItems.map((item) => {
    const startA = (cum / 100) * 2 * Math.PI - Math.PI / 2;
    cum += item.pct;
    const endA = (cum / 100) * 2 * Math.PI - Math.PI / 2;
    if (Math.abs(endA - startA) < 0.001) return "";
    const x1 = donutCx + donutR * Math.cos(startA);
    const y1 = donutCy + donutR * Math.sin(startA);
    const x2 = donutCx + donutR * Math.cos(endA);
    const y2 = donutCy + donutR * Math.sin(endA);
    const xi1 = donutCx + donutInner * Math.cos(endA);
    const yi1 = donutCy + donutInner * Math.sin(endA);
    const xi2 = donutCx + donutInner * Math.cos(startA);
    const yi2 = donutCy + donutInner * Math.sin(startA);
    const large = item.pct > 50 ? 1 : 0;
    return `<path d="M${f(x1)} ${f(y1)} A${donutR} ${donutR} 0 ${large} 1 ${f(x2)} ${f(y2)} L${f(xi1)} ${f(yi1)} A${donutInner} ${donutInner} 0 ${large} 0 ${f(xi2)} ${f(yi2)}Z" fill="${item.color}" opacity="0.92"/>`;
  }).join("");

  // Legend rows — 2 columns, each column width = legendAreaW/2
  const colW = (legendAreaW - paddingX) / 2;
  const half = Math.ceil(finalItems.length / 2);
  const legendSVG = finalItems.map((item, i) => {
    const col = i < half ? 0 : 1;
    const row = i < half ? i : i - half;
    const x = paddingX + col * colW;
    const y = headerH + row * rowH + rowH / 2;
    const nameMaxW = colW - 60;
    return `<g>
      <circle cx="${f(x + 6)}" cy="${f(y)}" r="5" fill="${item.color}"/>
      <text x="${f(x + 18)}" y="${f(y + 4)}" font-size="12.5" fill="${textSecondary}" font-family="'Segoe UI',Ubuntu,sans-serif">${escapeXml(item.name)}</text>
      <text x="${f(x + colW - 8)}" y="${f(y + 4)}" font-size="12.5" font-weight="700" fill="${textPrimary}" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="end">${item.pct.toFixed(1)}%</text>
    </g>`;
  }).join("");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Most Used Languages">
  <defs>
    <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <filter id="ds" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#0ea5e9" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" rx="14" fill="${bg}"/>
  <rect width="${width}" height="${height}" rx="14" fill="none" stroke="${border}" stroke-width="1"/>
  <rect x="0" y="0" width="${width}" height="${headerH}" rx="14" fill="${surface}" opacity="0.7"/>
  <rect x="0" y="${headerH - 14}" width="${width}" height="14" fill="${surface}" opacity="0.7"/>

  <rect x="${paddingX}" y="12" width="160" height="2.5" rx="2" fill="url(#lg)"/>
  <text x="${paddingX}" y="${headerH - 14}" font-size="16" font-weight="700" fill="${textPrimary}" font-family="'Segoe UI',Ubuntu,sans-serif">Most Used Languages</text>

  ${legendSVG}

  <circle cx="${f(donutCx)}" cy="${f(donutCy)}" r="${donutR}" fill="none" stroke="${border}" stroke-width="1" opacity="0.3"/>
  <g filter="url(#ds)">${arcs}</g>
  <circle cx="${f(donutCx)}" cy="${f(donutCy)}" r="${donutInner}" fill="${bg}"/>
</svg>`;
}

const f = (n) => parseFloat(n.toFixed(1));

function escapeXml(str) {
  return String(str||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
