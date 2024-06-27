import express from "express";
import { Resource } from "../models/Resource.model.js";
import { isAuthenticated } from "../middlewares/jwt.js";
const router = express.Router();

// ROUTES FOR /resource

router.get("/", async (req, res) => {
  const { searchQuery } = req.query;

  try {
    let query = {};
    if (searchQuery) {
      const searchQueries = Array.isArray(searchQuery) ? searchQuery : [searchQuery];

      query = {
        $and: searchQueries.map(query => ({
          $or: [
            { categories: { $elemMatch: { $regex: new RegExp(query, "i") } } },
            { mainCategory: { $regex: new RegExp(query, "i") } },
            { title: { $regex: new RegExp(query, "i") } }
          ]
        }))
      };
    }

    const resources = await Resource.find(query).sort({ mainCategory: 1, title: 1});
    res.status(200).send(resources);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  const { title, description, categories, url, favIcon, mainCategory } = req.body;
  
  if (req.payload.role !== "admin") {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  try {
    const newResource = {
      title,
      description,
      categories,
      url,
      favIcon,
      mainCategory,
    };
    const savedResource = await Resource.create(newResource);
    res.status(201).send(savedResource);
  } catch (error) {
    res.status(400).send(error);
  }
});

export { router as resourceRoutes };
