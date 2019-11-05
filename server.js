const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
require("./config/connection");
const app = express();



const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars",handlebars({defaultLayout:"main"}))
app.set("view engine","handlebars")

// routes
require("./controllers/articles_controller")(app)


app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
