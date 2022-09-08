import { Filter, ObjectId } from "mongodb";
import { sanitizeTag } from "../tack/helpers";
import {
    convertDomainTackToDbTack,
    createTack,
    getTacksByUserId,
    updateTack,
    getTack,
    getMostCommonTagsByUserId,
    groupTagsByUserId,
} from "../tack/persistence";
import { TackClass } from "../tack/tack";
import { DbTack, Tack } from "../tack/types";
import { getText } from "../url/url";
import { CreateTackFrom, PopularTag, User, UserType } from "./types";

type ConstructUserFrom = UserType;
export class UserClass implements User {
    id: string;
    email: string;

    constructor(createFrom: ConstructUserFrom) {
        this.id = createFrom.id;
        this.email = createFrom.email;
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

    async addTack(createFrom: CreateTackFrom): Promise<{ id: string }> {
        const tack: Tack = await TackClass.create(createFrom, this.id);

        const id = await createTack(convertDomainTackToDbTack(tack));
        if (!id) {
            throw new Error(`failed to create tack from ${createFrom}`);
        }
        return id;
    }

    async getMyTacks(query?: string): Promise<Tack[]> {
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
        };
    }
}
