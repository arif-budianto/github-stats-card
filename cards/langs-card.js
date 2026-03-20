export function renderLangsCard({ langs }) {
  const bg = "#0d1117";
  const surface = "#151b23";
  const border = "#21262d";
  const textPrimary = "#e6edf3";
  const textSecondary = "#7d8590";
  const accent = "#38bdf8";
  const palette = ["#3b82f6","#14b8a6","#7c3aed","#fde047","#f97316","#38bdf8","#ef4444","#34d399"];

  const total = langs.slice(0, 8).reduce((s, l) => s + l.size, 0);
  const finalItems = langs.slice(0, 8).map((l, i) => ({
    name: l.name,
    pct: total > 0 ? (l.size / total) * 100 : 0,
    color: l.color || palette[i % palette.length],
  }));

  const width = 800;
  const paddingX = 34;
  const headerH = 82;
  const rowH = 34;
  const legendGap = 40;
  const donutR = 118;
  const donutInner = 72;
  const donutCx = width - paddingX - donutR - 6;
  const donutCy = headerH + Math.max(finalItems.length * rowH, donutR * 2) / 2;
  const legendAreaW = donutCx - donutR - legendGap - paddingX;
  const contentH = Math.max(finalItems.length * rowH, donutR * 2);
  const height = headerH + contentH + 22;

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
    return `<path d="M${f(x1)} ${f(y1)} A${donutR} ${donutR} 0 ${large} 1 ${f(x2)} ${f(y2)} L${f(xi1)} ${f(yi1)} A${donutInner} ${donutInner} 0 ${large} 0 ${f(xi2)} ${f(yi2)}Z" fill="${item.color}" opacity="0.96"/>`;
  }).join("");

  const legendSVG = finalItems.map((item, i) => {
    const y = headerH + i * rowH + rowH / 2;
    return `<g>
      <circle cx="${paddingX + 8}" cy="${f(y)}" r="6" fill="${item.color}"/>
      <text x="${paddingX + 26}" y="${f(y)}" font-size="14" fill="${textSecondary}" font-family="'Segoe UI',Ubuntu,sans-serif" dominant-baseline="middle">${escapeXml(truncateText(item.name, 20))}</text>
      <text x="${paddingX + legendAreaW}" y="${f(y)}" font-size="14" font-weight="700" fill="${textPrimary}" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="end" dominant-baseline="middle">${item.pct.toFixed(1)}%</text>
    </g>`;
  }).join("");

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Most Used Languages">
  <rect width="${width}" height="${height}" rx="14" fill="${bg}"/>
  <rect width="${width}" height="${height}" rx="14" fill="none" stroke="${border}" stroke-width="1"/>
  <path d="M14 0h772c7.732 0 14 6.268 14 14v54H0V14C0 6.268 6.268 0 14 0Z" fill="${surface}"/>

  <rect x="${paddingX}" y="22" width="120" height="3" rx="999" fill="${accent}"/>
  <text x="${paddingX}" y="54" font-size="17" font-weight="700" fill="${textPrimary}" font-family="'Segoe UI',Ubuntu,sans-serif">Most Used Languages</text>

  <line x1="${paddingX}" y1="${headerH}" x2="${width - paddingX}" y2="${headerH}" stroke="${border}" stroke-width="1" opacity="0.7"/>

  ${legendSVG}

  <circle cx="${f(donutCx)}" cy="${f(donutCy)}" r="${donutR}" fill="none" stroke="${border}" stroke-width="1.5" opacity="0.4"/>
  <g>${arcs}</g>
  <circle cx="${f(donutCx)}" cy="${f(donutCy)}" r="${donutInner}" fill="${bg}"/>
</svg>`;
}

const f = (n) => parseFloat(n.toFixed(1));

function escapeXml(str) {
  return String(str||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function truncateText(text, maxChars) {
  return text.length > maxChars ? `${text.slice(0, maxChars - 1)}…` : text;
}
