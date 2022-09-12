import { Filter } from "mongodb";
import { sanitizeTag } from "../tack/helpers";
import { getTacksByUserId } from "../tack/persistence";
import { DbTack, Tack } from "../tack/types";
import { findOne } from "../user/persistence";
import { User } from "../user/types";

import { NotLoggedInUser } from "./types";

class NotLoggedInUserClass implements NotLoggedInUser {
    async getTacksByUserId(userId: string, query: string | null): Promise<Tack[]> {
        let filter: Filter<DbTack> | undefined;
        if (query === "") {
            return [];
        }
        if (query) {
            filter = { tags: { $all: query.split(" ").map(sanitizeTag) } }; // todo refactor into helper queryStringToFilter
        }
        return await getTacksByUserId(userId, filter);
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return await findOne({ username });
    }
}

export default NotLoggedInUserClass;
