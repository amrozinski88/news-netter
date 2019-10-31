const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

axios.get("https://www.bbc.com/news/technology").then(response => {
  const scrapedItems = [];
  const $ = cheerio.load(response.data);
  // console.log($("a.title")[0])
  $("div.gs-c-promo-body").each((i, element) => {
    const title = $(element).find("a.gs-c-promo-heading").text();
    const link = `https://www.bbc.com${$(element).find("a.gs-c-promo-heading").attr("href")}`;
    const summary = $(element).find("p.gs-c-promo-summary").text();
    if (link !== "" && summary !== "" && $(element).find("span.qa-offscreen").text() === "") {

      if(!scrapedItems.length || !scrapedItems.find(item=>item.title === title)){
        scrapedItems.push({
          title: title,
          link: link,
          summary: summary
        })
      }
      
    }
  });
  console.log(scrapedItems)

}).catch(error => {
  console.log(error)
});

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
