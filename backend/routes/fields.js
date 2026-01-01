import express from "express";
import { HttpError, normalizeDate, verifyToken } from "../utils.js";
import getConnection from "../dbConnector.js";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const { verify } = jwt;
const router = express.Router();

const verifyTokenNotRequired = async (req, res, next) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      req.token = verify(token, process.env.JWT_SECRET);
    } catch (err) {
      next(err);
    }
  }
  next();
};

router.get("/:id/slots", verifyTokenNotRequired, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    if (!date) {
      const err = new Error("Missing date");
      err.status = 400;
      throw err;
    }
    const normalizedDate = normalizeDate(date);
    const db = await getConnection();
    const field = await db
      .collection("fields")
      .findOne({ _id: new ObjectId(id) });
    if (!field) {
      const err = new Error();
      err.status = 404;
      throw err;
    }
    const bookings = await db
      .collection("bookings")
      .find({ date: normalizedDate, fieldId: new ObjectId(id) })
      .toArray();
    const bookingMap = new Map();
    bookings.forEach((b) => bookingMap.set(b.slot, b));
    const slots = field.slots.map((slot) => {
      const hour = slot.split(":").map(Number)[0];
      const booking = bookingMap.get(slot);
      const slotDateTime = new Date(date);
      slotDateTime.setHours(hour, 0, 0, 0);
      booking && console.log(booking.userId);
      req.token && console.log(req.token._id);
      return {
        _id: booking?._id,
        slot,
        available: !booking && slotDateTime > new Date(),
        me:
          booking && req.token
            ? booking.userId.toString() === req.token._id
            : false,
      };
    });
    res.json(slots);
  } catch (err) {
    next(err);
  }
});
router.post("/:id/bookings", verifyToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, slot } = req.body;

    if (!date || !slot) {
      throw new HttpError(400, "Missing date or slot");
    }

    const normalizedDate = normalizeDate(date);
    const bookingDateTime = new Date(
      `${normalizedDate.toISOString().substring(0, 10)}T${slot}`
    );
    if (bookingDateTime < new Date()) {
      throw new HttpError(403, "Cannot book in the past");
    }

    const db = await getConnection();
    const field = await db
      .collection("fields")
      .findOne({ _id: new ObjectId(id) });
    if (!field) {
      throw new HttpError(404);
    }
    if (!field.slots.includes(slot)) {
      throw new HttpError(403);
    }
    const alreadyTaken = await db
      .collection("bookings")
      .findOne({ fieldId: new ObjectId(id), date: normalizedDate, slot });
    if (alreadyTaken) {
      throw new HttpError(403, "Booking unavailable");
    }
    const result = await db.collection("bookings").insertOne({
      slot,
      date: normalizedDate,
      userId: new ObjectId(req.token._id),
      fieldId: new ObjectId(id),
    });
    res.json({ bookingId: result.insertedId });
  } catch (err) {
    next(err);
  }
});
router.delete(
  "/:id/bookings/:bookingId",
  verifyToken,
  async (req, res, next) => {
    try {
      const { id, bookingId } = req.params;
      const db = await getConnection();
      const booking = await db
        .collection("bookings")
        .findOne({ fieldId: new ObjectId(id), _id: new ObjectId(bookingId) });
      if (!booking) {
        throw new HttpError(404);
      }
      if (booking.userId.toString() !== req.token._id) {
        throw new HttpError(403);
      }
      await db
        .collection("bookings")
        .deleteOne({ _id: new ObjectId(bookingId) });
      res.json({ message: "Booking deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
);
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = await getConnection();
    const field = await db
      .collection("fields")
      .findOne({ _id: new ObjectId(id) });
    if (!field) {
      throw new HttpError(404);
    }
    res.json(field);
  } catch (error) {
    next(error);
  }
});
router.get("/", async (req, res) => {
  try {
    const { q = "" } = req.query;
    const regex = { $regex: q, $options: "i" };
    const filter = {
      $or: [{ name: regex }, { sport: regex }, { location: regex }],
    };
    const db = await getConnection();
    const foundFields = await db.collection("fields").find(filter).toArray();
    res.json(foundFields);
  } catch (error) {
    next(error);
  }
});

export default router;
