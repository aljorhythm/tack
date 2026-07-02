import jwt, { JwtPayload, VerifyCallback, VerifyErrors } from "jsonwebtoken";

const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || "";

// Tokens used to be non-expiring, which is effectively a permanent credential.
// Give them a bounded lifetime so a leaked token stops working. The default is
// generous (30 days) so existing web sessions are not abruptly invalidated;
// override with AUTH_TOKEN_EXPIRES_IN (any value accepted by jsonwebtoken, e.g.
// "7d", "12h", "3600"). Native clients silently re-login when a token expires.
const AUTH_TOKEN_EXPIRES_IN = process.env.AUTH_TOKEN_EXPIRES_IN || "30d";

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
            { expiresIn: AUTH_TOKEN_EXPIRES_IN },
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
