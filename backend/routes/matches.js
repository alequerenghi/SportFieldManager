import { Router } from "express";
import { assertCreator, HttpError, verifyToken } from "../utils.js";
import { ObjectId } from "mongodb";
import getConnection from "../dbConnector.js";

const router = Router();

const isPositiveInt = (n) => Number.isInteger(n) && n >= 0;

const validateSimpleScore = (score) => {
  if (!Array.isArray(score) || score.length !== 2) return false;
  return score.every(isPositiveInt);
};

const validateTennisScore = (score) => {
  if (!Array.isArray(score) || score.length < 2) {
    return false;
  }
  let setsWonHome = 0;
  let setsWonAway = 0;
  for (const set of score) {
    if (!validateSimpleScore(set)) {
      return false;
    }
    const [gamesHome, gamesAway] = set;
    if (gamesHome > gamesAway) {
      setsWonHome++;
    } else if (gamesHome < gamesAway) {
      setsWonAway++;
    }
  }
  return setsWonHome !== setsWonAway;
};

router.get("/:id", async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const db = await getConnection();
    const match = await db.collection("matches").findOne({ _id: id });
    if (!match) {
      throw new HttpError(404);
    }
    const teamIds = match.teams.map((t) => new ObjectId(t));
    match.teams = await db
      .collection("teams")
      .find({ _id: { $in: teamIds } })
      .toArray();
    res.json(match);
  } catch (error) {
    next(error);
  }
});
router.put("/:id/result", verifyToken, async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const { result, sport } = req.body;
    const db = await getConnection();
    const match = await db.collection("matches").findOne({ _id: id });
    if (!match) {
      throw new HttpError(404);
    }
    if (match.status === "completed") {
      throw new HttpError(400, "Match aleady has a result");
    }
    const tournament = await db
      .collection("tournaments")
      .findOne({ _id: match.tournamentId });
    if (tournament.userId.toString() !== req.token._id) {
      throw new HttpError(403);
    }
    const valid =
      sport === "tennis"
        ? validateTennisScore(result)
        : validateSimpleScore(result);
    if (!valid) {
      throw new HttpError(400, "Malformed package");
    }
    const updateResult = await db
      .collection("matches")
      .updateOne({ _id: id }, { $set: { result, status: "completed" } });
    if (updateResult.acknowledged) {
      res.sendStatus(200);
    } else {
      throw new HttpError(500);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
