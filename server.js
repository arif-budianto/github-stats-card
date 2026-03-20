import express from "express";
import { fetchStats, fetchLangs } from "./fetcher.js";
import { renderStatsCard } from "./cards/stats-card.js";
import { renderLangsCard } from "./cards/langs-card.js";

const app = express();
const PORT = process.env.PORT || 3000;

function sendSVG(res, svg) {
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(svg);
}

function errorSVG(message) {
  return `<svg width="440" height="120" viewBox="0 0 440 120" xmlns="http://www.w3.org/2000/svg">
  <rect width="440" height="120" rx="14" fill="#0d1117"/>
  <rect width="440" height="120" rx="14" fill="none" stroke="#21262d" stroke-width="1"/>
  <text x="20" y="50" font-size="13" fill="#ef4444" font-family="'Segoe UI',Ubuntu,sans-serif">${message}</text>
</svg>`;
}

app.get("/api/stats", async (req, res) => {
  const username = req.query.username;
  if (!username) return sendSVG(res, errorSVG("Missing username parameter"));
  try {
    const data = await fetchStats(username);
    sendSVG(res, renderStatsCard(data));
  } catch (err) {
    console.error(err);
    sendSVG(res, errorSVG("Failed to fetch stats: " + err.message));
  }
});

app.get("/api/langs", async (req, res) => {
  const username = req.query.username;
  if (!username) return sendSVG(res, errorSVG("Missing username parameter"));
  try {
    const langs = await fetchLangs(username);
    sendSVG(res, renderLangsCard({ langs }));
  } catch (err) {
    console.error(err);
    sendSVG(res, errorSVG("Failed to fetch langs: " + err.message));
  }
});

app.get("/", (req, res) => {
  res.send("GitHub Stats Server OK");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
