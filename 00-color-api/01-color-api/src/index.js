const express = require("express");
const os = require("os");

const app = express();
const port = 80;
const color = "red";
const hostname = os.hostname();

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

app.listen(port, () => {
  console.log(`Color API running on port: ${port}`);
});
