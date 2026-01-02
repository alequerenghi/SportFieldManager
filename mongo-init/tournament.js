db = db.getSiblingDB("superMongo"); // optional if using default 'test' DB

const tournaments = [
  {
    _id: ObjectId("660000000000000000000001"),
    name: "Downtown Tennis Open",
    sport: "tennis",
    maximum_teams: 8,
    fieldId: ObjectId("650000000000000000000001"), // Central Tennis Court
    userId: ObjectId("640000000000000000000001"), // user1
    startDate: new Date("2026-02-10T09:00:00Z"),
    teams: [],
  },
  {
    _id: ObjectId("660000000000000000000002"),
    name: "Westside Volleyball League",
    sport: "volleyball",
    maximum_teams: 6,
    fieldId: ObjectId("650000000000000000000002"), // Westside Volleyball Hall
    userId: ObjectId("640000000000000000000002"), // user2
    startDate: new Date("2026-03-05T10:00:00Z"),
    teams: [],
  },
  {
    _id: ObjectId("660000000000000000000003"),
    name: "East Basket Championship",
    sport: "basket",
    maximum_teams: 10,
    fieldId: ObjectId("650000000000000000000003"), // Eastside Basketball Court
    userId: ObjectId("640000000000000000000003"), // user3
    startDate: new Date("2026-04-01T11:00:00Z"),
    teams: [],
  },
  {
    _id: ObjectId("660000000000000000000004"),
    name: "North Football Cup",
    sport: "football",
    maximum_teams: 12,
    fieldId: ObjectId("650000000000000000000004"), // North Football Stadium
    userId: ObjectId("640000000000000000000004"), // user4
    startDate: new Date("2026-05-15T08:00:00Z"),
    teams: [],
  },
  {
    _id: ObjectId("660000000000000000000005"),
    name: "South Tennis League",
    sport: "tennis",
    maximum_teams: 4,
    fieldId: ObjectId("650000000000000000000005"), // South Multi-Sport Arena
    userId: ObjectId("640000000000000000000001"), // user1
    startDate: new Date("2026-06-20T09:30:00Z"),
    teams: [],
  },
  {
    _id: ObjectId("660000000000000000000006"),
    name: "City Basketball Tournament",
    sport: "basket",
    maximum_teams: 6,
    fieldId: ObjectId("650000000000000000000007"), // City Basket Hall
    userId: ObjectId("640000000000000000000002"), // user2
    startDate: new Date("2026-07-10T10:30:00Z"),
    teams: [],
  },
  {
    _id: ObjectId("660000000000000000000007"),
    name: "Old Town Football League",
    sport: "football",
    maximum_teams: 8,
    fieldId: ObjectId("650000000000000000000008"), // Stadium Football Arena
    userId: ObjectId("640000000000000000000003"), // user3
    startDate: new Date("2026-08-05T08:30:00Z"),
    teams: [],
  },
];

// Clear existing tournaments and insert
db.tournaments.insertMany(tournaments);
