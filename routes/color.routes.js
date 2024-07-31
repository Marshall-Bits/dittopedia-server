import mongoose from "mongoose";
import express from "express";
import { Resource } from "../models/Resource.model.js";
import { getDominantColor, invertColor } from "../utils/colors.js";
import { isAuthenticated } from "../middlewares/jwt.js";

// ROUTES for /color

const router = express.Router();

router.post("/all", isAuthenticated, async (req, res) => {
  // update all the resources with the dominant color
  const resources = await Resource.find();
  for (const resource of resources) {
    const color = await getDominantColor(resource.favIcon);
    const formattedColor = `rgba(${color.join(",")}, 0.5)`;
    await Resource.findByIdAndUpdate(resource._id, { color: formattedColor });
  }
  res.send("Colors updated");
});

router.post("/:id", isAuthenticated, async (req, res) => {
  // update the resource with the dominant color
  const resource = await Resource.findById(req.params.id);
  if (!resource) {
    return res.status(404).send("Resource not found");
  }
  const color = await getDominantColor(resource.favIcon);
  const formattedColor = `rgba(${color.join(",")}, 0.5)`;
  await Resource.findByIdAndUpdate(resource._id, { color: formattedColor });
  res.send("Color updated");
});

export { router as colorRoutes };
