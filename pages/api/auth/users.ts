import { Collection, ObjectId, WithId } from "mongodb";
import { connectToDatabase } from "../external/mongodb";

import bcrypt from "bcrypt";

export type CreateUserRequest = {
    email: string;
    password: string;
};

type DbUser = {
    email: string;
    password: string;
};

export type User = {
    email: string;
};

let collection: Collection<DbUser> | null;
const { db } = await connectToDatabase();
try {
    await db.createCollection<DbUser>("users");
} catch (e) {
    console.log("collection 'users' probably exists");
}
collection = await db.collection<DbUser>("users");

const saltRounds = await bcrypt.genSalt();

export async function createUser(userRequest: CreateUserRequest): Promise<{ id: ObjectId } | null> {
    userRequest.password = await bcrypt.hash(userRequest.password, saltRounds);
    const response = await collection!.insertOne(userRequest);
    return { id: response.insertedId };
}

export async function findUserByEmailAndPassword(
    email: string,
    password: string,
): Promise<WithId<User> | null> {
    const user = await collection!.findOne({ email });

    if (!user) {
        return null;
    }

    if (!(await bcrypt.compare(password, user.password))) {
        return null;
    }

    return user as WithId<User>;
}