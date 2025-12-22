import { MongoClient } from "mongodb";

const uri = "mongodb://mongo:27017/superMongo";
let cachedDb = null;
let mongoClient = null;

export const getConnection = async () => {
  if (cachedDb) {
    console.log("Retrieved connection");
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

// const closeConnection = async () => {
//     try {
//         if (!cachedDb) {
//             await mongoClient.close();
//             cachedDb = null;
//             mongoClient = null;
//             console.log("Connection closed");
//             return true;
//         }
//     } catch (error) {
//         console.error("Error in closing connection => ", error);
//         return false;
//     }
// }
