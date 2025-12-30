import { Router } from "express";
import getConnection from "./dbConnector.js";
import { ObjectId } from "mongodb";

const router = Router();
router.get("/", async (req, res, next) => {
  try {
    const { q } = req.query;
    const db = await getConnection();
    const users = await db
      .collection("users")
      .find({ name: { $regex: q, $options: "i" } })
      .toArray();
    res.json(users);
  } catch (error) {
    next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const db = await getConnection();
    const user = await db.collection("users").findOne({ _id: id });
    const tournaments = await db
      .collection("tournaments")
      .find({ userId: id })
      .toArray();
    res.json({ user, tournaments });
  } catch (error) {
    next(error);
  }
});

export default router;
