import { Collection, Filter, ObjectId, UpdateFilter, WithId } from "mongodb";
import log from "../../../log";
import { connectToDatabase } from "../external/mongodb";
import { Tack } from "./types";
import { DbTack } from "./types";

let collection: Collection<DbTack> | null;

async function tacksCollection(): Promise<Collection<DbTack>> {
    if (collection) {
        return collection;
    }
    const { db } = await connectToDatabase();
    try {
        await db.createCollection<Tack>("tacks");
    } catch (e) {
        log("collection 'tacks' probably exists");
    }
    collection = await db.collection<DbTack>("tacks");
    return collection;
}

export async function createTack(tack: DbTack): Promise<{ id: string } | null> {
    const response = await (await tacksCollection()).insertOne(tack);
    return { id: response.insertedId.toString() };
}

function convertDbTackToDomainTack(dbTack: WithId<DbTack>): Tack {
    return {
        id: dbTack._id ? dbTack._id.toString() : undefined,
        created_at: dbTack.created_at,
        url: dbTack.url,
        userId: dbTack.userId.toString(),
        tags: dbTack.tags,
        title: dbTack.title,
    };
}

export function convertDomainTackToDbTack(tack: Tack): DbTack {
    return {
        _id: tack.id ? new ObjectId(tack.id) : undefined,
        created_at: tack.created_at,
        url: tack.url,
        userId: new ObjectId(tack.userId),
        tags: tack.tags,
        title: tack.title,
    };
}

export async function getTack(filter: Filter<DbTack>): Promise<Tack | null> {
    const result = await (await tacksCollection()).findOne(filter);
    return result ? convertDbTackToDomainTack(result) : null;
}

export async function updateTack(
    filter: Filter<DbTack>,
    update: UpdateFilter<DbTack>,
): Promise<number> {
    const result = await (await tacksCollection()).updateOne(filter, update);
    return result.modifiedCount;
}

export async function getMostCommonTagsByUserId(userId: string): Promise<string[]> {
    const results = await (
        await tacksCollection()
    ).aggregate([
        {
            $match: { userId: { $eq: new ObjectId(userId) } },
        },
        { $unwind: "$tags" },
        {
            $group: {
                _id: "$tags",
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                count: -1,
            },
        },
        {
            $limit: 4,
        },
    ]);
    const array = await results.toArray();
    return array.map((row) => row._id);
}

export async function getTacksByUserId(id: string, extendFilter?: Filter<DbTack>) {
    let filterByUserId: Filter<DbTack> = { userId: new ObjectId(id) };
    let filter = {};
    if (extendFilter) {
        filter = { ...extendFilter, ...filterByUserId };
    } else {
        filter = filterByUserId;
    }

    const results = await (await tacksCollection())
        .find(filter)
        .sort({ _id: -1 })
        .map(convertDbTackToDomainTack)
        .toArray();
    return results;
}

export async function groupTagsByUserId(userId: string): Promise<{ tag: string; count: number }[]> {
    const results = await (
        await tacksCollection()
    ).aggregate([
        {
            $match: { userId: { $eq: new ObjectId(userId) } },
        },
        { $unwind: "$tags" },
        {
            $group: {
                _id: "$tags",
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                count: -1,
            },
        },
    ]);
    const array = await results.toArray();
    return array.map((row) => {
        return { tag: row._id, count: row.count };
    });
}
