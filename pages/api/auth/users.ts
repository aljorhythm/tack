import { Collection, ObjectId, WithId } from "mongodb";
import { connectToDatabase } from "../external/mongodb";

export type CreateUserRequest = {
    email: string;
    password: string;
};

export type User = {
    email: string;
};

let collection: Collection<User> | null;
const { db } = await connectToDatabase();
try {
    await db.createCollection<User>("users");
} catch (e) {
    console.log("collection 'users' probably exists");
}
collection = await db.collection<User>("users");

export async function createUser(userRequest: CreateUserRequest): Promise<{ id: ObjectId } | null> {
    const response = await collection!.insertOne(userRequest);
    return { id: response.insertedId };
}

export async function findUserByEmailAndPassword(
    email: string,
    password: string,
): Promise<WithId<User> | null> {
    return await collection!.findOne({ email, password }, { projection: { email: 1 } });
}
