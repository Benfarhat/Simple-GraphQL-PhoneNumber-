const express = require("express");
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
var { PhoneNumber } = require("./Models/mongoose");

// Mongoose connection
mongoose.connect("mongodb://localhost:27017/local");

var db = mongoose.connection;
db.on("error", e => {
  console.error(
    "💥 Connection to mongo failed (do you start mongod service?)",
    e
  );
});
db.once("open", () => {
  console.log("🚀 Connection to mongo succeded...");
});


// Express server

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.listen(3000, () => {
  console.log("Server is working...");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/quotes", (req, res) => {
  res.end();
  console.log('---------------------')
  console.log(PhoneNumber);
});

app.post("/quotes", (req, res) => {

  var newContact = new PhoneNumber({
    itemId: 1,
    name: req.body.name,
    phone: req.body.phone,
    isActive: false
  });

  newContact.save((err, result) => {
    if (err) {
      console.log("A problem has occured: " + err);
    }
    console.log("New contact saved successfully: " + newContact.name);

    res.redirect("/");
  });

});
