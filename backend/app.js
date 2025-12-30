import express from "express";
import cookieParser from "cookie-parser";
import auth from "./auth.js";
import fields from "./fields.js";
import tournaments from "./tournaments.js";
import matches from "./matches.js";
import users from "./users.js";
import { verifyToken } from "./utils.js";

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

app.get("/api/whoami", verifyToken, (req, res) => {
  res.json({ authenticated: true, ...req.token });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
