import express from "express";
import { Resource } from "../models/resource.model.js";
const router = express.Router();

// ROUTES FOR /resource

router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).send(resources);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/", async (req, res) => {
  const { title, description, categories, url, favIcon } = req.body;
 
  try {
    const newResource = {
      title,
      description,
      categories,
      url,
      favIcon,
    };

    const savedResource = await Resource.create(newResource);
    res.status(201).send(savedResource);
  } catch (error) {
    res.status(400).send(error);
  }
});

export { router as resourceRoutes };
