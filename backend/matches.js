import { Router } from "express";
import { assertCreator, HttpError, verifyToken } from "./utils.js";
import { ObjectId } from "mongodb";
import getConnection from "./dbConnector.js";

const router = Router();

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
      const { score } = req.body;
      const db = await getConnection();
      const result = db
        .collection("matches")
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: { score, status: "completed" } }
        );
      if (result.acknowledged) {
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
