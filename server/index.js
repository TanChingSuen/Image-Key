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
const { connect } = require("http2");
const b = require("based-blob");
global.atob = require("atob");
global.Blob = require("node-blob");

//Static file so I can use src from client file
app.use(express.static(__dirname + "/../client"));

//Kind of import this function
app.use(bodyParser.json());

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

//Process login key image

app
  .route("/loginimage")
  .post(loginUpload.single("image--key"), function (req, res, next) {
    let id;
    const data = fs.readFileSync(req.file.path, "base64");

    const connection = mysqlConn();
    connection.connect();
    connection.query(
      `SELECT ID from keyimageandface WHERE keyImage = '${blob}'`,
      function (err, res) {
        console.log(1, res);
      }
    );
    connection.query(
      `SELECT * from keyimageandface WHERE ID = 1`,
      function (err, res) {
        console.log(2, res);
      }
    );
    connection.end();
    app.locals.loginFindSame = 1;
    next();
  })
  .get(function (req, res) {
    setTimeout(() => {
      res.json({ findSame: app.locals.loginFindSame });
    }, 5000);
  });

//Process register key image
app
  .route("/registerimage")
  .post(registerUpload.single("r--image--key"), function (req, res, next) {
    console.log(req.file);
    const data = fs.readFileSync(req.file.path, "base64");
    app.locals.regFindSame = 1;
  })
  .get(function (req, res) {
    setTimeout(() => {
      res.json({ findSame: app.locals.regFindSame });
    }, 5000);
  });

function mysqlConn() {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: null,
    database: "test",
  });
  return connection;
}

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
