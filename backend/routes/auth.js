import express from "express";
import jwt from "jsonwebtoken";
import getConnection from "../dbConnector.js";
import { compare, hash } from "bcrypt";
import { HttpError } from "../utils.js";
import { z } from "zod";
const { sign } = jwt;

const UserSchema = z.object({
  username: z.string(),
  name: z.string(),
  surname: z.string(),
  password: z.string().min(8),
});

const router = express.Router();

router.post("/signin", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const mongo = await getConnection();
    const user = await mongo.collection("users").findOne({ username });
    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new HttpError(401, "Invalid credentials");
    }

    const { _id } = user;
    const token = sign({ _id, username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.end();
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const parsed = UserSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "Malformed package");
    }
    const { username, password, name, surname } = parsed.data;
    const hashedPassword = await hash(password, 10);
    try {
      const db = await getConnection();
      await db
        .collection("users")
        .insertOne({ username, password: hashedPassword, name, surname });
      res.sendStatus(201);
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpError(409, "Username already taken");
      }
      throw error;
    }
  } catch (err) {
    next(err);
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  });
  res.sendStatus(200);
});

export default router;
