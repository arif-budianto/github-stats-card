import express from "express";
import { fetchStats, fetchLangs, fetchProgress, fetchHero, fetchProfileViews } from "./fetcher.js";
import { renderStatsCard } from "./cards/stats-card.js";
import { renderLangsCard } from "./cards/langs-card.js";
import { renderProgressCard } from "./cards/progress-card.js";
import { renderHeroCard } from "./cards/hero-card.js";
import { renderContactCard } from "./cards/contact-card.js";
import { renderViewsCard } from "./cards/views-card.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.disable("etag");

function sendSVG(res, svg, options = {}) {
  const cacheControl = options.cacheControl || "no-cache";
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", cacheControl);
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (options.pragma) res.setHeader("Pragma", options.pragma);
  if (options.expires) res.setHeader("Expires", options.expires);
  if (options.lastModified) res.setHeader("Last-Modified", options.lastModified);
  if (options.surrogateControl) res.setHeader("Surrogate-Control", options.surrogateControl);
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

app.get("/api/progress", async (req, res) => {
  const username = req.query.username;
  if (!username) return sendSVG(res, errorSVG("Missing username parameter"));
  try {
    const progress = await fetchProgress(username);
    sendSVG(res, renderProgressCard(progress));
  } catch (err) {
    console.error(err);
    sendSVG(res, errorSVG("Failed to fetch progress: " + err.message));
  }
});

app.get("/api/hero", async (req, res) => {
  const username = req.query.username;
  if (!username) return sendSVG(res, errorSVG("Missing username parameter"));
  try {
    const hero = await fetchHero(username);
    sendSVG(res, renderHeroCard(hero, {
      titlePrimary: req.query.title_primary,
      titleSecondary: req.query.title_secondary,
      experience: req.query.experience,
      tagline: req.query.tagline,
    }));
  } catch (err) {
    console.error(err);
    sendSVG(res, errorSVG("Failed to fetch hero: " + err.message));
  }
});

app.get("/api/contact", (req, res) => {
  sendSVG(res, renderContactCard({
    label: req.query.label,
    value: req.query.value,
    accent: req.query.accent,
    icon: req.query.icon,
  }));
});

app.get("/api/views", async (req, res) => {
  const username = req.query.username;
  if (!username) return sendSVG(res, errorSVG("Missing username parameter"), {
    cacheControl: "no-store, no-cache, max-age=0, must-revalidate",
    pragma: "no-cache",
    expires: "0",
    lastModified: new Date().toUTCString(),
    surrogateControl: "no-store",
  });
  try {
    const views = await fetchProfileViews(username);
    sendSVG(res, renderViewsCard({
      ...views,
      trackedLabel: req.query.tracked_label,
    }), {
      cacheControl: "no-store, no-cache, max-age=0, must-revalidate",
      pragma: "no-cache",
      expires: "0",
      lastModified: new Date().toUTCString(),
      surrogateControl: "no-store",
    });
  } catch (err) {
    console.error(err);
    sendSVG(res, errorSVG("Failed to fetch views: " + err.message), {
      cacheControl: "no-store, no-cache, max-age=0, must-revalidate",
      pragma: "no-cache",
      expires: "0",
      lastModified: new Date().toUTCString(),
      surrogateControl: "no-store",
    });
  }
});

app.get("/", (req, res) => {
  res.send("GitHub Stats Server OK");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
