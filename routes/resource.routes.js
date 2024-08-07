import express from "express";
import { Resource } from "../models/Resource.model.js";
import { isAuthenticated } from "../middlewares/jwt.js";
import { convertToRGB, convertToHex } from "../utils/colors.js";
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

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resource = await Resource.findById(id);
    resource.color = convertToHex(resource.color);
    res.status(200).send(resource);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.put("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { title, description, categories, url, favIcon, mainCategory, color } =
    req.body;

  if (req.payload.role !== "admin") {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  try {
    const updatedResource = {
      title,
      description,
      categories,
      url,
      favIcon,
      mainCategory,
      color: convertToRGB(color),
    };
    const resource = await Resource.findByIdAndUpdate(id, updatedResource, {
      new: true,
    });
    res.status(200).send(resource);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;

  if (req.payload.role !== "admin") {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  try {
    await Resource.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).send(error);
  }
  
});

export { router as resourceRoutes };
