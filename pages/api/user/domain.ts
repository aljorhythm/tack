import { Filter } from "mongodb";
import { sanitizeTag } from "../tack/helpers";
import { createTack, getTacksByUserId } from "../tack/persistence";
import { TackClass } from "../tack/tack";
import { Tack } from "../tack/types";
import { CreateTackFrom, User, UserType } from "./types";

type ConstructUserFrom = UserType;
export class UserClass implements User {
    id: string;
    email: string;

    constructor(createFrom: ConstructUserFrom) {
        this.id = createFrom.id;
        this.email = createFrom.email;
    }

    async addTack(createFrom: CreateTackFrom): Promise<{ id: string }> {
        const tack: Tack = await TackClass.create(createFrom, this.id);

        const id = await createTack(tack);
        if (!id) {
            throw new Error(`failed to create tack from ${createFrom}`);
        }
        return id;
    }

    async getTacks(query?: string): Promise<Tack[]> {
        let filter: Filter<Tack> | undefined;
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
