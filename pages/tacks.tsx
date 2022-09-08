import type { NextPage } from "next";
import Router from "next/router";
import { useState } from "react";
import { Tack } from "./api/tack/types";
import { findUserById } from "./api/user/persistence";
import { CreateTackFrom } from "./api/user/types";
import { getTackServerSideProps, TackServerSidePropsContext } from "./request";
import TacksList from "./components/tacks-list";

type Props = { tacks: Array<Tack> };

const Tacks: NextPage<Props> = ({ tacks }: Props) => {
    const [addTackUrl, setAddTackUrl] = useState("");
    async function addTack() {
        const createTackFrom: CreateTackFrom = {
            inputString: addTackUrl,
        };
        const response = await fetch("/api/tack", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(createTackFrom),
        });

        const { id } = await response.json();
        if (id) {
            Router.reload();
        }
    }

    return (
        <>
            <div className="flex justify-center px-4">
                <input
                    id="add-tack-url"
                    className="bg-slate-50 lg:w-96 border border-slate-300 text-slate-900 text-sm rounded focus:ring-slate-500 focus:border-slate-500 block p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                    placeholder="https://tack.app #app #index"
                    onChange={(e) => setAddTackUrl(e.target.value)}
                    required
                />

                <button
                    className="px-4 py-1 text-m w-32 font-semibold rounded border border-slate-200 text-white bg-slate-600 hover:bg-slate-500 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2"
                    onClick={addTack}
                >
                    tack
                </button>
            </div>
            <div className="flex justify-center">
                <div className="px-4 w-screen lg:w-10/12">
                    <TacksList tacks={tacks}></TacksList>
                </div>
            </div>
        </>
    );
};

export const getServerSideProps = getTackServerSideProps(
    async (context: TackServerSidePropsContext) => {
        const tacks = await context.user?.getMyTacks();
        return { props: { tacks } };
    },
    findUserById,
);

export default Tacks;
