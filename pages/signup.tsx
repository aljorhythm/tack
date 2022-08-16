import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const Signup: NextPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    async function signUp() {
        await fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
        router.push("/login");
    }

    return (
        <>
            <div>
                <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                    Email
                </label>
                <input
                    type="text"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="mb-6">
                <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                    placeholder="•••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <button
                className="px-4 py-1 text-sm text-slate-600 font-semibold rounded-full border border-slate-200 hover:text-white hover:bg-slate-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2"
                onClick={signUp}
            >
                Sign Up
            </button>
        </>
    );
};

export default Signup;
