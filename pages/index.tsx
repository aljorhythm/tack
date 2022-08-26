import { Piece } from "./api/tack/types";
import { UserClass } from "./api/user/domain";
import { findUserById } from "./api/user/persistence";
import Tacks from "./tacks";
import { getTackServerSideProps, TackServerSidePropsContext } from "./request";

export type Props = {
    isLoggedIn: boolean;
    tacks: Array<Piece>;
};

export default function Index(args: Props) {
    const { isLoggedIn, tacks } = args;
    return <>{isLoggedIn ? <Tacks tacks={tacks} /> : <>Log in to view your tacks</>}</>;
}

export const getServerSideProps = getTackServerSideProps(
    async (context: TackServerSidePropsContext) => {
        const tacks = await context.user?.getTacks();
        const indexProps: Props = { tacks: tacks || [], isLoggedIn: !!context.user };
        return { props: indexProps };
    },
    findUserById,
    UserClass,
);
