import { ObjectId } from "mongodb";
import { Tack } from "../tack/types";

export type PopularTag = {
    tag: string;
    count: number;
};

type UserType = {
    id: string;
    email: string;
    username: string;
};

interface User {
    getUserByUsername(username: string | null): Promise<User | null>;
    getMyPopularTags(): Promise<PopularTag[]>;
    getTackText(arg0: string): Promise<string | null>;
    getTack(arg0: string): Promise<Tack | null>;
    editTags(tackId: string, tagsString: string): Promise<boolean>;
    addTack(createFrom: CreateTackFrom): Promise<CreateResponse>;
    getMyTacks: (query?: string) => Promise<Tack[]>;
    getSearchPrompts(): Promise<string[]>;
    toObject: () => UserType;
}

type DbUser = {
    _id?: ObjectId;
    email: string;
    password: string;
    username: string;
};

type CreateTackFrom = {
    inputString: string;
};

type CreateResponse = {
    id: string;
};
