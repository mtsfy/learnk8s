const express = require("express");

const app = express();
const port = 80;

app.get("/", (req, res) => {
  res.send("hello from color-api!");
});

app.listen(port, () => {
  console.log(`Color API running on port: ${port}`);
});
