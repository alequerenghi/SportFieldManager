import { Router } from "express";
import robin from "roundrobin";
import { z } from "zod";
import {
  HttpError,
  normalizeDate,
  verifyToken,
  assertCreator,
} from "../utils.js";
import { ObjectId } from "mongodb";
import getConnection from "../dbConnector.js";

const router = Router();

const TournamentSchema = z.object({
  name: z.string().min(3),
  sport: z.string(),
  startDate: z.string().refine((d) => !isNaN(Date.parse(d))),
  maxTeams: z.number().int().positive(),
});

const TournamentUpdateSchema = z
  .object({
    name: z.string().min(3).optional(),
    maxTeams: z.number().int().positive().optional(),
    teams: z.array(z.string()).optional(),
  })
  .strict();

const computeStandings = (sport, matches) => {
  const pointsPerSport = {
    football: [3, 1, 0],
    rest: [2, 0, 0],
  };
  const standings = matches.reduce((agg, match) => {
    match.teams.forEach((team) => {
      if (!agg[team]) {
        agg[team] = { score: 0, matchesPlayed: 0, goals: [0, 0] };
      }
      agg[team].matchesPlayed++;
    });
    const [homeTeam, awayTeam] = match.teams;
    const [victory, draw, lost] =
      pointsPerSport[sport === "football" ? "football" : "rest"];
    if (match.score[0] > match.score[1]) {
      agg[homeTeam].score += victory;
      agg[awayTeam].score += lost;
    } else if (match.score[0] < match.score[1]) {
      agg[homeTeam].score += lost;
      agg[awayTeam].score += victory;
    } else {
      agg[homeTeam].score += draw;
      agg[awayTeam].score += draw;
    }
    for (let i = 0; i < 2; i++) {
      agg[homeTeam].goals[i] += match.score[i];
      agg[awayTeam].goals[1 - i] += match.score[i];
    }
    return agg;
  }, {});
  return Object.entries(standings).sort(
    (a, b) =>
      b.score - a.score || b.goals[0] - a.goals[0] || a.goals[1] - b.goals[1]
  );
};

const computeTennisStandings = (matches) => {
  const standings = {};

  for (const match of matches) {
    const [teamA, teamB] = match.teams;

    if (!standings[teamA]) {
      standings[teamA] = initTeam();
    }
    if (!standings[teamB]) {
      standings[teamB] = initTeam();
    }

    standings[teamA].matchesPlayed++;
    standings[teamB].matchesPlayed++;

    let setsA = 0;
    let setsB = 0;

    for (const [gamesA, gamesB] of match.result) {
      standings[teamA].gamesWon += gamesA;
      standings[teamA].gamesLost += gamesB;
      standings[teamB].gamesWon += gamesB;
      standings[teamB].gamesLost += gamesA;

      if (gamesA > gamesB) {
        setsA++;
      } else {
        setsB++;
      }
    }

    standings[teamA].setsWon += setsA;
    standings[teamA].setsLost += setsB;
    standings[teamB].setsWon += setsB;
    standings[teamB].setsLost += setsA;

    if (setsA > setsB) {
      standings[teamA].matchesWon++;
      standings[teamA].points += 1;
      standings[teamB].matchesLost++;
    } else {
      standings[teamB].matchesWon++;
      standings[teamB].points += 1;
      standings[teamA].matchesLost++;
    }
  }
  return Object.entries(standings)
    .map(([team, stats]) => ({
      team,
      ...stats,
      setDiff: stats.setsWon - stats.setsLost,
      gameDiff: stats.gamesWon - stats.gamesLost,
    }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.matchesWon - a.matchesWon ||
        b.setDiff - a.setDiff ||
        b.gameDiff - a.gameDiff
    );
};

const initTeam = () => ({
  matchesPlayed: 0,
  matchesWon: 0,
  matchesLost: 0,
  setsWon: 0,
  setsLost: 0,
  gamesWon: 0,
  gamesLost: 0,
  points: 0,
});

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
    const inserted = await db.collection("tournaments").insertOne({
      ...tournament,
      startDate,
      userId: new ObjectId(req.token._id),
      teams: [],
    });
    if (!inserted.acknowledged) {
      throw new HttpError(500);
    }
    res.status(201).json({ id: inserted.insertedId });
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
    if (tournament.teams.length) {
      tournament.teams = await db
        .collection("teams")
        .find({ _id: { $in: tournament.teams } })
        .toArray();
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
    const tournament = req.tournament;
    if (update.teams) {
      if (update.teams.length > tournament.maxTeams) {
        throw new HttpError(403, "Too many teams");
      }
      const teams = [...new Set(update.teams)];
      const teamIds = teams.map((t) => new ObjectId(t));
      const foundTeams = await db
        .collection("teams")
        .find({ _id: { $in: teamIds } })
        .toArray();
      if (foundTeams.length !== teamIds.length) {
        throw new HttpError(404, "One or more teams don't exist");
      }
      update.teams = teamIds;
    }

    const result = await db
      .collection("tournaments")
      .updateOne({ _id: new ObjectId(id) }, { $set: update });
    if (result.matchedCount === 0) {
      console.log(result);
      throw new HttpError(500);
    }
    res.sendStatus(200);
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

    res.sendStatus(204);
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
      res.sendStatus(201);
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

    const standings =
      tournament.sport === "tennis"
        ? computeTennisStandings(matches)
        : computeStandings(tournament.sport, matches);
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
