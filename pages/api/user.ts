import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "./auth/token";
import { CreateUserRequest, createUser, findUserById } from "./auth/users";

async function getUserFromToken(token: string) {
    const { id } = await verifyToken(token);
    return await findUserById(id);
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
