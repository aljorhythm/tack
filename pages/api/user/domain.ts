import { Filter, ObjectId } from "mongodb";
import { sanitizeTag } from "../tack/helpers";
import {
    getTacksByUserId,
    updateTack,
    getTack,
    getMostCommonTagsByUserId,
    groupTagsByUserId,
    deleteTackWithUserId,
} from "../tack/persistence";
import * as persistence from "./persistence";
import { DbTack, Tack } from "../tack/types";
import { getText } from "../url/url";
import { CreateResponse, CreateTackFrom, PopularTag, User, UserType } from "./types";
import validator from "validator";
import { isValidPassword } from "./validation";
import * as tacks from "../tack/tack";

type ConstructUserFrom = UserType;
export class UserClass implements User {
    id: string;
    email: string;
    username: string;

    constructor(createFrom: ConstructUserFrom) {
        this.id = createFrom.id;
        this.email = createFrom.email;
        this.username = createFrom.username;
    }

    async deleteMyTack(tackId: string): Promise<boolean> {
        return (await deleteTackWithUserId(this.id, tackId)) > 0;
    }

    async getTacksByUserId(userId: string, query?: string | null | undefined): Promise<Tack[]> {
        let filter: Filter<DbTack> | undefined;
        if (query === "") {
            return [];
        }
        if (query) {
            filter = { tags: { $all: query.split(" ").map(sanitizeTag) } };
        }
        return await getTacksByUserId(userId, filter);
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return persistence.findOne({ username });
    }

    async getMyPopularTags(): Promise<PopularTag[]> {
        const result = await groupTagsByUserId(this.id);
        return result;
    }

    async getSearchPrompts(): Promise<string[]> {
        return await getMostCommonTagsByUserId(this.id);
    }

    async getTackText(tackId: string) {
        let tack = await getTack({ _id: new ObjectId(tackId) });
        return tack ? getText(tack?.url) : null;
    }

    async getTack(tackId: string): Promise<Tack | null> {
        return await getTack({ userId: new ObjectId(this.id), _id: new ObjectId(tackId) });
    }

    async editTags(tackId: string, tagsString: string) {
        const result = await updateTack(
            { userId: new ObjectId(this.id), _id: new ObjectId(tackId) },
            { $set: { tags: tagsString.split(" ").map(sanitizeTag) } },
        );
        return result > 0;
    }

    async addTack(createFrom: CreateTackFrom): Promise<CreateResponse> {
        const id = await tacks.create(createFrom, this.id);
        if (!id) {
            throw new Error(`failed to create tack from ${createFrom}`);
        }
        return { id };
    }

    async getMyTacks(query?: string | null): Promise<Tack[]> {
        let filter: Filter<DbTack> | undefined;
        if (query === "") {
            return [];
        }
        if (query) {
            filter = { tags: { $all: query.split(" ").map(sanitizeTag) } };
        }
        return await getTacksByUserId(this.id, filter);
    }

    toObject(): UserType {
        return {
            id: this.id,
            email: this.email,
            username: this.username,
        };
    }
}

export type CreateUserRequest = {
    email: string;
    password: string;
    username: string;
};

export async function createUser(userRequest: CreateUserRequest): Promise<{ id: string } | null> {
    const errors: { [key: string]: string } = {};
    if (!userRequest.username || !validator.isAlphanumeric(userRequest.username)) {
        errors["username"] = "username must be non-empty alphanumeric";
    }
    if (!isValidPassword(userRequest.password)) {
        errors["password"] =
            "password must be at least 8 characters long, contain 1 lowercase, 1 uppercase and 1 digit";
    }
    if (!userRequest.email || !validator.isEmail(userRequest.email)) {
        errors["email"] = "invalid email";
    }

    const users: User[] = await persistence.findUserByUsernameOrEmail(
        userRequest.username,
        userRequest.email,
    );
    if (users.length > 0) {
        for (const user of users.map((u) => u.toObject())) {
            if (user.email === userRequest.email) {
                errors["email"] = "email already taken";
            }
            if (user.username === userRequest.username) {
                errors["username"] = "username already taken";
            }
        }
    }

    if (Object.keys(errors).length > 0) {
        throw { ...errors };
    }
    return await persistence.createUser(userRequest);
}
