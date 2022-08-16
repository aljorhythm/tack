import { Collection, Filter, WithId } from "mongodb";
import log from "../../../log";
import { connectToDatabase } from "../external/mongodb";
import { Piece } from "./types";

let collection: Collection<Piece> | null;

async function piecesCollection(): Promise<Collection<Piece>> {
    if (collection) {
        return collection;
    }
    const { db } = await connectToDatabase();
    try {
        await db.createCollection<Piece>("pieces");
    } catch (e) {
        log("collection 'pieces' probably exists");
    }
    collection = await db.collection<Piece>("pieces");
    return collection;
}

export async function createPiece(piece: Piece): Promise<{ id: string } | null> {
    const response = await (await piecesCollection()).insertOne(piece);
    return { id: response.insertedId.toString() };
}

function sanitisePiece(piece: WithId<Piece>) {
    var clone: Piece = Object.assign({}, piece);
    clone.tags = clone.tags || [];
    clone.id = piece._id.toString();
    delete clone._id;
    return clone;
}

export async function getPiecesByUserId(id: string, extendFilter?: Filter<Piece>) {
    let filterByUserId = { userId: id };
    let filter = {};
    if (extendFilter) {
        filter = { ...extendFilter, ...filterByUserId };
    } else {
        filter = filterByUserId;
    }
    const results = await (await piecesCollection())
        .find(filter)
        .sort({ _id: -1 })
        .map(sanitisePiece)
        .toArray();
    return results;
}
