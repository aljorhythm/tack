import { Tack } from "./api/tack/types";
import { UserClass } from "./api/user/domain";
import { findUserById } from "./api/user/persistence";
import Tacks from "./tacks";
import { getTackServerSideProps, TackServerSidePropsContext } from "./request";

export type Props = {
    isLoggedIn: boolean;
    tacks: Array<Tack>;
};

export default function Index(args: Props) {
    const { isLoggedIn, tacks } = args;
    return (
        <>
            {isLoggedIn ? (
                <Tacks tacks={tacks} />
            ) : (
                <div className="place-self-center">Log in to view your tacks</div>
            )}
        </>
    );
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
