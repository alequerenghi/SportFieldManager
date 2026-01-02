db = db.getSiblingDB("superMongo"); // optional

// ---------- TEAMS ----------
const teams = [
  {
    _id: ObjectId("670000000000000000000001"),
    name: "Red Rockets",
    userId: ObjectId("640000000000000000000001"),
  },
  {
    _id: ObjectId("670000000000000000000002"),
    name: "Blue Blasters",
    userId: ObjectId("640000000000000000000002"),
  },
  {
    _id: ObjectId("670000000000000000000003"),
    name: "Green Giants",
    userId: ObjectId("640000000000000000000003"),
  },
  {
    _id: ObjectId("670000000000000000000004"),
    name: "Yellow Yaks",
    userId: ObjectId("640000000000000000000004"),
  },
  {
    _id: ObjectId("670000000000000000000005"),
    name: "Purple Panthers",
    userId: ObjectId("640000000000000000000001"),
  },
  {
    _id: ObjectId("670000000000000000000006"),
    name: "Orange Owls",
    userId: ObjectId("640000000000000000000002"),
  },
  {
    _id: ObjectId("670000000000000000000007"),
    name: "Silver Sharks",
    userId: ObjectId("640000000000000000000003"),
  },
];

// Clear existing teams and insert
db.teams.insertMany(teams);

// ---------- PLAYERS ----------
const players = [
  {
    _id: ObjectId("680000000000000000000001"),
    name: "Alice",
    surname: "Smith",
    jerseyNumber: 7,
    teamId: ObjectId("670000000000000000000001"),
  },
  {
    _id: ObjectId("680000000000000000000002"),
    name: "Bob",
    surname: "Johnson",
    jerseyNumber: 10,
    teamId: ObjectId("670000000000000000000001"),
  },
  {
    _id: ObjectId("680000000000000000000003"),
    name: "Charlie",
    surname: "Brown",
    jerseyNumber: 5,
    teamId: ObjectId("670000000000000000000002"),
  },
  {
    _id: ObjectId("680000000000000000000004"),
    name: "Diana",
    surname: "White",
    jerseyNumber: 12,
    teamId: ObjectId("670000000000000000000002"),
  },
  {
    _id: ObjectId("680000000000000000000005"),
    name: "Ethan",
    surname: "Taylor",
    jerseyNumber: 8,
    teamId: ObjectId("670000000000000000000003"),
  },
  {
    _id: ObjectId("680000000000000000000006"),
    name: "Fiona",
    surname: "Anderson",
    jerseyNumber: 9,
    teamId: ObjectId("670000000000000000000003"),
  },
  {
    _id: ObjectId("680000000000000000000007"),
    name: "George",
    surname: "Thomas",
    jerseyNumber: 4,
    teamId: ObjectId("670000000000000000000004"),
  },
  {
    _id: ObjectId("680000000000000000000008"),
    name: "Hannah",
    surname: "Moore",
    jerseyNumber: 11,
    teamId: ObjectId("670000000000000000000004"),
  },
  {
    _id: ObjectId("680000000000000000000009"),
    name: "Ian",
    surname: "Jackson",
    jerseyNumber: 3,
    teamId: ObjectId("670000000000000000000005"),
  },
  {
    _id: ObjectId("680000000000000000000010"),
    name: "Julia",
    surname: "Martin",
    jerseyNumber: 6,
    teamId: ObjectId("670000000000000000000005"),
  },
  {
    _id: ObjectId("680000000000000000000011"),
    name: "Kevin",
    surname: "Lee",
    jerseyNumber: 2,
    teamId: ObjectId("670000000000000000000006"),
  },
  {
    _id: ObjectId("680000000000000000000012"),
    name: "Laura",
    surname: "Perez",
    jerseyNumber: 1,
    teamId: ObjectId("670000000000000000000006"),
  },
  {
    _id: ObjectId("680000000000000000000013"),
    name: "Mike",
    surname: "Robinson",
    jerseyNumber: 14,
    teamId: ObjectId("670000000000000000000007"),
  },
  {
    _id: ObjectId("680000000000000000000014"),
    name: "Nina",
    surname: "Clark",
    jerseyNumber: 13,
    teamId: ObjectId("670000000000000000000007"),
  },
];

// Clear existing players and insert
db.players.insertMany(players);
