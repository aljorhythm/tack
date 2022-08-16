import type { GetServerSidePropsContext, NextPage } from "next";
import { UserClass } from "./api/user/domain";
import { findUserById } from "./api/user/persistence";
import { UserType } from "./api/user/types";
import { getUserFromToken, TackApiRequest } from "./request";

type Props = { user: UserType | null };

const Profile: NextPage<Props> = ({ user }: Props) => {
    return <div>{user?.email}</div>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const user = await getUserFromToken(context.req as TackApiRequest, findUserById, UserClass);
    return { props: { user: user?.toObject() } };
}

export default Profile;
