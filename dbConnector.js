import { MongoClient } from "mongodb";

const uri = "connection_string";
let client;


const connect2db = async () => {
    if (client) {
        console.log("Retrieved connection");
        return client;
    }
    try {
        console.log("Connecting")
        const db = await MongoClient.connect(uri);
        client = db;
        return client;
    } catch (err) {
        console.log(err);
        client.close();
    }
}

export default connect2db;