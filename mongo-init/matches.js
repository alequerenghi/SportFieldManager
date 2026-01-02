db = db.getSiblingDB("superMongo");

// ---------- MATCHES ----------
const matches = [
  // FOOTBALL (completed)
  {
    _id: ObjectId("690000000000000000000001"),
    tournamentId: ObjectId("660000000000000000000001"),
    teams: [
      ObjectId("670000000000000000000001"),
      ObjectId("670000000000000000000002"),
    ],
    date: new Date("2025-01-10T18:00:00Z"),
    status: "completed",
    result: [2, 1],
  },
  {
    _id: ObjectId("690000000000000000000002"),
    tournamentId: ObjectId("660000000000000000000001"),
    teams: [
      ObjectId("670000000000000000000003"),
      ObjectId("670000000000000000000004"),
    ],
    date: new Date("2025-01-11T18:00:00Z"),
    status: "completed",
    result: [0, 0],
  },

  // BASKET (completed)
  {
    _id: ObjectId("690000000000000000000003"),
    tournamentId: ObjectId("660000000000000000000002"),
    teams: [
      ObjectId("670000000000000000000005"),
      ObjectId("670000000000000000000006"),
    ],
    date: new Date("2025-02-05T20:00:00Z"),
    status: "completed",
    result: [89, 83],
  },

  // VOLLEYBALL (upcoming)
  {
    _id: ObjectId("690000000000000000000004"),
    tournamentId: ObjectId("660000000000000000000003"),
    teams: [
      ObjectId("670000000000000000000002"),
      ObjectId("670000000000000000000007"),
    ],
    date: new Date("2025-03-01T17:30:00Z"),
    status: "upcoming",
    result: null,
  },

  // TENNIS (completed – best of 3)
  {
    _id: ObjectId("690000000000000000000005"),
    tournamentId: ObjectId("660000000000000000000004"),
    teams: [
      ObjectId("670000000000000000000001"),
      ObjectId("670000000000000000000003"),
    ],
    date: new Date("2025-02-20T15:00:00Z"),
    status: "completed",
    result: [
      [6, 4],
      [3, 6],
      [6, 2],
    ],
  },

  // TENNIS (completed – straight sets)
  {
    _id: ObjectId("690000000000000000000006"),
    tournamentId: ObjectId("660000000000000000000004"),
    teams: [
      ObjectId("670000000000000000000004"),
      ObjectId("670000000000000000000005"),
    ],
    date: new Date("2025-02-21T16:00:00Z"),
    status: "completed",
    result: [
      [6, 1],
      [6, 3],
    ],
  },

  // TENNIS (upcoming)
  {
    _id: ObjectId("690000000000000000000007"),
    tournamentId: ObjectId("660000000000000000000004"),
    teams: [
      ObjectId("670000000000000000000006"),
      ObjectId("670000000000000000000007"),
    ],
    date: new Date("2025-02-23T14:00:00Z"),
    status: "upcoming",
    result: null,
  },
];

// Clear and insert
db.matches.insertMany(matches);
