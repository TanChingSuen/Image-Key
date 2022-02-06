//All the require
const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();
const mysql = require("mysql");
const multer = require("multer");
const bodyParser = require("body-parser");
const { rootCertificates } = require("tls");
const fsExtra = require("fs-extra");
const jimp = require("jimp");

//Static file so I can use src from client file
app.use(express.static(__dirname + "/../client"));

//Kind of import this function
app.use(bodyParser.json());

//test localhost port
app.get("/test", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

//set up login image router
const loginStorage = multer.diskStorage({
  dest: function (req, file, cb) {
    cb(null, "./loginimage/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const loginUpload = multer({ storage: loginStorage });

//set up register image router
const registerStorage = multer.diskStorage({
  dest: function (req, file, cb) {
    cb(null, "./registerimage/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const registerUpload = multer({ storage: registerStorage });

app.post(
  "/loginimage",
  loginUpload.single("image--key"),
  function (req, res, next) {
    console.log(req.file);
    const data = jimp.read(req.file.path, function (err, img) {
      img.getBase64(jimp.AUTO, function (err, data) {
        console.log(data);
        return data;
      });
    });
    fs.unlink(req.path, (err) => console.log(err));
  }
);

app.post(
  "/registerimage",
  registerUpload.single("r--image--key"),
  function (req, res, next) {
    console.log(req.file);
    const data = jimp.read(req.file.path, function (err, img) {
      img.getBase64(jimp.AUTO, function (err, data) {
        console.log(data);
        return data;
      });
    });
    fs.unlink(req.path, (err) => console.log(err));
  }
);

/*
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
*/

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
