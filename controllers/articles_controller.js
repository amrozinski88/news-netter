const cheerio = require("cheerio");
const axios = require("axios");

module.exports = (app) => {

    app.get("/api/scrape", (req, res) => {

        axios.get("https://www.bbc.com/news/technology").then(response => {
            const scrapedItems = [];
            const $ = cheerio.load(response.data);
            // console.log($("a.title")[0])
            $("div.gs-c-promo-body").each((i, element) => {
                const title = $(element).find("a.gs-c-promo-heading").text();
                const link = `https://www.bbc.com${$(element).find("a.gs-c-promo-heading").attr("href")}`;
                const summary = $(element).find("p.gs-c-promo-summary").text();
                if (link !== "" && summary !== "" && $(element).find("span.qa-offscreen").text() === "") {

                    if (!scrapedItems.length || !scrapedItems.find(item => item.title === title)) {
                        scrapedItems.push({
                            title: title,
                            link: link,
                            summary: summary
                        })
                    }

                }
            });
            res.json(scrapedItems)
        }).catch(error => {
            res.json(error)
        });
    })


}