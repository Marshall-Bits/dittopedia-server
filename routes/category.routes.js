import { Resource } from "../models/Resource.model.js";
import express from "express";

const router = express.Router();

// routes for /category

// get the array of allCategories
router.get("/", async (req, res) => {
  let page = parseInt(req.query.page) || 1;

  const resources = await Resource.find({}, { categories: 1, _id: 0 });

  const allCategories = resources.map((resource) => resource.categories);
  const uniqueCategories = [...new Set(allCategories.flat().sort())];

  const limit = 8;
  const pages = Math.ceil(uniqueCategories.length / limit);

  if (page > pages) {
    page = pages;
  }

  if (page < 1) {
    page = 1;
  }

  const startIndex = (page - 1) * limit;

  const endIndex = page * limit;

  const results = uniqueCategories.slice(startIndex, endIndex);

  res.json({ results, pages, page });
});

export { router as categoryRoutes };
