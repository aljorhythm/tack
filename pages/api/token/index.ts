import type { NextApiRequest, NextApiResponse } from "next";
import { findUserByEmailAndPassword } from "../user/persistence";
import { generateAccessToken } from "./token";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<TokenResponse | null>,
) {
    const { email, password } = req.body;

    const user = await findUserByEmailAndPassword(email, password);

    if (user) {
        res.status(200).json({ token: await generateAccessToken(user.toObject().id) });
    } else {
        res.status(400).json(null);
    }
}
