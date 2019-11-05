const cheerio = require("cheerio");
const axios = require("axios");
const db = require("../models/index");
module.exports = app => {
  app.get("/", (req, res) => {
    db.Article.find()
      .sort({ published: 1 })
      .then(articles => {
        res.render("index", { articles: articles });
      });
  });

  app.get("/api/scrape", (req, res) => {
    axios
      .get("https://www.bbc.com/news/technology")
      .then(response => {
        const scrapedItems = [];
        const $ = cheerio.load(response.data);
        $("div.gs-c-promo-body").each((i, element) => {
          const title = $(element)
            .find("a.gs-c-promo-heading")
            .text();
          const link = `https://www.bbc.com${$(element)
            .find("a.gs-c-promo-heading")
            .attr("href")}`;
          const summary = $(element)
            .find("p.gs-c-promo-summary")
            .text();
          // how many hours ago it was published
          const published = parseInt(
            $(element)
              .find("span.gs-u-vh")
              .text()
              .substr(0, 2)
          );
          if (
            link !== "" &&
            summary !== "" &&
            $(element)
              .find("span.qa-offscreen")
              .text() === ""
          ) {
            if (
              !scrapedItems.length ||
              !scrapedItems.find(item => item.title === title)
            ) {
              scrapedItems.push({
                title: title,
                link: link,
                summary: summary,
                published: published
              });
            }
          }
        });
        db.Article.create(scrapedItems)
          .then(articles => {
            res.json(articles);
          })
          .catch(error => res.json(error));
      })
      .catch(error => {
        res.json(error);
      });
  });

  app.get("/notes/:id", (req, res) => {
    db.Article.findOne({_id:req.params.id}).populate("notes").then(article=>{
      res.render("notes", { id: article._id, title: article.title,notes: article.notes});
    }).catch(err=>res.json(err))
  });

  app.post("/api/notes", (req, res) => {
    console.log(req.body.note);
    db.Note.create({
      content: req.body.note
    })
      .then(note => {
        return db.Article.findOneAndUpdate(
          { _id: req.body.articleId },
          { $push: { notes: note._id }},{new: true}
        ).then((article)=>{
          console.log(article)
          db.Article.findOne({_id:article._id}).populate("notes").then(article=>{
            res.json(article.notes)
          }).catch(err=>res.json(err))
        });
      })
      .catch(error => res.json(error));
  });


app.delete("/api/delete",(req,res)=>{
  db.Note.deleteOne({_id:req.body.id}).then(note=>{
    res.json(note)
  }).catch(err=>res.json(err))
})
};