import { findOne } from "../user/persistence";

import { NotLoggedInUser, UserForPublic } from "./types";

class NotLoggedInUserClass implements NotLoggedInUser {
    async getUserByUsername(username: string): Promise<UserForPublic> {
        const dbUser = await findOne({ username });
        return {
            username: dbUser?.toObject().username,
        };
    }
}

export default NotLoggedInUserClass;
