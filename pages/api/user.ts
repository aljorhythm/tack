import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "./auth/token";
import { CreateUserRequest, createUser, findUserById, User as UserType } from "./auth/users";
import { Piece, createPiece, getPiecesByUserId } from "./pieces/pieces";

export type CreatePiece = {
    url: string;
};
export class User implements UserType {
    _id?: undefined;
    id: string;
    email: string;
    password?: undefined;

    constructor(createFrom: UserType) {
        this.id = createFrom.id;
        this.email = createFrom.email;
    }

    async addPiece(createFrom: CreatePiece): Promise<{ id: string }> {
        const piece: Piece = {
            url: createFrom.url,
            userId: this.id,
        };

        const id = await createPiece(piece);
        if (!id) {
            throw new Error(`failed to create piece from ${createFrom}`);
        }
        return id;
    }

    async getPieces() {
        return await getPiecesByUserId(this.id);
    }

    toObject(): UserType {
        return {
            id: this.id,
            email: this.email,
        };
    }
}

export async function getUserFromToken(token: string): Promise<User> {
    const { id } = await verifyToken(token);
    const dbUser = await findUserById(id);

    if (!dbUser) {
        throw new Error("failed to get user from token");
    }

    return new User(dbUser);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    if (req.method === "POST") {
        const user: CreateUserRequest = req.body as CreateUserRequest;
        const response = await createUser(user);
        res.status(200).json(response);
    } else if (req.method === "GET") {
        const { token: tokens } = req.headers;
        const token = Array.isArray(tokens) ? tokens[0] : tokens;
        if (!token) {
            throw new Error("token cannot be undefined");
        }
        const user = await getUserFromToken(token);
        res.status(200).json(user);
    }
}
