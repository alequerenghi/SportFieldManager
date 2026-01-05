import { MongoClient } from "mongodb";

const uri = "mongodb://mongo:27017/superMongo";
let cachedDb = null;
let mongoClient = null;

const getConnection = async () => {
  if (cachedDb) {
    return cachedDb;
  }
  mongoClient = new MongoClient(uri);
  try {
    await mongoClient.connect();
    cachedDb = mongoClient.db("superMongo");
    console.info("db connection established");
    return cachedDb;
  } catch (error) {
    console.error("Error in connecting to db => ", error);
    throw error;
  }
};

export default getConnection;
