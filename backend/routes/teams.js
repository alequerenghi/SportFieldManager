import { Router } from "express";
import { object, z } from "zod";
import { HttpError, verifyToken } from "../utils.js";
import getConnection from "../dbConnector.js";
import { ObjectId } from "mongodb";

const router = Router();

const PlayerSchema = z.array(
  z.object({
    name: z.string(),
    surname: z.string(),
    jerseyNumber: z.number().int().nonnegative().optional(),
  })
);

router.post("/", verifyToken, async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = new ObjectId(req.token._id);
    const db = await getConnection();
    try {
      const result = await db.collection("teams").insertOne({ name, userId });
      res.status(201).json({ id: result.insertedId });
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpError(409, "Team name already chosen");
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const db = await getConnection();
    const team = await db.collection("teams").findOne({ _id: id });
    const players = await db
      .collection("players")
      .find({ teamId: id })
      .toArray();
    team.players = players;
    res.json(team);
  } catch (error) {
    next(error);
  }
});
router.get("/", async (req, res, next) => {
  try {
    const { q = "" } = req.query;
    const db = await getConnection();
    const teams = await db
      .collection("teams")
      .find({ name: { $regex: q, $options: "i" } })
      .toArray();
    res.json(teams);
  } catch (error) {
    next(error);
  }
});
router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const db = await getConnection();
    const team = await db.collection("teams").findOne({ _id: id });
    if (!team) {
      throw new HttpError(404);
    }
    if (team.userId.toString() !== req.token._id) {
      throw new HttpError(403);
    }
    const parsed = PlayerSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "Invalid payload structure");
    }
    const players = parsed.data;
    for (const player of players) {
      const exists = await db
        .collection("players")
        .findOne({ ...player, teamId: id });
      if (!exists) {
        await db.collection("players").insertOne({ ...player, teamId: id });
      }
    }
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

export default router;
