import type { NextPage } from "next";
import Router from "next/router";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { Piece } from "./api/piece/types";
import { UserClass } from "./api/user/domain";
import { findUserById } from "./api/user/persistence";
import { CreatePieceFrom } from "./api/user/types";
import { getTackServerSideProps, TackServerSidePropsContext } from "./request";

type Props = { pieces: Array<Piece> };

const Pieces: NextPage<Props> = ({ pieces }: Props) => {
    const [addPieceUrl, setAddPieceUrl] = useState("");
    async function addPiece() {
        const createPieceFrom: CreatePieceFrom = {
            inputString: addPieceUrl,
        };
        const response = await fetch("/api/piece", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(createPieceFrom),
        });

        try {
            const { id } = await response.json();
            if (id) {
                Router.reload();
            }
        } catch (e) {}
    }

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <label
                    htmlFor="add-piece-url"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                    URL:
                </label>
                <input
                    type="text"
                    id="add-piece-url"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="What caught your eye?"
                    onChange={(e) => setAddPieceUrl(e.target.value)}
                    required
                />

                <button
                    className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
                    onClick={addPiece}
                >
                    Add
                </button>
                <div>
                    {pieces.map((piece) => {
                        return (
                            <div key={piece.id} className="piece">
                                <span>{piece.url}</span>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export const getServerSideProps = getTackServerSideProps(
    async (context: TackServerSidePropsContext) => {
        const pieces = await context.user?.getPieces();
        return { props: { pieces } };
    },
    findUserById,
    UserClass,
);

export default Pieces;
