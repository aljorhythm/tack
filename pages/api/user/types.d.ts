import { ObjectId } from "mongodb";
import { Tack } from "../tack/types";

type UserType = {
    id: string;
    email: string;
};

interface User {
    getTackText(arg0: string): Promise<string | null>;
    getTack(arg0: string): Promise<Tack | null>;
    editTags(tackId: string, tagsString: string): Promise<boolean>;
    addTack(createFrom: CreateTackFrom): Promise<{ id: string }>;
    getTacks: (query?: string) => Promise<Tack[]>;
    toObject: () => UserType;
}

type DbUser = {
    _id?: ObjectId;
    email: string;
    password: string;
};

type CreateTackFrom = {
    inputString: string;
};
