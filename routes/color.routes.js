import mongoose from "mongoose";
import express from "express";
import { Resource } from "../models/Resource.model.js";
import { getDominantColor, invertColor } from "../utils/colors.js";
import { isAuthenticated } from "../middlewares/jwt.js";

// ROUTES for /color

const router = express.Router();

router.post("/all", isAuthenticated, async (req, res) => {
  const resources = await Resource.find();
  const colorPromises = resources.map(async (resource) => {
    const color = await getDominantColor(resource.favIcon);
    return { title: resource.title, color };
  });

  const resourcesWithColor = await Promise.all(colorPromises);

  res.send(resourcesWithColor);
});

export { router as colorRoutes };
