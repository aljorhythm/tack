import { ObjectId } from "mongodb";
import { Tack } from "../tack/types";

type UserType = {
    id: string;
    email: string;
};

interface User {
    getTack(arg0: string): Promise<Tack | null>;
    editTags(tackId: string, tagsString: string): Promise<boolean>;
    addTack(createFrom: CreateTackFrom): Promise<{ id: string }>;
    getTacks: (query?: string) => Promise<Tack[]>;
    toObject: () => UserType;
}

type DbUser = {
    _id?: string | undefined | ObjectId;
    email: string;
    password: string;
};

type CreateTackFrom = {
    inputString: string;
};
