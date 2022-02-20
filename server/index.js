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
const EventEmitter = require("events");
const eventemitter = new EventEmitter();
const faceapi = require("face-api.js");
const mime = require("mime");
const canvas = require("canvas");
const tf = require("@tensorflow/tfjs-node");

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

//set up login face router
const loginFaceStorage = multer.diskStorage({
  dest: function (req, file, cb) {
    cb(null, "./loginface/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const loginFaceUpload = multer({ storage: loginFaceStorage });

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

//set up register image router
const registerFaceStorage = multer.diskStorage({
  dest: function (req, file, cb) {
    cb(null, "./registerface/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const registerFaceUpload = multer({ storage: registerFaceStorage });

//Process login key image
app
  .route("/loginimage")
  .post(loginUpload.single("image--key"), function (req, res, next) {
    let id;
    const data = fs.readFileSync(req.file.path, "base64");
    const connection = mysqlConn();
    connection.connect();
    //Insert a account of fake ID of 9(10) with the input picture
    connection.query(
      `INSERT INTO keyimageandface (ID , keyImage) VALUES (2147483646 , '${data}')`
    );
    //Select ID with Picture of 9(10)
    connection.query(
      `SELECT ID FROM keyimageandface WHERE ID != 2147483646 and keyImage = (SELECT keyImage FROM keyimageandface WHERE ID = 2147483646)`,
      (err, res) => {
        if (err) throw err;
        app.locals.loginID = res[0];
        eventemitter.emit("loginImage");
      }
    );

    //Delete 9(10) and its picture data
    connection.query(`DELETE FROM keyimageandface WHERE ID = 2147483646`);
    connection.end();
    next();
  })
  .get(function (req, res) {
    eventemitter.on("loginImage", () => {
      res.json(app.locals.loginID);
    });
  });

//Process register key image
app
  .route("/registerimage")
  .post(registerUpload.single("r--image--key"), function (req, res, next) {
    console.log(req.file);
    const data = fs.readFileSync(req.file.path, "base64");
    const connection = mysqlConn();
    connection.connect();
    let newID;
    connection.query(`SELECT MAX(ID) FROM keyimageandface`, (err, res) => {
      if (err) throw err;
      if (res) {
        newID = res + 1;
      }
      console.log(newID);
      eventemitter.emit("regImage");
    });
    connection.end();
  })
  .get(function (req, res) {
    eventemitter.on("regImage", () => {
      res.json(app.locals.regID);
    });
  });

//Process login face picture
app
  .route("/loginface")
  .post(loginFaceUpload.single("login--face"), function (req, res, next) {
    const facedata = req.body.loginface.split(",")[1];
    const b64face = Buffer.from(facedata, "base64");
    jimp.read(b64face, (err, res) => {
      if (err) throw err;
      res.quality(100).write("temp/facePic.png");
    });
    let dbface;
    const connection = mysqlConn();
    connection.connect();
    connection.query(
      `SELECT faceImage FROM keyimageandface WHERE ID = ${app.locals.loginID.ID}`,
      (err, res) => {
        if (err) throw err;
        dbface = res;
        eventemitter.emit("loginface");
      }
    );
    connection.end();
    eventemitter.on("loginface", () => {
      dbface = JSON.stringify(dbface[0].faceImage);
      const buf = Buffer.from(JSON.parse(dbface).data);
      const dbface64 = buf.toString();
      const dbfacebuf = Buffer.from(dbface64, "base64");
      jimp.read(dbfacebuf, (err, res) => {
        if (err) throw err;
        res.quality(100).write("temp/dbface.png");
        eventemitter.emit("emptyTemp");
      });
    });
  });

eventemitter.on("emptyTemp", () => {
  fsExtra.emptyDirSync("./temp");
});

//Process register face picture
app
  .route("/registerface")
  .post(
    registerFaceUpload.single("register--face"),
    function (req, res, next) {}
  );

function mysqlConn() {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: null,
    database: "test",
  });
  return connection;
}

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
