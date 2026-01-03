import jwt from "jsonwebtoken";
import getConnection from "./dbConnector.js";
import { ObjectId } from "mongodb";

const { verify } = jwt;

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (typeof token === "undefined") {
    return res.status(403).json({ error: "Please log in" });
  }
  verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Expired or invalid token" });
    }
    req.token = decoded;
    next();
  });
};

const assertCreator = async (req, res, next) => {
  try {
    const { id } = req.params;
    const db = await getConnection();
    const tournament = await db
      .collection("tournaments")
      .findOne({ _id: new ObjectId(id) });
    if (!tournament) {
      throw new HttpError(404);
    }
    if (tournament.userId.toString() !== req.token._id) {
      throw new HttpError(403);
    }
    req.tournament = tournament;
    next();
  } catch (error) {
    next(error);
  }
};

const normalizeDate = (date) => new Date(new Date(date).toDateString());

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export { verifyToken, normalizeDate, HttpError, assertCreator };
