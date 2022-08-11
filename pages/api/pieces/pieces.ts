import { Collection } from "mongodb";
import { connectToDatabase } from "../external/mongodb";

export type Piece = {
    url: string;
    userId: string;
    _id?: string;
};

let collection: Collection<Piece> | null;

async function piecesCollection(): Promise<Collection<Piece>> {
    if (collection) {
        return collection;
    }
    const { db } = await connectToDatabase();
    try {
        await db.createCollection<Piece>("pieces");
    } catch (e) {
        console.log("collection 'pieces' probably exists");
    }
    collection = await db.collection<Piece>("pieces");
    return collection;
}

export async function createPiece(piece: Piece): Promise<{ id: string } | null> {
    const response = await (await piecesCollection()).insertOne(piece);
    return { id: response.insertedId.toString() };
}

export async function getPiecesByUserId(id: string): Promise<Array<Piece>> {
    const results = await (
        await piecesCollection()
    )
        .find({ userId: id })
        .map(function (piece) {
            var clone = Object.assign({}, piece);
            clone._id = piece._id.toString();
            return clone;
        })
        .toArray();
    return results;
}
