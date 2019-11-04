const path = require("path"); // use path module
const express = require("express"); // use express module
const hbs = require("hbs"); // use hbs view engine
const bodyParser = require("body-parser"); // use bodyParser middleware
const mysql = require("mysql"); // use mysql database

const app = express(); // create express app

// configure connection
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "apibuku"
});

// connect to db
conn.connect(err => {
  if (err) throw err;
  console.log("Mysql Connected ...");
});

// set views file
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// use body parser middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// set public folder
app.use("/assets", express.static(__dirname + "/public"));

// routes
// index : post list
app.get("/", (req, res) => {
  let sql = "select * from buku";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.render("index", {
      posts: results
    });
  });
});

// save new post
app.post("/posts", (req, res) => {
  let data = {
    judul: req.body.judul,
    pengarang: req.body.pengarang,
    penerbit: req.body.penerbit
  };
  let sql = "insert into buku set ?";
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// update post
app.post("/posts/edit", (req, res) => {
  let sql =
    'update buku set judul="' +
    req.body.judul +
    '", pengarang="' +
    req.body.pengarang +
    '", penerbit="' +
    req.body.penerbit +
    '" where id=' +
    req.body.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// delete post
app.post("/posts/delete", (req, res) => {
  let sql = "delete from buku where id=" + req.body.id + "";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// listen server
app.listen(3000, () => {
  console.log("Server is running at port 8000");
});
