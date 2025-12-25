import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import roundrobin from "roundrobin";
import { z } from "zod";
import router from "./auth.js";
import { getConnection } from "./dbConnector.js";
import { ObjectId } from "mongodb";
const { robin } = roundrobin;
const { verify } = jwt;

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use("/api/auth", router);
app.use(express.static("public"));

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (typeof token === "undefined") {
    return res.redirect("/api/auth/login");
  }
  verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send("Expired or invalid token");
    }
    req.token = decoded;
    next();
  });
};

/**
 * FIELDS
 */

app.get("/api/fields/:id", async (req, res) => {
  const { id } = req.params;
  const db = await getConnection();
  const fieldDetails = await db
    .collection("fields")
    .findOne({ _id: new ObjectId(id) });
  if (!fieldDetails) {
    return res.status(404).send(`Not found`);
  }
  res.json(fieldDetails);
});
app.get(
  "/api/fields/:id/slots",
  (req, res, next) => {
    try {
      const { date } = req.query;
      const dateOnly = new Date(date).toDateString();
      req.date = new Date(dateOnly);
      next();
    } catch (err) {
      return res.status(403).send("Malformed date");
    }
  },
  async (req, res) => {
    const { id } = req.params;
    const date = req.date;
    const db = await getConnection();
    const field = await db
      .collection("fields")
      .findOne({ _id: new ObjectId(id) });
    if (!field) {
      return res.status(404).send("Not found");
    }
    const bookings = await db
      .collection("bookings")
      .find({ date, fieldId: id })
      .toArray();
    const slots = field.slots
      .map((i) => ({ slot: i }))
      .map((i) =>
        bookings.includes(i) ? (i.available = false) : (i.available = true)
      );
    res.json(slots);
  }
);
app.post(
  "/api/fields/:id/bookings",
  verifyToken,
  (req, res, next) => {
    try {
      let { date } = req.body;
      date = new Date(date);
      if (date < Date.now()) {
        return res.status(403).send("Cannot book in the past");
      }
      req.date = new Date(date.toDateString());
      next();
    } catch (err) {
      return res.status(403).send("malformed date");
    }
  },
  async (req, res) => {
    // verify date
    const booking = req.body;
    const { id } = req.params;
    const db = await getConnection();
    const field = await db.collection("fields").findOne({ _id: id });
    if (!field.slots.includes(booking.slot)) {
      return res.status(403).send("Forbidden");
    }
    const alreadyTaken = await db
      .collection("bookings")
      .findOne({ date: req.date, slot: booking.slot });
    if (alreadyTaken) {
      return res.status(403).send("Booking unavaialble");
    }
    const inserted = await db
      .collection("bookings")
      .insertOne({ booking, userId: req.token._id });
    res.json({ bookingId: inserted.insertedId });
  }
);
app.delete(
  "/api/fields/:id/bookings/:bookingId",
  verifyToken,
  async (req, res) => {
    const { id, bookingId } = req.params;
    const db = await getConnection();
    const toDelete = await db
      .collection("bookings")
      .findOne({ fieldId: new ObjectId(id), _id: new ObjectId(bookingId) });
    if (!toDelete) {
      return res.status(404).send("Not found");
    }
    if (toDelete.userId !== req.token._id) {
      return res.status(403).send("Forbidden");
    }
    await db.collection("bookings").deleteOne({ id, bookingId });
    res.send("Booking deleted successfully");
  }
);
app.get("/api/fields", async (req, res) => {
  const { q } = req.query;
  const regex = { $regex: q, $options: "i" };
  const filter = {
    $or: [{ name: regex }, { sport: regex }, { location: regex }],
  };
  const db = await getConnection();
  const foundFields = await db.collection("fields").find(filter).toArray();
  res.json(foundFields);
});
/**
 * TOURNAMENTS
 */

const TournamentSchema = z.object({
  name: z.string().min(3),
  sport: z.string(),
  location: z.string(),
  startDate: z.string().refine((d) => !isNaN(Date.parse(d))),
  endDate: z.string().refine((d) => !isNaN(Date.parse(d))),
  maxTeams: z.number().int().positive(),
});

const assertCreator = async (req, res, next) => {
  const { id } = req.params;
  const db = await getConnection();
  const tournamentFound = db
    .collection("tournaments")
    .findOne({ _id: new ObjectId(id) });
  if (!tournamentFound) {
    return res.status(404).send("Not found");
  }
  if (tournamentFound.userId !== req.token._id) {
    return res.status(403).send("Forbidden");
  }
  next();
};
app.get("/api/tournaments", async (req, res) => {
  const { q } = req.query;
  const regex = { $regex: q, $options: "i" };
  const filter = { $or: [{ name: regex }, { sport: regex }] };
  const db = await getConnection();
  const tournaments = await db.collection("tournaments").find(filter).toArray();
  res.json(tournaments);
});
app.post("/api/tournaments", verifyToken, async (req, res) => {
  const parsed = TournamentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(304).send("Malformed package");
  }
  const tournament = parsed.data;
  if (tournament.startDate < Date.now()) {
    res.status(403).send("Tournaments must start in the future");
  } else {
    const db = await getConnection();
    const insertResult = await db
      .collection("tournaments")
      .insertOne({ ...tournament, userId: new ObjectId(req.token._id) });
    if (!insertResult) {
      res.status(500).send("Server error");
    } else {
      res.send("Tournament created successfully");
    }
  }
});
app.get("/api/tournaments/:id", async (req, res) => {
  const { id } = req.params;
  const db = await getConnection();
  const tournament = await db
    .collection("tournaments")
    .findOne({ _id: new ObjectId(id) });
  if (!tournament) {
    return res.status(404).send(`Not found`);
  }
  res.json(tournament);
});
app.put(
  "/api/tournaments/:id",
  verifyToken,
  assertCreator,
  async (req, res) => {
    const { id } = req.params;
    const db = await getConnection();
    const updated = await db
      .collection("tournaments")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: req.body });
    if (updated.ok == 1) {
      res.send("Tournament updated successfully");
    } else {
      res.status(500).send("Server error");
    }
  }
);
app.delete(
  "/api/tournaments/:id",
  verifyToken,
  assertCreator,
  async (req, res) => {
    const { id } = req.params;
    const db = await getConnection();
    const tournament = await db
      .collection("tournaments")
      .deleteOne({ _id: new ObjectId(id) });
    await db
      .collection("matches")
      .deleteMany({ tournamentId: new ObjectId(id) });
    if (!tournament.acknowledged) {
      res.status(500).send("Server error");
    } else {
      res.status(204).send(`Tournament ${id} successfully deleted`);
    }
  }
);
app.post(
  "/api/tournaments/:id/matches/generate",
  verifyToken,
  assertCreator,
  async (req, res) => {
    const { id } = req.params;
    const db = await getConnection();
    const tournament = await db
      .collection("tournaments")
      .findOne({ _id: new ObjectId(id) });
    const { date, teams, status } = tournament;
    const roundRobin = robin(
      teams.length,
      teams.map((t) => t.name)
    );
    const matches = roundRobin.map(async (m) => ({
      tournamentId: id,
      teams: m,
      date,
      status: "upcoming",
      result: null,
    }));
    await db.collection("matches").insertMany(matches);
    res.json(tournament, matches);
  }
);
app.get("/api/tournaments/:id/matches", async (req, res) => {
  const { id } = req.params;
  const db = await getConnection();
  const matches = await db
    .collection("matches")
    .find({ tournamentId: new ObjectId(id) })
    .toArray();
  res.json(matches);
});
app.get("/api/tournaments/:id/standings", async (req, res) => {
  const { id } = req.params;
  const db = await getConnection();
  const matches = await db
    .collection("matches")
    .find({ tournamentId: id, status: "completed" })
    .toArray();
  const tournamentDetails = await db
    .collection("tournaments")
    .findOne({ _id: new ObjectId(id) });
  const { teams } = tournamentDetails;
  const standings = teams.map((t) => ({ team: t, score: 0 }));
  matches.forEach((m) => {
    standings[teams.findIndex([m.teams[0]])].score += m.score[0];
    standings[teams.findIndex([m.teams[1]])].score += m.score[1];
  });
  const sorted = standings.sort((a, b) => b.score - a.score);
  res.json(sorted);
});

app.get("/api/matches/:id", async (req, res) => {
  const { id } = req.params;
  const db = await getConnection();
  const match = await db
    .collection("matches")
    .findOne({ _id: new ObjectId(id) });
  if (!match) {
    return res.status(404).send("Not found");
  }
  res.json(match);
});
app.put(
  "/api/matches/:id/result",
  verifyToken,
  assertCreator,
  async (req, res) => {
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
  }
);

app.get("/api/users", async (req, res) => {
  const { q } = req.query;
  const db = await getConnection();
  const users = await db
    .collection("users")
    .find({ name: { $regex: q, $options: "i" } })
    .toArray();
  res.json(users);
});
app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const db = await getConnection();
  const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
  const tournaments = await db
    .collection("tournaments")
    .find({ userId: id })
    .toArray();
  res.send({ ...user, tournaments });
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Server error");
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
