export function renderLangsCard({ langs }) {
  const bg = "#0f172a";
  const surface = "#162033";
  const border = "#243247";
  const textPrimary = "#e2e8f0";
  const textSecondary = "#93a4b8";
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
  const headerH = 96;
  const rowH = 34;
  const legendGap = 36;
  const donutR = 112;
  const donutInner = 66;
  const donutCx = width - paddingX - donutR - 12;
  const donutCy = headerH + Math.max(finalItems.length * rowH, donutR * 2) / 2;
  const legendAreaW = donutCx - donutR - legendGap - paddingX;
  const contentH = Math.max(finalItems.length * rowH, donutR * 2);
  const height = headerH + contentH + 24;

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
  <defs>
    <linearGradient id="langs-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#101a31"/>
      <stop offset="55%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#111b2f"/>
    </linearGradient>
    <linearGradient id="langs-surface" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#172338"/>
      <stop offset="100%" stop-color="#121c2d"/>
    </linearGradient>
    <radialGradient id="langs-glow-a" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="langs-glow-b" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22c55e" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#22c55e" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="langs-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="50%" stop-color="#7dd3fc" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <pattern id="langs-grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#60a5fa" stroke-width="0.8" opacity="0.08"/>
    </pattern>
  </defs>

  <rect width="${width}" height="${height}" rx="14" fill="url(#langs-bg)"/>
  <rect width="${width}" height="${height}" rx="14" fill="url(#langs-grid)"/>
  <circle cx="188" cy="120" r="180" fill="url(#langs-glow-a)">
    <animate attributeName="cx" values="160;216;160" dur="18s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="108;136;108" dur="16s" repeatCount="indefinite"/>
  </circle>
  <circle cx="632" cy="246" r="196" fill="url(#langs-glow-b)">
    <animate attributeName="cx" values="632;598;632" dur="20s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="246;218;246" dur="15s" repeatCount="indefinite"/>
  </circle>
  <rect x="-220" y="0" width="340" height="${height}" fill="url(#langs-sweep)" opacity="0.42">
    <animate attributeName="x" values="-240;820" dur="20s" repeatCount="indefinite"/>
  </rect>
  <rect x="0" y="0" width="${width}" height="${height}" rx="14" fill="${bg}" opacity="0.32"/>
  <rect width="${width}" height="${height}" rx="14" fill="none" stroke="${border}" stroke-width="1"/>
  <path d="M14 0h772c7.732 0 14 6.268 14 14v66H0V14C0 6.268 6.268 0 14 0Z" fill="url(#langs-surface)" opacity="0.84"/>

  <rect x="${paddingX}" y="22" width="120" height="3" rx="999" fill="${accent}"/>
  <text x="${paddingX}" y="62" font-size="17" font-weight="700" fill="${textPrimary}" font-family="'Segoe UI',Ubuntu,sans-serif">Most Used Languages</text>

  <line x1="${paddingX}" y1="${headerH}" x2="${width - paddingX}" y2="${headerH}" stroke="${border}" stroke-width="1" opacity="0.7"/>

  ${legendSVG}

  <circle cx="${f(donutCx)}" cy="${f(donutCy)}" r="${donutR + 10}" fill="none" stroke="#7dd3fc" stroke-opacity="0.1" stroke-width="1.5" stroke-dasharray="3 9">
    <animateTransform attributeName="transform" type="rotate" from="0 ${f(donutCx)} ${f(donutCy)}" to="360 ${f(donutCx)} ${f(donutCy)}" dur="28s" repeatCount="indefinite"/>
  </circle>
  <circle cx="${f(donutCx)}" cy="${f(donutCy)}" r="${donutR}" fill="none" stroke="${border}" stroke-width="1.5" opacity="0.42"/>
  <g>${arcs}</g>
  <circle cx="${f(donutCx)}" cy="${f(donutCy)}" r="${donutInner}" fill="#111a2d" opacity="0.94"/>
</svg>`;
}

const f = (n) => parseFloat(n.toFixed(1));

function escapeXml(str) {
  return String(str||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function truncateText(text, maxChars) {
  return text.length > maxChars ? `${text.slice(0, maxChars - 1)}…` : text;
}
