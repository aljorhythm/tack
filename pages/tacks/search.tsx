export {};
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Piece } from "../api/tack/types";
import { UserClass } from "../api/user/domain";
import { findUserById } from "../api/user/persistence";
import { getTackServerSideProps, TackServerSidePropsContext } from "../request";
import TacksList from "../components/tacks-list";

export type Props = { tacks: Array<Piece>; query?: string };

const Search: NextPage<Props> = ({ query, tacks }: Props) => {
    const [searchQuery, setSearchQuery] = useState(query);
    const router = useRouter();

    async function search() {
        router.push("slices", { query: { query: searchQuery } });
    }

    return (
        <>
            <div className="flex justify-center px-4">
                <input
                    type="text"
                    id="add-tack-url"
                    className="bg-slate-50 lg:w-96 border border-slate-300 text-slate-900 text-sm rounded focus:ring-slate-500 focus:border-slate-500 block p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                    placeholder="#photography #singapore"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    required
                />

                <button
                    className="px-4 py-1 text-m w-32 font-semibold rounded border border-slate-200 text-white bg-slate-600 hover:bg-slate-500 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2"
                    onClick={search}
                >
                    search
                </button>
            </div>
            <TacksList tacks={tacks}></TacksList>
        </>
    );
};

export const getServerSideProps = getTackServerSideProps(
    async (context: TackServerSidePropsContext) => {
        let query = context.query?.query || "";
        query = Array.isArray(query) ? query.join(" ") : query;
        const tacks = await context.user?.getTacks(query);
        return { props: { tacks: tacks } };
    },
    findUserById,
    UserClass,
);

export default Search;
