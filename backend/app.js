import express from "express";
import cookieParser from "cookie-parser";
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

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use("/api/auth", auth);
app.use(express.static("../frontend/public"));
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
    const db = await getConnection();
    const players = await db
      .collections("players")
      .find({ $regex: q, $options: "i" })
      .toArray();
    res.json(players);
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
