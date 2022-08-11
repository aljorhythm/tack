import jwt, { JwtPayload, VerifyCallback, VerifyErrors } from "jsonwebtoken";

const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || "";

export async function generateAccessToken(id: string): Promise<string> {
    if (!AUTH_TOKEN_SECRET) {
        throw new Error("AUTH_TOKEN_SECRET is missing");
    }

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

const exports = { verifyToken, generateAccessToken };
export default exports;
