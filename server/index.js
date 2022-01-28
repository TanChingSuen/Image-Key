const express = require("express");
const path = require("path");
const app = express();

app.get("../src/js/test.js", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/src/js/test.js"));
});

app.get("../src/js/controller.js", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/src/js/controller.js"));
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
