import { ObjectId } from "mongodb";
import { Piece } from "../tack/types";

type UserType = {
    id: string;
    email: string;
};

interface User {
    addPiece(createFrom: CreatePieceFrom): Promise<{ id: string }>;
    getTacks: (query?: string) => Promise<Piece[]>;
    toObject: () => UserType;
}

type DbUser = {
    _id?: string | undefined | ObjectId;
    email: string;
    password: string;
};

type CreatePieceFrom = {
    inputString: string;
};
