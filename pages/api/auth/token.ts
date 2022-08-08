import type { NextApiRequest, NextApiResponse } from "next";
import { findUserByEmailAndPassword } from "../auth/users";

type Response = { token: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response | null>) {
    const { email, password } = req.body;

    const user = await findUserByEmailAndPassword(email, password);
    if (user) {
        res.status(200).json({ token: "abcdef" });
    } else {
        res.status(400).json(null);
    }
}
