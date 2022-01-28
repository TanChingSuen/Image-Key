const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql");
const { rootCertificates } = require("tls");

app.use(express.static(__dirname + "/../client"));

app.get("/test", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: null,
  database: "test",
});

connection.connect();

connection.query(
  "SELECT password FROM `test1` WHERE ID = 1",
  function (err, res, fields) {
    console.log(res);
  }
);

connection.end();

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
