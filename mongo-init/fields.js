db = db.getSiblingDB("superMongo");

db.fields.insertMany([
{
  "_id": 1,
  "name": "City Sports Arena",
  "sport": "football",
  "location": "Downtown",
  "slots": ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"]
},
{
  "name": "Riverside Football Center",
  "sport": "football",
  "location": "Riverside",
  "slots": ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"]
},
{
  "name": "Green Park Tennis Club",
  "sport": "tennis",
  "location": "Green Park",
  "slots": ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00"]
},
{
  "name": "Downtown Tennis Courts",
  "sport": "tennis",
  "location": "Downtown",
  "slots": ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"]
},
{
  "name": "Westside Basketball Arena",
  "sport": "basketball",
  "location": "Westside",
  "slots": ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"]
},
{
  "name": "Central Hoops Court",
  "sport": "basketball",
  "location": "City Center",
  "slots": ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"]
}
]);

print("Field collection seeded");
