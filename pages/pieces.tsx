import type { GetServerSidePropsContext, NextPage } from "next";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { User } from "./api/auth/users";
import { getUserFromToken } from "./api/user";

type Props = { user: User };

const Pieces: NextPage<Props> = ({ user }: Props) => {
    const [addPieceUrl, setAddPieceUrl] = useState("");
    function addPiece() {}

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                    URL:
                </label>
                <input
                    type="text"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="http://wwww.example.com/"
                    onChange={(e) => setAddPieceUrl(e.target.value)}
                    required
                />

                <button
                    className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
                    onClick={addPiece}
                >
                    Add
                </button>
            </main>
        </div>
    );
};

// This gets called on every request
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token: tokens } = context.req.cookies;
    const token = Array.isArray(tokens) ? tokens[0] : tokens;
    if (!token) {
        throw new Error("token cannot be undefined");
    }
    const user = await getUserFromToken(token);
    return { props: { user } };
}

export default Pieces;
