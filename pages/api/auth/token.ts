import type { NextApiRequest, NextApiResponse } from "next";
import { findUserByEmailAndPassword } from "../auth/users";
import jwt, { Jwt, JwtPayload, VerifyCallback, VerifyErrors } from "jsonwebtoken";

const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || "";

if (!AUTH_TOKEN_SECRET) {
    throw new Error("AUTH_TOKEN_SECRET is missing");
}

async function generateAccessToken(id: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(
            {
                id,
            },
            AUTH_TOKEN_SECRET,
            (err: Error | null, token: string | undefined) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(token || "");
            },
        );
    });
}

type Response = { token: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response | null>) {
    const { email, password } = req.body;

    const user = await findUserByEmailAndPassword(email, password);
    if (user) {
        res.status(200).json({ token: await generateAccessToken(user._id.toString()) });
    } else {
        res.status(400).json(null);
    }
}

export async function verifyToken(token: string) {
    return new Promise<JwtPayload>((resolve, reject) => {
        const callback: VerifyCallback<JwtPayload | string> = (
            err: VerifyErrors | null,
            decoded: JwtPayload | string | undefined,
        ) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(<JwtPayload>decoded);
        };
        jwt.verify(token, AUTH_TOKEN_SECRET, callback);
    });
}
