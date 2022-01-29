//All the require
const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql");
const multer = require("multer");
const bodyParser = require("body-parser");
const { rootCertificates } = require("tls");

//Static file so I can use src from client file
app.use(express.static(__dirname + "/../client"));

//Kind of import this function
app.use(bodyParser.json());

//test localhost port
app.get("/test", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

//Get a storage for those image
const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

//test of the mysql connection
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

//Main website
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

//Login page
app.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/dist/login.html"));
});

//Register page
app.get("/register", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/dist/register.html"));
});

app.listen(3000);
