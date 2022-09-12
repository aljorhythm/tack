import { Tack } from "../tack/types";
import { User } from "../user/types";

export interface NotLoggedInUser {
    getTacksByUserId(id: string, query: string | null): Promise<Tack[]>;
    getUserByUsername(username: string): Promise<User | null>;
}
