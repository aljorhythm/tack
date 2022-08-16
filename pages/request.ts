import {
    GetServerSideProps,
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse,
} from "next";
import { Middleware } from "next-connect";
import { verifyToken } from "./api/token/token";
import { User, UserType } from "./api/user/types";
import nc from "next-connect";

type UserConstructor = new (createFrom: UserType) => User;

export type TackApiRequest = NextApiRequest & {
    user?: User | null;
};

type FindUserById = (id: string) => Promise<UserType | null>;

export async function getUserFromToken(
    req: TackApiRequest,
    findUserById: FindUserById,
    userConstructor: UserConstructor,
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

    return new userConstructor(dbUser);
}

const attachUserToRequest = function (
    findUserById: FindUserById,
    userConstructor: UserConstructor,
): Middleware<TackApiRequest, NextApiResponse> {
    const fn: Middleware<TackApiRequest, NextApiResponse> = async (
        req: TackApiRequest,
        _: NextApiResponse,
        next: Function,
    ) => {
        req.user = await getUserFromToken(req, findUserById, userConstructor);
        next();
    };
    return fn;
};

export default attachUserToRequest;

export type TackServerSidePropsContext = GetServerSidePropsContext & {
    user?: User | null;
};

export const getTackServerSideProps = function (
    getServerSideProps: GetServerSideProps,
    findUserById: FindUserById,
    userConstructor: UserConstructor,
): GetServerSideProps {
    const wrapped: GetServerSideProps = async function (context: TackServerSidePropsContext) {
        const user = await getUserFromToken(
            context.req as TackApiRequest,
            findUserById,
            userConstructor,
        );
        context.user = user;
        return getServerSideProps(context);
    };
    return wrapped;
};

export function tackNextConnect(findUserById: FindUserById, userConstructor: UserConstructor) {
    return nc<TackApiRequest, NextApiResponse>({
        onError: (err, req, res, next) => {
            console.error(err.stack);
            res.status(500).end("Something broke!");
        },
        onNoMatch: (req, res) => {
            res.status(404).end("Page is not found");
        },
    }).use(attachUserToRequest(findUserById, userConstructor));
}
