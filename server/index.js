const express = require("express");
const path = require("path");
const app = express();

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.listen(3000);
