import { NextPage } from "next";
import NotLoggedInUserClass from "../api/notLoggedInUser/notLoggedInUser";
import { findUserById } from "../api/user/persistence";
import { UserType } from "../api/user/types";
import { getFirstParamValue, getTackServerSideProps, TackServerSidePropsContext } from "../request";

type Props = { user: UserType | null };

const Profile: NextPage<Props> = ({ user }: Props) => {
    return (
        <div>
            <div>{user?.username}</div>
        </div>
    );
};

export const getServerSideProps = getTackServerSideProps(
    async (context: TackServerSidePropsContext) => {
        const user = await (async function () {
            const username = getFirstParamValue(context.params, "username");
            if (!username) {
                return null;
            }
            if (context.user) {
                const retrievedUser = await context.user?.getUserByUsername(username);
                return retrievedUser ? retrievedUser.toObject() : null;
            }
            return context.notLoggedInUser?.getUserByUsername(username);
        })();
        return { props: { user } };
    },
    findUserById,
    NotLoggedInUserClass,
);

export default Profile;
