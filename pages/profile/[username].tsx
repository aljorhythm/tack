import { NextPage } from "next";
import TacksList from "../../components/tacks-list";
import NotLoggedInUserClass from "../api/notLoggedInUser/notLoggedInUser";
import { Tack } from "../api/tack/types";
import { findUserById } from "../api/user/persistence";
import { type UserType } from "../api/user/types";
import { getFirstParamValue, getTackServerSideProps, TackServerSidePropsContext } from "../request";

type Props = { user: UserType; tacks: Tack[] };

const Profile: NextPage<Props> = ({ user, tacks }: Props) => {
    return (
        <div className="flex flex-col">
            <div className="flex justify-center">
                <div className="px-4 w-screen lg:w-10/12">@{user?.username}</div>
            </div>
            <div className="flex justify-center">
                <div className="px-4 w-screen lg:w-10/12">
                    <TacksList tacks={tacks} />
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps = getTackServerSideProps(
    async (context: TackServerSidePropsContext) => {
        const username = getFirstParamValue(context.params, "username");

        const profileUser: UserType = await (async function (): Promise<UserType> {
            if (!username) {
                throw "username not specified";
            }
            if (context.user) {
                const retrievedUser = await context.user?.getUserByUsername(username);
                if (!retrievedUser) {
                    throw { user_not_found: username };
                }
                return retrievedUser.toObject();
            }
            const retrievedUser = await context.notLoggedInUser?.getUserByUsername(username);
            if (!retrievedUser) {
                throw { user_not_found: username };
            }
            return retrievedUser.toObject();
        })();

        const query = getFirstParamValue(context.query, "query");

        const tacks = await (async function (): Promise<Tack[]> {
            if (!username) {
                throw "username not specified";
            }
            if (context.user) {
                return await context.user.getTacksByUserId(profileUser.id, query);
            }
            return context.notLoggedInUser!.getTacksByUserId(profileUser.id, query);
        })();
        const props: Props = { user: profileUser, tacks };
        return { props };
    },
    findUserById,
    NotLoggedInUserClass,
);

export default Profile;
