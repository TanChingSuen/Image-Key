const express = require("express");
const path = require("path");
const app = express();

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/index.html"));
  console.log(1);
});

app.listen(3000);
