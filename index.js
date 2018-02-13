const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const { PhoneNumber } = require("./Models/mongoose");
const { schema } = require("./Schema/Schema");
const graphqlHTTP = require('express-graphql');


// Mongoose connection
mongoose.connect("mongodb://localhost:27017/test");

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


app.use('/graphql', graphqlHTTP (req => ({
  schema,
  graphiql:true
 })))

app.listen(3333, () => {
  console.log("Server is working...");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


app.post("/addContact", (req, res) => {




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
