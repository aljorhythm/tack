import { NextApiRequest, NextApiResponse } from "next";
import { Middleware } from "next-connect";
import { verifyToken } from "./api/token/token";
import { User, UserType } from "./api/user/types";

export type TackApiRequest = NextApiRequest & {
    user?: User | null;
};

export async function getUserFromToken(
    req: TackApiRequest,
    findUserById: (id: string) => Promise<UserType | null>,
    UserClass: new (createFrom: UserType) => User,
): Promise<User | null> {
    let tokens: string | string[] | null | undefined = req.headers.token;
    if (!tokens) {
        tokens = req.cookies.token;
    }

    const token = Array.isArray(tokens) ? tokens[0] : tokens;

    if (!token) {
        return null;
    }
    const { id } = await verifyToken(token);
    const dbUser = await findUserById(id);

    if (!dbUser) {
        return null;
    }

    return new UserClass(dbUser);
}

const attachUserToRequest = function (
    findUserById: (id: string) => Promise<UserType | null>,
    UserClass: new (createFrom: UserType) => User,
): Middleware<TackApiRequest, NextApiResponse> {
    const fn: Middleware<TackApiRequest, NextApiResponse> = async (
        req: TackApiRequest,
        _: NextApiResponse,
        next: Function,
    ) => {
        req.user = await getUserFromToken(req, findUserById, UserClass);

        next();
    };
    return fn;
};

export default attachUserToRequest;
