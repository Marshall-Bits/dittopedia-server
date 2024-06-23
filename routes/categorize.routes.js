import express from "express";
import { getHtmlInfo } from "../utils/formatInfo.js";
import { categorizedPage } from "../utils/categorize.js";
import formatFavIcon from "../utils/formatFavIcon.js";

// ROUTES for /categorize

const router = express.Router();

router.get("/", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    res.status(400).send({ message: "Please provide a URL" });
    return;
  }
  setTimeout(() => {
  res.send({
    title: "Feature Testing Platform",
    description:
      "Platform to test and explore new features. Support via Patreon. Browse latest and most searched features.",
    categories: [
      "Documentation",
      "Support",
      "Testing",
      "Tools",
      "Browser Scores",
      "Feature Testing",
    ],
    url: "https://caniuse.com/",
    favIcon: formatFavIcon("/img/favicon-128.png",  "https://caniuse.com/"),
  }); 
  /* try {
    const page = await fetch(url);
    const html = await page.text();
    const pageInfo = { ...getHtmlInfo(html), url };
    const { favIcon } = pageInfo;
    const response = await categorizedPage(pageInfo);

    if (response.includes("Error")) {
      res
        .status(422)
        .send({ message: "Error getting the categories for this page" });
      return;
    }

    const parsedResponse = JSON.parse(response);

    res
      .status(200)
      .send({ ...parsedResponse, url, favIcon: formatFavIcon(favIcon, url) });
  } catch {
    res.status(404).send({
      message:
        "Unable to get info from this page, please provide another URL or add the information manually.",
    });
  } */
}, 2000);
});

export { router as categorizeRoutes };
