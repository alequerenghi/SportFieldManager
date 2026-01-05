import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import getConnection from "./dbConnector.js";
const PORT = 3000;
const __dirname = path.resolve();

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use("/api", router);

app.get("/{*any}", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.status || 500;
  let message = "";
  if (!err.message) {
    switch (status) {
      case 404:
        message = "Not found";
        break;
      case 403:
        message = "Unauthorized";
        break;
      case 500:
        message = "Server error";
        break;
    }
  } else {
    message = err.message;
  }
  res.status(status).json({ error: message });
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

const db = await getConnection();
await createIndexes(db);
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
