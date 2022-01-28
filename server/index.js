const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(__dirname + "/../client"));

app.get("/test", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/dist/login.html"));
});

app.get("/register", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/dist/register.html"));
});

app.listen(3000);
