import express from "express";
import jwt from "jsonwebtoken";
import getConnection from "./dbConnector.js";
import { compare, hash } from "bcrypt";
const { sign } = jwt;

const router = express.Router();

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const mongo = await getConnection();
    const user = await mongo.collection("users").findOne({ username });
    if (!user) {
      return res.status(401).send({ error: "Invalid credentials" });
    }
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { _id } = user;
    const token = sign({ _id, username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.send("Success");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password, name, surname } = req.body;
    const mongo = await getConnection();
    const user = await mongo.collection("users").findOne({ username });
    if (user) {
      return res.status(409).send(`Username ${username} already taken`);
    }
    const hashedPassword = await hash(password, 10);
    await mongo
      .collection("users")
      .insertOne({ username, password: hashedPassword, name, surname });
    res.redirect("/api/auth/signin");
  } catch (err) {
    console.error(err);
    res.status(500).send(`Server error`);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  });
  res.send("Logged out");
});

export default router;
