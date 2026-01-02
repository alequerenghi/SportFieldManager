db = db.getSiblingDB("superMongo"); // optional if using default 'test' DB

const fields = [
  {
    _id: ObjectId("650000000000000000000001"),
    name: "Central Tennis Court",
    sport: "tennis",
    location: "Downtown",
    slots: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
  },
  {
    _id: ObjectId("650000000000000000000002"),
    name: "Westside Volleyball Hall",
    sport: "volleyball",
    location: "West District",
    slots: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
  },
  {
    _id: ObjectId("650000000000000000000003"),
    name: "Eastside Basketball Court",
    sport: "basket",
    location: "East District",
    slots: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
  },
  {
    _id: ObjectId("650000000000000000000004"),
    name: "North Football Stadium",
    sport: "football",
    location: "North Hills",
    slots: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
  },
  {
    _id: ObjectId("650000000000000000000005"),
    name: "South Multi-Sport Arena",
    sport: "tennis",
    location: "South Park",
    slots: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
  },
  {
    _id: ObjectId("650000000000000000000006"),
    name: "Downtown Volleyball Court",
    sport: "volleyball",
    location: "Downtown",
    slots: ["08:00", "09:00", "10:00", "11:00", "12:00"],
  },
  {
    _id: ObjectId("650000000000000000000007"),
    name: "City Basket Hall",
    sport: "basket",
    location: "City Center",
    slots: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"],
  },
  {
    _id: ObjectId("650000000000000000000008"),
    name: "Stadium Football Arena",
    sport: "football",
    location: "Old Town",
    slots: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
  },
];

db.fields.insertMany(fields);
