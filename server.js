const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
require("./config/connection");

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// routes
require("./controllers/articles_controller")(app)


app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
