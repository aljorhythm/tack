import { findUserById } from "./api/user/persistence";
import { getTackServerSideProps, TackServerSidePropsContext } from "./request";
import NotLoggedInUserClass from "./api/notLoggedInUser/notLoggedInUser";

export type Props = {
    isLoggedIn: boolean;
};

export default function Index(args: Props) {
    const { isLoggedIn } = args;
    return (
        <>
            {isLoggedIn ? (
                <div className="place-self-center">Welcome!</div>
            ) : (
                <div className="place-self-center">Log in to view your tacks</div>
            )}
        </>
    );
}

export const getServerSideProps = getTackServerSideProps(
    async (context: TackServerSidePropsContext) => {
        const indexProps: Props = { isLoggedIn: !!context.user };
        return { props: indexProps };
    },
    findUserById,
    NotLoggedInUserClass,
);
