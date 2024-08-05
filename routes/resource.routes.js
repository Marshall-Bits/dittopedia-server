import express from "express";
import { Resource } from "../models/Resource.model.js";
import { isAuthenticated } from "../middlewares/jwt.js";
import { convertToRGB } from "../utils/colors.js";
const router = express.Router();

// ROUTES FOR /resource

router.get("/", async (req, res) => {
  const { searchQuery } = req.query;

  try {
    let query = {};
    if (searchQuery) {
      const searchQueries = Array.isArray(searchQuery)
        ? searchQuery
        : [searchQuery];

      query = {
        $and: searchQueries.map((query) => ({
          $or: [
            { categories: { $elemMatch: { $regex: new RegExp(query, "i") } } },
            { mainCategory: { $regex: new RegExp(query, "i") } },
            { title: { $regex: new RegExp(query, "i") } },
          ],
        })),
      };
    }

    const resources = await Resource.find(query).sort({
      mainCategory: 1,
      title: 1,
    });

    // Group resources by mainCategory
    const groupedResources = resources.reduce((acc, resource) => {
      const { mainCategory } = resource;
      if (!acc[mainCategory]) {
        acc[mainCategory] = [];
      }
      acc[mainCategory].push(resource);
      return acc;
    }, {});

    // Convert grouped resources into an array of objects
    const filteredResources = Object.keys(groupedResources)
      .filter((category) => groupedResources[category].length > 0)
      .map((category) => ({
        category,
        resources: groupedResources[category],
      }));

    res.status(200).send(filteredResources);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/", isAuthenticated, async (req, res) => {
  const { title, description, categories, url, favIcon, mainCategory, color } =
    req.body;

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
      color: convertToRGB(color),
    };
    const savedResource = await Resource.create(newResource);
    res.status(201).send(savedResource);
  } catch (error) {
    res.status(400).send(error);
  }
});

export { router as resourceRoutes };
