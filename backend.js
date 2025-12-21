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

const verifyDate = (req, res, next) => {
  const date = new Date(req.date);
  if (date < Date.now()) {
    throw Error("Cannot select previous dates");
  }
  next();
};

/**
 * FIELDS
 */
app
  .route("/api/fields")
  .get("?q=:query", async (req, res) => {
    const { q } = req.query;
    const query = processQuery(q);
    const db = await getConnection();
    const foundFields = await db.collection("fields").find({ query }).toArray();
    res.json(foundFields);
  })
  .get("/:id", async (req, res) => {
    const fieldId = req.params.id;
    const db = await getConnection();
    const fieldDetails = await db.collection("fields").findOne({ fieldId });
    if (!fieldDetails) {
      return res.status(404).send(`Tournament ${fieldId} not found`);
    }
    res.json(fieldDetails);
  })
  .get("/:id/slots?date=YYYY-MM-DD", async (req, res) => {
    const date = new Date(req.query.date);
    const fieldId = req.params.id;
    const db = await getConnection();
    const fieldDetails = await db.collection("fields").findOne({ fieldId });
    if (fieldDetails) {
      const bookings = await db
        .collection("bookings")
        .find({ date, fieldId })
        .toArray();
      const availableSlots = fieldDetails.slots;
      availableSlots.forEach((element) =>
        bookings.includes(element)
          ? (element.available = false)
          : (element.available = true)
      );
      res.json(availableSlots);
    }
  })
  .post("/:id/bookings", verifyToken, async (req, res) => {
    // verify date
    const booking = req.body;
    if (booking.date < Date.now()) {
      return res.status(403).send("Forbidden");
    }
    if (booking.slot.start > booking.slot.end) {
      return res.status(400).send("Malformed booking");
    }
    const { date, fieldId } = booking;
    const db = await getConnection();
    const fieldDetails = await db.collection("fields").findOne({ fieldId });
    if (
      fieldDetails.openingHours.start < booking.slot.start ||
      fieldDetails.openingHours.end > booking.slot.end
    ) {
      return res.status(403).send("Forbidden");
    }
    const alreadyTaken = await db
      .collection("bookings")
      .find({ date, fieldId })
      .toArray();
    if (
      alreadyTaken &&
      booking.slot.start < alreadyTaken.slot.end &&
      alreadyTaken.slot.start < booking.slot.end
    ) {
      return res.status(409).send("Slot already booked");
    }
    const inserted = await db
      .collection("bookings")
      .insertOne({ booking, user_id: req.token._id });
    res.json({ bookingId: inserted.insertedId });
  })
  .delete("/:id/bookings/:bookingId", verifyToken, async (req, res) => {
    const id = req.params.id;
    const bookingId = req.params.bookingId;
    const db = await getConnection();
    const toDelete = await db.collection("bookings").findOne({ id, bookingId });
    if (!toDelete) {
      return res.status(404).send("Not found");
    }
    if (toDelete.user_id !== req.token._id) {
      return res.status(403).send("Forbidden");
    }
    await db.collection("bookings").deleteOne({ id, bookingId });
    res.send("Booking deleted successfully");
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
  .post(verifyToken, async (req, res) => {
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
