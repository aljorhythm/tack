import type { NextApiRequest, NextApiResponse } from "next";
import { CreatePiece, getUserFromToken } from "../user";

const handler = async function (req: NextApiRequest, res: NextApiResponse<{ id: string }>) {
    if (req.method === "POST") {
        let { token: tokens } = req.headers;
        if (!tokens) {
            tokens = req.cookies.token;
        }

        const piece = req.body;
        const token = Array.isArray(tokens) ? tokens[0] : tokens;
        if (!token) {
            throw new Error("token cannot be undefined");
        }
        const user = await getUserFromToken(token);
        const result = await user.addPiece(piece as CreatePiece);
        res.send(result);
    }
};

export default handler;
