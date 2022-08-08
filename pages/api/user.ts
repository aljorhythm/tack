import type { NextApiRequest, NextApiResponse } from "next";
import { CreateUserRequest, createUser } from "./auth/users";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    if (req.method === "POST") {
        const user: CreateUserRequest = req.body as CreateUserRequest;
        const response = await createUser(user);
        res.status(200).json(response);
    }
}
