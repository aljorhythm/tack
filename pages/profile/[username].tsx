import { NextPage } from "next";
import { useRouter } from "next/router";
import { FaCopy } from "react-icons/fa";
import TacksList from "../../components/tacks-list";
import Toast, { useToast } from "../../components/toast";
import NotLoggedInUserClass from "../api/notLoggedInUser/notLoggedInUser";
import { Tack } from "../api/tack/types";
import { findUserById } from "../api/user/persistence";
import { type UserType } from "../api/user/types";
import { getFirstParamValue, getTackServerSideProps, TackServerSidePropsContext } from "../request";

type Props = { user: UserType; tacks: Tack[]; key: string | null };

const Profile: NextPage<Props> = ({ user, tacks }: Props) => {
    const [toast, toastOptions] = useToast();
    const router = useRouter();
    async function copyToClipboard() {
        await navigator.clipboard.writeText(
            tacks
                .map((t) => {
                    return `${t.title}\n${t.url}`;
                })
                .join("\n\n"),
        );

        toast("copied to clipboard", 600);
    }

    function tagOnClick(tag: string) {
        router.push({
            pathname: `/profile/${user.username}`,
            query: {
                query: tag,
            },
        });
    }

    return (
        <div className="flex flex-col w-full items-center">
            <div className="flex flex-row flex-wrap w-8/12 lg:w-7/12">
                <div className="w-full">@{user?.username}</div>

                <div className="flex lg:w-2/12 ">
                    <div className="h-fit p-2 hover:cursor-pointer hover:border-b-2 border-slate-500">
                        <FaCopy className="copy-to-clipboard" onClick={copyToClipboard} />
                    </div>
                </div>
                <div className="lg:w-10/12">
                    <TacksList tagOnClick={tagOnClick} tacks={tacks} />
                </div>

                <Toast
                    key={toastOptions.key}
                    milliseconds={toastOptions.milliseconds}
                    message={toastOptions.message}
                />
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
        const props: Props = { user: profileUser, tacks, key: query };
        return { props };
    },
    findUserById,
    NotLoggedInUserClass,
);

export default Profile;
