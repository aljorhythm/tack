import { Collection, Filter, WithId } from "mongodb";
import log from "../../../log";
import { connectToDatabase } from "../external/mongodb";
import { Tack } from "./types";

let collection: Collection<Tack> | null;

async function tacksCollection(): Promise<Collection<Tack>> {
    if (collection) {
        return collection;
    }
    const { db } = await connectToDatabase();
    try {
        await db.createCollection<Tack>("tacks");
    } catch (e) {
        log("collection 'tacks' probably exists");
    }
    collection = await db.collection<Tack>("tacks");
    return collection;
}

export async function createTack(tack: Tack): Promise<{ id: string } | null> {
    const response = await (await tacksCollection()).insertOne(tack);
    return { id: response.insertedId.toString() };
}

function sanitiseTack(tack: WithId<Tack>) {
    var clone: Tack = Object.assign({}, tack);
    clone.tags = clone.tags || [];
    clone.id = tack._id.toString();
    delete clone._id;
    return clone;
}

export async function getTacksByUserId(id: string, extendFilter?: Filter<Tack>) {
    let filterByUserId = { userId: id };
    let filter = {};
    if (extendFilter) {
        filter = { ...extendFilter, ...filterByUserId };
    } else {
        filter = filterByUserId;
    }

    const results = await (await tacksCollection())
        .find(filter)
        .sort({ _id: -1 })
        .map(sanitiseTack)
        .toArray();
    return results;
}
