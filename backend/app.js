import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { verifyToken } from "./utils.js";
import {
  auth,
  fields,
  matches,
  tournaments,
  users,
  teams,
} from "./routes/index.js";
import getConnection from "./dbConnector.js";
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use("/api/auth", auth);
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use("/api/fields", fields);
app.use("/api/tournaments", tournaments);
app.use("/api/matches", matches);
app.use("/api/users", users);
app.use("/api/teams", teams);

app.get("/api/whoami", verifyToken, (req, res) => {
  res.json({ authenticated: true, ...req.token });
});

app.get("/api/players", async (req, res, next) => {
  try {
    const { q } = req.query;
    const regex = { $regex: q, $options: "i" };
    const db = await getConnection();
    const players = await db
      .collection("players")
      .find({
        $or: [{ name: regex }, { surname: regex }],
      })
      .toArray();
    const teamIds = [...new Set(players.map((p) => p.teamId))];
    const teams = await db
      .collection("teams")
      .find({ _id: { $in: teamIds } })
      .toArray();
    players.forEach((p) => {
      p.team = teams.find((t) => t._id.toString() === p.teamId.toString()).name;
    });
    res.json(players);
  } catch (error) {
    next(error);
  }
});

const createIndexes = async (db) => {
  await db
    .collection("bookings")
    .createIndex({ fieldId: 1, date: 1, slot: 1 }, { unique: true });
  await db.collection("bookings").createIndex({ fieldId: 1, date: 1 });

  await db.collection("users").createIndex({ username: 1 }, { unique: true });

  await db.collection("tournaments").createIndex({ userId: 1 });

  await db.collection("matches").createIndex({ tournamentId: 1, round: 1 });
  await db.collection("matches").createIndex({ tournamentId: 1, status: 1 });
};
// app.get("/*", (req, res) =>
//   res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
// );

const db = await getConnection();
await createIndexes(db);
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
