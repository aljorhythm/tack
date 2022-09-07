import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Tack } from "../api/tack/types";
import { UserClass } from "../api/user/domain";
import { findUserById } from "../api/user/persistence";
import { getTackServerSideProps, TackServerSidePropsContext } from "../request";
import TacksList from "../components/tacks-list";
import Link from "next/link";

export type Props = { tacks: Array<Tack>; query?: string; searchPrompts: string[] };

const Search: NextPage<Props> = ({ query, tacks, searchPrompts }: Props) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState(query);

    async function search() {
        router.push({ query: { query: searchQuery } });
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-center px-4">
                <input
                    type="text"
                    id="search-tack-url"
                    value={searchQuery}
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
            <div className="flex justify-center search-prompts space-x-3">
                {searchPrompts.slice(0, 4).map((prompt) => {
                    return (
                        <Link href={`/tacks/search?query=${prompt}`} key={prompt}>
                            <a
                                className="search-prompt hover:text-slate-700 hover:border-slate-500
                         hover:bg-slate-100 p-2 btn rounded bg-white border-slate-400 border-2"
                            >
                                {prompt}
                            </a>
                        </Link>
                    );
                })}
            </div>
            <div className="flex justify-center">
                <div className="px-4 lg:w-10/12">
                    <TacksList tacks={tacks}></TacksList>
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps = getTackServerSideProps(
    async (context: TackServerSidePropsContext) => {
        let query = context.query?.query || "";
        query = Array.isArray(query) ? query.join(" ") : query;
        const [tacks, searchPrompts] = await Promise.all([
            context.user?.getMyTacks(query),
            context.user?.getSearchPrompts(),
        ]);

        return { props: { tacks: tacks, searchPrompts, query, key: query } };
    },
    findUserById,
    UserClass,
);

export default Search;
