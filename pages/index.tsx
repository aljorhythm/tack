import { Piece } from "./api/piece/types";
import { UserClass } from "./api/user/domain";
import { findUserById } from "./api/user/persistence";
import Pieces from "./pieces";
import { getTackServerSideProps, TackServerSidePropsContext } from "./request";

export type Props = {
    isLoggedIn: boolean;
    pieces: Array<Piece>;
};

export default function Index(args: Props) {
    const { isLoggedIn, pieces } = args;
    return <>{isLoggedIn ? <Pieces pieces={pieces} /> : <>Log in to view your pieces</>}</>;
}

export const getServerSideProps = getTackServerSideProps(
    async (context: TackServerSidePropsContext) => {
        const pieces = await context.user?.getPieces();
        const indexProps: Props = { pieces: pieces || [], isLoggedIn: !!context.user };
        return { props: indexProps };
    },
    findUserById,
    UserClass,
);
