db = db.getSiblingDB("superMongo"); // optional if using default 'test' DB

const users = [
  {
    _id: ObjectId("640000000000000000000001"),
    username: "alice123",
    name: "Alice",
    surname: "Johnson",
    password: "password1",
  },
  {
    _id: ObjectId("640000000000000000000002"),
    username: "bob456",
    name: "Bob",
    surname: "Smith",
    password: "password2",
  },
  {
    _id: ObjectId("640000000000000000000003"),
    username: "carol789",
    name: "Carol",
    surname: "Taylor",
    password: "password3",
  },
  {
    _id: ObjectId("640000000000000000000004"),
    username: "dave321",
    name: "Dave",
    surname: "Brown",
    password: "password4",
  },
  {
    _id: ObjectId("640000000000000000000005"),
    username: "eve654",
    name: "Eve",
    surname: "Davis",
    password: "password5",
  },
];

// Clear existing users and insert
db.users.insertMany(users);
