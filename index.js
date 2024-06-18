import express from "express";
import logger from "morgan";
import { getHtmlInfo } from "./utils/formatInfo.js";
import { categorizedPage } from "./utils/categorize.js";

const app = express();
app.use(logger("dev"));

app.get("/", (req, res) => {
  const url = req.query.url;
  res.send(`The url is: ${url}`);
});

app.get("/scrap", async (req, res) => {
  const url = req.query.url;

  try {
    const page = await fetch(url);
    const html = await page.text();
    const pageInfo = { ...getHtmlInfo(html), url };
    const response = await categorizedPage(pageInfo);

    if (response.includes("Error")) {
      res
        .status(400)
        .send({ message: "Error getting the categories for this page" });
      return;
    }

    console.log(response);
    res.status(200).send(response);
  } catch {
    res.status(400).send({
      message:
        "Unable to get info from this page, please make sure the url is correct",
    });
  }
});

app.listen(5005, () => {
  console.log("Server is running on port 5005");
});
