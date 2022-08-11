import type { GetServerSidePropsContext, GetStaticPropsContext, NextPage } from "next";
import styles from "../styles/Home.module.css";
import { User } from "./api/auth/users";
import { getUserFromToken } from "./api/user";

type Props = { user: User };

const Profile: NextPage<Props> = ({ user }: Props) => {
    return (
        <div className={styles.container}>
            <main className={styles.main}>{user.email}</main>
        </div>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token: tokens } = context.req.cookies;
    const token = Array.isArray(tokens) ? tokens[0] : tokens;
    if (!token) {
        throw new Error("token cannot be undefined");
    }
    const user = await getUserFromToken(token);
    return { props: { user: user.toObject() } };
}

export default Profile;
