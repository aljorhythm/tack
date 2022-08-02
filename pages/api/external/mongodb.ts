import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DB = "tack";

// check the MongoDB URI
if (!MONGODB_URI) {
    throw new Error("Define the MONGODB_URI environmental variable");
} else {
    console.log("MONGODB_URI:", MONGODB_URI);
}

// check the MongoDB DB
if (!MONGODB_DB) {
    throw new Error("Define the MONGODB_DB environmental variable");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
    // check the cached.
    if (cachedClient && cachedDb) {
        // load from cache
        return {
            client: cachedClient,
            db: cachedDb,
        };
    }

    // Connect to cluster
    let client = new MongoClient(MONGODB_URI);
    await client.connect();
    let db = client.db(MONGODB_DB);

    // set cache
    cachedClient = client;
    cachedDb = db;

    return {
        client: cachedClient,
        db: cachedDb,
    };
}
