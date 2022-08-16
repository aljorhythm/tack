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
            <div className="flex justify-center px-4">
                <input
                    type="text"
                    id="add-piece-url"
                    className="bg-slate-50 w-96 border border-slate-300 text-slate-900 text-sm rounded focus:ring-slate-500 focus:border-slate-500 block p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                    placeholder="https://tack.app #app #index"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    required
                />

                <button
                    className="px-4 py-1 text-m w-32 font-semibold rounded border border-slate-200 text-white bg-slate-600 hover:bg-slate-500 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2"
                    onClick={search}
                >
                    Add
                </button>
            </div>
            <div>
                {pieces.map((piece) => {
                    return (
                        <div
                            key={piece.id}
                            className="piece px-4 lg:px-72 py-2 border-b-2 w-full  space-x-4"
                        >
                            <div className="text-xl font-medium text-slate-800">{piece.url}</div>
                            <div className="max-w-full">
                                {piece.tags.sort().map((tag, i) => {
                                    return (
                                        <div
                                            className="inline-block tag mr-4 text-slate-600"
                                            key={i}
                                        >
                                            {tag}
                                        </div>
                                    );
                                })}
                            </div>
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
