import { Resource } from "../models/Resource.model.js";
import express from "express";

const router = express.Router();

// routes for /category

// get the array of allCategories
router.get("/", async (req, res) => {
  const resources = await Resource.find({}, { categories: 1, _id: 0 });

  const allCategories = resources.map((resource) => resource.categories);
  const uniqueCategories = [...new Set(allCategories.flat())];
  res.json(uniqueCategories);
});

export { router as categoryRoutes };
