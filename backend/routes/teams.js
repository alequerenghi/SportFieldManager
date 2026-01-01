import Router from "express";
import { z } from "zod";
import { HttpError, verifyToken } from "../utils";
import getConnection from "../dbConnector";
import { ObjectId } from "mongodb";

const router = Router();

const PlayerSchema = z.array(
  z.object({
    name: z.string(),
    surname: z.string(),
    jerseyNumber: z.number().optional(),
  })
);

router.post("/", verifyToken, async (req, res, next) => {
  try {
    const { name } = req.body;
    const db = await getConnection();
    const result = await db
      .collections("teams")
      .insertOne({ name, userId: req.token._id });
    res.json({ message: result });
  } catch (error) {
    next(error);
  }
});
router.get("/", async (req, res, next) => {
  try {
    const { q } = req.query;
    const db = await getConnection();
    const teams = db
      .collections("teams")
      .find({ $regex: q, $options: "i" })
      .toArray();
    res.json(teams);
  } catch (error) {
    next(error);
  }
});
router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const id = new ObjectId(req.params);
    const db = await getConnection();
    const team = db.collections("teams").findOne({ _id: id });
    if (!team) {
      throw new HttpError(404);
    }
    if (team.userId.toString() !== req.token._id.toString()) {
      throw new HttpError(403);
    }
    const parsed = PlayerSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "Invalid payload structure");
    }
    const players = parsed.data;
    players.forEach(async (player) => {
      const alreadyExist = await db
        .collections("players")
        .findOne({ ...player, team: id });
      if (!alreadyExist) {
        await db.collections("players").insertOne({ ...player, team: id });
      }
    });
    res.json({ message: "Success" });
  } catch (error) {
    next(error);
  }
});

export default router;
