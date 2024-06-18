import express from "express";
import logger from "morgan";
import OpenAI from "openai";
import { getHtmlInfo } from "./utils/formatInfo.js";
import { categorizedPage } from "./utils/categorize.js";

const app = express();
app.use(logger("dev"));

const test = async (req, res) => {
  const { pageInfo } = req.query;

  const stream = await categorizedPage(pageInfo);
  if (stream.includes("Error")) {
    res
      .status(400)
      .send({ message: "Error getting the categories for this page" });
    return;
  }
  console.log(stream);
  res.status(200).send(stream);
};

app.get("/", (req, res) => {
  test(req, res);
  const url = req.query.url;
});

app.get("/scrap", (req, res) => {
  const url = req.query.url;

  const getHtml = async () => {
    try {
      const response = await fetch(url);
      const html = await response.text();
      req.query.html = html;

      req.query.pageInfo = { ...getHtmlInfo(html), url };

      console.log(req.query.pageInfo);
      // res.status(200).send({... getHtmlInfo(html), url});
      test(req, res);
    } catch {
      res.status(400).send({
        message:
          "Unable to get info from this page, please make sure the url is correct",
      });
    }
  };

  getHtml();
});

app.listen(5005, () => {
  console.log("Server is running on port 5005");
});
