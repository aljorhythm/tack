import type { GetServerSidePropsContext, GetStaticPropsContext, NextPage } from "next";
import styles from "../styles/Home.module.css";
import { User } from "./api/auth/users";

type Props = { user: User };

const Profile: NextPage<Props> = ({ user }: Props) => {
    return (
        <div className={styles.container}>
            <main className={styles.main}>{user.email}</main>
        </div>
    );
};

// This gets called on every request
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const user: User = {
        email: "abcd",
    };
    return { props: { user } };
}

export default Profile;
