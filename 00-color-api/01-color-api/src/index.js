const express = require("express");
const os = require("os");
const fs = require("fs");
const path = require("path");

const getColor = () => {
  let color = process.env.DEFAULT_COLOR;
  const filePath = process.env.COLOR_CONFIG_PATH;
  if (filePath) {
    try {
      const colorFromFile = fs.readFileSync(path.resolve(filePath), "utf-8");
      color = colorFromFile.trim();
    } catch (error) {
      console.error(`Failed to read contents of ${filePath}`);
      console.error(error);
    }
  }
  return color || "red";
};

const app = express();
const port = 80;
const color = getColor();
const hostname = os.hostname();

const delay_startup = process.env.DELAY_STARTUP === "true";
const fail_liveness = process.env.FAIL_LIVENESS === "true";
const fail_readiness = process.env.FAIL_READINESS === "true" ? Math.random() < 0.5 : false;

console.log(`Delay startup : ${delay_startup}`);
console.log(`Fail liveness : ${fail_liveness}`);
console.log(`Fail readiness : ${fail_readiness}`);

app.get("/", (req, res) => {
  res.send(`<h1 style="color${color};">hello from color-api!</h1><h2>hostname: ${hostname}</h2>`);
});

app.get("/api", (req, res) => {
  console.log(req.query);
  if (req.query.format === "json") {
    return res.json({
      color,
      hostname,
    });
  } else {
    return res.send(`color: ${color}\nhostname: ${hostname}`);
  }
});

app.get("/ready", (req, res) => {
  if (fail_readiness) {
    return res.sendStatus(503);
  }
  return res.send("ok");
});

app.get("/up", (req, res) => {
  return res.send("ok");
});

app.get("/health", (req, res) => {
  if (fail_liveness) {
    return res.sendStatus(503);
  }
  return res.send("ok");
});

if (delay_startup) {
  const start = Date.now();
  while (Date.now() - start < 60000) {}
}

app.listen(port, () => {
  console.log(`Color API running on port: ${port}`);
});
