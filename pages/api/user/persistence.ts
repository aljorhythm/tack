import { Collection, Filter, ObjectId, WithId } from "mongodb";
import { connectToDatabase } from "../external/mongodb";

import bcrypt from "bcryptjs";
import log from "../../../log";
import { DbUser, User, UserType } from "./types";
import { UserClass } from "./domain";

let collection: Collection<DbUser> | null;

type CreateUserRequest = {
    email: string;
    password: string;
    username: string;
};

export async function usersCollection(): Promise<Collection<DbUser>> {
    if (collection) {
        return collection;
    }
    const { db } = await connectToDatabase();
    try {
        await db.createCollection<DbUser>("users");
    } catch (e) {
        log("collection 'users' probably exists");
    }
    collection = await db.collection<DbUser>("users");
    return collection;
}

export const saltRounds = await bcrypt.genSalt();

function ConvertDbUserToDomainUser(dbUser: WithId<DbUser>): User {
    return new UserClass({
        id: dbUser._id.toString(),
        email: dbUser.email,
        username: dbUser.username,
    });
}

export async function findUserById(id: string): Promise<null | User> {
    const user = await (await usersCollection()).findOne({ _id: new ObjectId(id) });
    if (user) {
        return ConvertDbUserToDomainUser(user);
    }
    return null;
}

export async function findUserByEmailAndPassword(
    email: string,
    password: string,
): Promise<User | null> {
    const user = await (await usersCollection()).findOne({ email });

    if (!user) {
        return null;
    }

    if (!(await bcrypt.compare(password, user.password))) {
        return null;
    }

    return ConvertDbUserToDomainUser(user);
}

export async function createUser(userRequest: CreateUserRequest): Promise<{ id: string } | null> {
    userRequest.password = await bcrypt.hash(userRequest.password, saltRounds);
    const response = await (await usersCollection()).insertOne(userRequest);
    return { id: response.insertedId.toString() };
}

export async function findUserByUsernameOrEmail(username: string, email: string): Promise<User[]> {
    const response = await (await usersCollection()).find({ email, username });
    const arr = await response.toArray();
    return arr.map(ConvertDbUserToDomainUser);
}

export async function findOne(filter: Filter<DbUser>): Promise<User | null> {
    const found = await (await usersCollection()).findOne(filter);
    return found ? ConvertDbUserToDomainUser(found) : null;
}
