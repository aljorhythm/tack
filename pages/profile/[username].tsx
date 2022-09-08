import { NextPage } from "next";
import { findUserById } from "../api/user/persistence";
import { UserType } from "../api/user/types";
import { getTackServerSideProps, TackServerSidePropsContext } from "../request";

type Props = { user: UserType | null };

const Profile: NextPage<Props> = ({ user }: Props) => {
    return (
        <div>
            <div>{user?.email}</div>
            <div>{user?.username}</div>
        </div>
    );
};

export const getServerSideProps = getTackServerSideProps(
    async (context: TackServerSidePropsContext) => {
        return { props: { user: context.user?.toObject() } };
    },
    findUserById,
);

export default Profile;
