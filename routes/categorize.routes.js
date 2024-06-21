import express from "express";
import { getHtmlInfo } from "../utils/formatInfo.js";
import { categorizedPage } from "../utils/categorize.js";
import formatFavIcon from "../utils/formatFavIcon.js";

// ROUTES for /categorize

const router = express.Router();

router.get("/", async (req, res) => {
  const url = req.query.url;
  console.log(url);

  try {
    const page = await fetch(url);
    const html = await page.text();
    const pageInfo = { ...getHtmlInfo(html), url };
    const { favIcon } = pageInfo;
    const response = await categorizedPage(pageInfo);

    if (response.includes("Error")) {
      res
        .status(400)
        .send({ message: "Error getting the categories for this page" });
      return;
    }

    const parsedResponse = JSON.parse(response);

    res
      .status(200)
      .send({ ...parsedResponse, url, favIcon: formatFavIcon(favIcon, url) });
  } catch {
    res.status(400).send({
      message:
        "Unable to get info from this page, please provide another URL or add the information manually.",
    });
  }
});

export { router as categorizeRoutes };
