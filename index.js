import express from "express";
import logger from "morgan";
import cors from "cors";

import { resourceRoutes } from "./routes/resource.routes.js";
import { categorizeRoutes } from "./routes/categorize.routes.js";
import connectToDB from "./db/index.js";

const app = express();
connectToDB();
app.set("trust proxy", 1);
app.use(logger("dev"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/resource", resourceRoutes);
app.use("/categorize", categorizeRoutes);

app.listen(5005, () => {
  console.log("Server is running on port 5005");
});
