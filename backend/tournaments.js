import { Router } from "express";
import robin from "roundrobin";
import { z } from "zod";
import {
  HttpError,
  normalizeDate,
  verifyToken,
  assertCreator,
} from "./utils.js";
import { ObjectId } from "mongodb";
import getConnection from "./dbConnector.js";

const router = Router();

const TournamentSchema = z.object({
  name: z.string().min(3),
  sport: z.string(),
  fieldId: z.string(),
  startDate: z.string(),
  maxTeams: z.number().int().positive(),
});

const TournamentUpdateSchema = z
  .object({
    name: z.string().min(3).optional(),
    maxTeams: z.number().int().positive().optional(),
    teams: z.array(z.string()).optional(),
  })
  .strict();

router.post("/", verifyToken, async (req, res, next) => {
  try {
    const parsed = TournamentSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "Malformed package");
    }
    const tournament = parsed.data;
    const startDate = normalizeDate(tournament.startDate);
    if (startDate < new Date()) {
      throw new HttpError(403, "Cannot create tournament in the past");
    }
    const db = await getConnection();
    await db.collection("tournaments").insertOne({
      ...tournament,
      startDate,
      userId: new ObjectId(req.token._id),
      teams: [],
    });
    res.json({ mesasge: `Tournament created successfully` });
  } catch (error) {
    next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = await getConnection();
    const tournament = await db
      .collection("tournaments")
      .findOne({ _id: new ObjectId(id) });
    if (!tournament) {
      throw new HttpError(404);
    }
    res.json(tournament);
  } catch (error) {
    next(error);
  }
});
router.put("/:id", verifyToken, assertCreator, async (req, res, next) => {
  try {
    const parsed = TournamentUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "Invalid Update payload");
    }
    const update = parsed.data;
    const { id } = req.params;
    const db = await getConnection();
    const tournament = await db
      .collection("tournaments")
      .findOne({ _id: new ObjectId(id) });
    if (!tournament) {
      throw new HttpError(404);
    }
    if (update.teams?.length > tournament.maxTeams) {
      throw new HttpError(403, "Too many teams");
    }
    const result = await db
      .collection("tournaments")
      .updateOne({ _id: new ObjectId(id) }, { $set: update });
    if (result.matchedCount === 0) {
      console.log(result);
      throw new HttpError(500);
    }
    res.json({ message: "Updated successfully" });
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", verifyToken, assertCreator, async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.id);
    const db = await getConnection();

    await db.collection("tournaments").deleteOne({ _id: id });
    await db.collection("matches").deleteMany({ tournamentId: id });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
router.post(
  "/:id/matches/generate",
  verifyToken,
  assertCreator,
  async (req, res, next) => {
    try {
      const tournament = req.tournament;
      if (tournament.schedule) {
        throw new HttpError(400, "Already generated");
      }
      const { startDate, teams } = tournament;

      if (!teams || teams.length < 2) {
        throw new HttpError(400, "Not enough teams");
      }
      const roundRobin = robin(teams.length, teams);
      const matches = [];
      for (let round = 0; round < roundRobin.length; round++) {
        roundRobin[round].map((match) => {
          matches.push({
            tournamentId: tournament._id,
            round,
            teams: match,
            date: startDate,
            status: "upcoming",
            result: null,
          });
        });
      }

      const db = await getConnection();
      await db.collection("matches").insertMany(matches);
      await db
        .collection("tournaments")
        .updateOne(
          { _id: new ObjectId(tournament._id) },
          { $set: { schedule: true } }
        );
      res.json(matches);
    } catch (error) {
      next(error);
    }
  }
);
router.get("/:id/matches", async (req, res, next) => {
  try {
    const db = await getConnection();
    const matches = await db
      .collection("matches")
      .aggregate([
        { $match: { tournamentId: new ObjectId(req.params.id) } },
        { $group: { _id: "$round", matches: { $push: "$$ROOT" } } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, round: "$_id", matches: 1 } },
      ])
      .toArray();
    res.json(matches);
  } catch (error) {
    next(error);
  }
});
router.get("/:id/standings", async (req, res, next) => {
  try {
    const db = await getConnection();
    const id = new ObjectId(req.params.id);
    const tournament = await db.collection("tournaments").findOne({ _id: id });
    if (!tournament) {
      throw new HttpError(404);
    }
    const matches = await db
      .collection("matches")
      .find({ tournamentId: id, status: "completed" })
      .toArray();
    const standings = tournament.teams.map((t) => ({ team: t, score: 0 }));
    matches.forEach((m) => {
      const [home, away] = m.teams;
      standings.find((s) => s.team === home).score += m.score.result[0];
      standings.find((s) => s.team === away).score += m.score.result[1];
    });
    standings.sort((a, b) => b.score - a.score);
    res.json(standings);
  } catch (error) {
    next(error);
  }
});
router.get("/", async (req, res, next) => {
  try {
    const { q = "" } = req.query;
    const regex = { $regex: q, $options: "i" };
    const filter = { $or: [{ name: regex }, { sport: regex }] };
    const db = await getConnection();
    const tournaments = await db
      .collection("tournaments")
      .find(filter)
      .toArray();
    res.json(tournaments);
  } catch (error) {
    next(error);
  }
});

export default router;
