import express from "express";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

async function loadHandler(handlerPath) {
  const mod = await import(handlerPath);
  return mod.default;
}

app.get("/api/index", async (req, res) => {
  const handler = await loadHandler("./github-readme-stats/api/index.js");
  return handler(req, res);
});

app.get("/api/top-langs", async (req, res) => {
  const handler = await loadHandler("./github-readme-stats/api/top-langs.js");
  return handler(req, res);
});

app.get("/api/pin", async (req, res) => {
  const handler = await loadHandler("./github-readme-stats/api/pin.js");
  return handler(req, res);
});

app.get("/api/wakatime", async (req, res) => {
  const handler = await loadHandler("./github-readme-stats/api/wakatime.js");
  return handler(req, res);
});

app.get("/", (req, res) => {
  res.send("GitHub Stats Server is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
