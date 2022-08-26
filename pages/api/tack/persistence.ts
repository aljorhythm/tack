import { Collection, Filter, WithId } from "mongodb";
import log from "../../../log";
import { connectToDatabase } from "../external/mongodb";
import { Piece } from "./types";

let collection: Collection<Piece> | null;

async function tacksCollection(): Promise<Collection<Piece>> {
    if (collection) {
        return collection;
    }
    const { db } = await connectToDatabase();
    try {
        await db.createCollection<Piece>("tacks");
    } catch (e) {
        log("collection 'tacks' probably exists");
    }
    collection = await db.collection<Piece>("tacks");
    return collection;
}

export async function createPiece(tack: Piece): Promise<{ id: string } | null> {
    const response = await (await tacksCollection()).insertOne(tack);
    return { id: response.insertedId.toString() };
}

function sanitisePiece(tack: WithId<Piece>) {
    var clone: Piece = Object.assign({}, tack);
    clone.tags = clone.tags || [];
    clone.id = tack._id.toString();
    delete clone._id;
    return clone;
}

export async function getTacksByUserId(id: string, extendFilter?: Filter<Piece>) {
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
        .map(sanitisePiece)
        .toArray();
    return results;
}
