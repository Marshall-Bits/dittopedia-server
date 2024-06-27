import express from "express";
import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { isAuthenticated } from "../middlewares/jwt.js";

dotenv.config();

// ROUTES for /auth

const salt = bcryptjs.genSaltSync(10);

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      res.status(409).send({ message: "User already exists" });
      return;
    }

    const hashPass = bcryptjs.hashSync(password, salt);

    User.create({
      username,
      email,
      password: hashPass,
    });

    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    const { _id, username, role } = user;

    const passwordIsValid = bcryptjs.compareSync(password, user.password);

    if (!passwordIsValid) {
      res.status(401).send({ message: "Invalid password" });
      return;
    }

    const payload = {
      _id,
      username,
      email,
      role,
    };

    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).send({
      accessToken: token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/verify", isAuthenticated, (req, res) => {
  res.status(200).send(req.payload);
});

export { router as authRoutes };
