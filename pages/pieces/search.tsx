export {};
import type { NextPage } from "next";
import { useState } from "react";
import { Piece } from "../api/piece/types";
import { UserClass } from "../api/user/domain";
import { findUserById } from "../api/user/persistence";
import { getTackServerSideProps, TackServerSidePropsContext } from "../request";

type Props = { pieces: Array<Piece>; query?: string };

const Search: NextPage<Props> = ({ query, pieces }: Props) => {
    const [searchQuery, setSearchQuery] = useState(query);

    async function search() {}

    return (
        <>
            <input
                type="text"
                id="add-piece-url"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                placeholder="https://tack.app #app #index"
                onChange={(e) => setSearchQuery(e.target.value)}
                required
            />

            <button
                className="px-4 py-1 text-sm text-slate-600 font-semibold rounded-full border border-slate-200 hover:text-white hover:bg-slate-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2"
                onClick={search}
            >
                Add
            </button>
            <div>
                {pieces.map((piece) => {
                    return (
                        <div
                            key={piece.id}
                            className="piece mb-4 p-6 mx-auto bg-white rounded-xl shadow-lg flex space-x-4"
                        >
                            <div className="text-xl font-medium text-black">{piece.url}</div>
                            {piece.tags.map((tag, i) => {
                                return (
                                    <div className="tag text-cyan-700" key={i}>
                                        {tag}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export const getServerSideProps = getTackServerSideProps(
    async (context: TackServerSidePropsContext) => {
        const { query } = context.query;
        const pieces = context.user ? await context.user?.getPieces() : [];
        return { props: { pieces } };
    },
    findUserById,
    UserClass,
);

export default Search;
