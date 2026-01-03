db = db.getSiblingDB("superMongo");

// ---------- TOURNAMENTS ----------
const tournaments = [
  // FOOTBALL tournament (used by matches 690...001, 690...002)
  {
    _id: ObjectId("660000000000000000000001"),
    name: "Downtown Football Cup",
    sport: "football",
    maximum_teams: 4,
    fieldId: ObjectId("650000000000000000000004"),
    userId: ObjectId("640000000000000000000001"),
    startDate: new Date("2025-01-01T09:00:00Z"),
    teams: [
      ObjectId("670000000000000000000001"),
      ObjectId("670000000000000000000002"),
      ObjectId("670000000000000000000003"),
      ObjectId("670000000000000000000004"),
    ],
    schedule: true,
  },

  // BASKET tournament (used by match 690...003)
  {
    _id: ObjectId("660000000000000000000002"),
    name: "City Basketball Tournament",
    sport: "basket",
    maximum_teams: 6,
    fieldId: ObjectId("650000000000000000000003"),
    userId: ObjectId("640000000000000000000002"),
    startDate: new Date("2025-02-01T10:00:00Z"),
    teams: [
      ObjectId("670000000000000000000005"),
      ObjectId("670000000000000000000006"),
    ],
    schedule: true,
  },

  // VOLLEYBALL tournament (used by match 690...004)
  {
    _id: ObjectId("660000000000000000000003"),
    name: "Westside Volleyball League",
    sport: "volleyball",
    maximum_teams: 6,
    fieldId: ObjectId("650000000000000000000002"),
    userId: ObjectId("640000000000000000000003"),
    startDate: new Date("2025-02-20T17:00:00Z"),
    teams: [
      ObjectId("670000000000000000000002"),
      ObjectId("670000000000000000000007"),
    ],
    schedule: true,
  },

  // TENNIS tournament (used by matches 690...005–007)
  {
    _id: ObjectId("660000000000000000000004"),
    name: "Downtown Tennis Open",
    sport: "tennis",
    maximum_teams: 8,
    fieldId: ObjectId("650000000000000000000001"),
    userId: ObjectId("640000000000000000000004"),
    startDate: new Date("2025-02-10T09:00:00Z"),
    teams: [
      ObjectId("670000000000000000000001"),
      ObjectId("670000000000000000000003"),
      ObjectId("670000000000000000000004"),
      ObjectId("670000000000000000000005"),
      ObjectId("670000000000000000000006"),
      ObjectId("670000000000000000000007"),
    ],
    schedule: true,
  },
];

// Clear and insert
db.tournaments.deleteMany({});
db.tournaments.insertMany(tournaments);
