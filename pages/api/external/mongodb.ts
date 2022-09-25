import { MongoClient, Db } from "mongodb";
import log, { maskEveryFour } from "../../../log";

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DB = "tack";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
    if (cachedClient && cachedDb) {
        return {
            client: cachedClient,
            db: cachedDb,
        };
    }

    if (!MONGODB_URI) {
        throw new Error("Define the MONGODB_URI environmental variable");
    } else {
        log("MONGODB_URI:", maskEveryFour(MONGODB_URI));
    }

    let client = new MongoClient(MONGODB_URI);
    await client.connect();
    let db = client.db(MONGODB_DB);

    cachedClient = client;
    cachedDb = db;

    log("set cachedClient, cachedDb");

    return {
        client: cachedClient,
        db: cachedDb,
    };
}
