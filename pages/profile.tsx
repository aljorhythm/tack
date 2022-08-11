import type { GetServerSidePropsContext, GetStaticPropsContext, NextPage } from "next";
import styles from "../styles/Home.module.css";
import { UserClass } from "./api/user/domain";
import { findUserById } from "./api/user/persistence";
import { UserType } from "./api/user/types";
import { getUserFromToken, TackApiRequest } from "./request";

type Props = { user: UserType | null };

const Profile: NextPage<Props> = ({ user }: Props) => {
    return (
        <div className={styles.container}>
            <main className={styles.main}>{user?.email}</main>
        </div>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const user = await getUserFromToken(context.req as TackApiRequest, findUserById, UserClass);
    return { props: { user: user?.toObject() } };
}

export default Profile;
