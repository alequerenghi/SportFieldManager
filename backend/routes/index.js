import { Router } from "express";
import auth from "./auth.js";
import fields from "./fields.js";
import tournaments from "./tournaments.js";
import matches from "./matches.js";
import users from "./users.js";
import teams from "./teams.js";
import getConnection from "../dbConnector.js";
import { verifyToken } from "../utils.js";

const router = Router();

router.use("/auth", auth);
router.use("/fields", fields);
router.use("/tournaments", tournaments);
router.use("/matches", matches);
router.use("/users", users);
router.use("/teams", teams);
router.get("/whoami", verifyToken, (req, res) => {
  res.json({ authenticated: true, ...req.token });
});

router.get("/players", async (req, res, next) => {
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

export default router;
