import express from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "./dbConnector.js";
import { compare, hash } from "bcrypt";
const { sign } = jwt;

const router = express.Router();
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const mongo = await getConnection();
    const user = await mongo.collection("users").findOne({ username });
    console.log(user);
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send("Invalid credentials");
    }
    // maybe modify in the future
    const token = sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/index.html");
  } catch (err) {
    console.err(err);
    res.status(500).send("Error");
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password, name, surname } = req.body;
    const mongo = await getConnection();
    const u = { username, password, name, surname };
    const user = await mongo.collection("users").findOne({ username });
    console.log(user);
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

export default router;
