import express from "express";
import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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

    const passwordIsValid = bcryptjs.compareSync(password, user.password);

    if (!passwordIsValid) {
      res.status(401).send({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: 86400,
    });

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export { router as authRoutes };
