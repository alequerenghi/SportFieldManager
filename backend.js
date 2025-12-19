import express from "express";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import router from "./auth";
import { getConnection } from "./dbConnector";

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use("/api/auth", router);
app.use(express.static("public"));

// TODO
const verifyToken = (req, res, next) => {};

/**
 * FIELDS
 */
app
  .route("/api/fields")
  .get("?q=:query", async (req, res) => {
    const query = processQuery(req.query);
    const db = await getConnection();
    const foundFields = await db.collection("fields").find({ query }).toArray();
    res.json(foundFields);
  })
  // TODO field details
  .get("/:id", async (req, res) => {
    const fieldId = req.params.id;
    const db = await getConnection();
    const fieldDetails = await db.collection("fields").findOne({ fieldId });
    if (!fieldDetails) {
      return res.status(404).send(`Tournamend ${fieldId} not found`);
    }
    res.json(fieldDetails);
  })
  /**
   * GET SLOTS
   */
  .post("/:id/bookings", verifyToken, async (req, res) => {
    /** TAKE SLOT */
  })
  .delete("/:id/bookings/:bookingId", verifyToken, async (req, res) => {
    /** remove taken slot */
  });
/**
 * TOURNAMENTS
 */
app
  .route("/api/tournaments")
  .get("?q=query", async (req, res) => {
    const query = processQuery(req.query);
    const db = await getConnection();
    const foundTournaments = await db
      .collection("tournaments")
      .find({ query })
      .toArray();
    res.json(foundTournaments);
  })
  .post("", verifyToken, async (req, res) => {
    const { name, sport, maxTeams, startDate } = req.body;
    if (startDate < Date.now()) {
      res.status(400).send("Tournaments must start in the future");
    } else {
      const db = await getConnection();
      const insertResult = await db
        .collection("tournaments")
        .insertOne({ name, sport, maxTeams, startDate });
      if (!insertResult) {
        res.status(500).send("Server error");
      } else {
        res.send("Tournament created successfully");
      }
    }
  })
  .get("/:id", async (req, res) => {
    const tournamentId = req.params.id;
    const db = await getConnection();
    const tournamentDetails = await db
      .collection("tournaments")
      .findOne({ tournamentId });
    if (!tournamentDetails) {
      return res.status(404).send(`Tournament ${tournamentId} not found`);
    }
    res.json(tournamentDetails);
  })
  .put("/:id", verifyToken, async (req, res) => {
    const { name, maxTeams } = req.body;
    const tournamentId = req.params.id;
    const db = await getConnection();
    const updated = await db
      .collection("tournaments")
      .findOneAndUpdate({ tournamentId }, { name, maxTeams });
    if (updated.ok == 1) {
      res.send("Tournament updated successfully");
    } else {
      res.status(500).send("Server error");
    }
  })
  .delete("/:id", verifyToken, (req, res) => {})
  .post("/:id/matches/generate");

app.use(verifyToken);
app.use(express.static("private"));

const processQuery = (query) => {
  return query;
};
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
