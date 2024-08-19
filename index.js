import express from "express";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import { resourceRoutes } from "./routes/resource.routes.js";
import { categorizeRoutes } from "./routes/categorize.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { colorRoutes } from "./routes/color.routes.js";
import { categoryRoutes } from "./routes/category.routes.js";
import connectToDB from "./db/index.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();
connectToDB();
app.set("trust proxy", 1);
app.use(logger("dev"));
app.use(express.json());
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

app.use("/resource", resourceRoutes);
app.use("/categorize", categorizeRoutes);
app.use("/auth", authRoutes);
app.use("/color", colorRoutes);
app.use("/category", categoryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
