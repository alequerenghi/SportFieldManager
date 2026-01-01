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
  score.foreach((set) => {
    if (!validateSimpleScore(set)) {
      return false;
    }
    const [gamesHome, gamesAway] = set;
    if (gamesHome > gamesAway) {
      setsWonHome++;
    } else if (gamesHome < gamesAway) {
      setsWonAway++;
    }
  });
  return setsWonHome !== setsWonAway;
};

router.get("/:id", async (req, res, next) => {
  try {
    const id = new ObjectId(req.params);
    const db = await getConnection();
    const match = await db.collection("matches").findOne({ _id: id });
    if (!match) {
      throw new HttpError(404);
    }
    res.json(match);
  } catch (error) {
    next(error);
  }
});
router.put(
  "/:id/result",
  verifyToken,
  assertCreator,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { result, sport } = req.body;
      const valid =
        sport === "tennis"
          ? validateTennisScore(result)
          : validateSimpleScore(result);
      if (!valid) {
        throw new HttpError(400, "Malformed package");
      }
      const db = await getConnection();
      const updateResult = db
        .collection("matches")
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { score: result, status: "completed" } }
        );
      if (updateResult.acknowledged) {
        res.send("Match score added successfully");
      } else {
        res.status(500).send("Server error");
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
