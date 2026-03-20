import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/api/index", async (req, res) => {
  try {
    const { default: handler } = await import("./github-readme-stats/api/index.js");
    return handler(req, res);
  } catch (err) {
    console.error("Error in /api/index:", err);
    res.status(500).send(err.message);
  }
});

app.get("/api/top-langs", async (req, res) => {
  try {
    const { default: handler } = await import("./github-readme-stats/api/top-langs.js");
    return handler(req, res);
  } catch (err) {
    console.error("Error in /api/top-langs:", err);
    res.status(500).send(err.message);
  }
});

app.get("/api/pin", async (req, res) => {
  try {
    const { default: handler } = await import("./github-readme-stats/api/pin.js");
    return handler(req, res);
  } catch (err) {
    console.error("Error in /api/pin:", err);
    res.status(500).send(err.message);
  }
});

app.get("/", (req, res) => {
  res.send("GitHub Stats Server is running.");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
