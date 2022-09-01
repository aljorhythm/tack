import { useCookies } from "react-cookie";

import Link from "next/link";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    const [cookies, _, removeCookies] = useCookies(["token"]);

    useEffect(() => {
        setIsLoggedIn(!!cookies["token"]);
    }, [isLoggedIn, cookies]);

    function logout() {
        removeCookies("token");
        router.push("/login");
    }

    return (
        <nav className="py-2 px-10 flex items-center justify-between flex-wrap bg-slate-50">
            <div className="flex items-center flex-shrink-0 text-white mr-10">
                <span className="font-semibold text-xl tracking-tight text-slate-600">Tack</span>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
                    {isLoggedIn ? (
                        <>
                            <Link href="/tacks">
                                <a className="block mt-4 lg:inline-block lg:mt-0 text-stale-200 hover:text-slate-400 mr-5">
                                    Tacks
                                </a>
                            </Link>
                            <Link href="/tacks/search">
                                <a className="block mt-4 lg:inline-block lg:mt-0 text-stale-200 hover:text-slate-400 mr-5">
                                    Search
                                </a>
                            </Link>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            <div className="w-full block flex-grow lg:flex lg:justify-end lg:w-auto">
                <div className="text-sm">
                    {isLoggedIn ? (
                        <>
                            <a
                                onClick={logout}
                                className="hover:cursor-pointer block mt-4 lg:inline-block lg:mt-0 text-stale-200 hover:text-slate-400 mr-5"
                            >
                                Logout
                            </a>
                        </>
                    ) : (
                        <>
                            {" "}
                            <Link href="/login">
                                <a className="block mt-4 lg:inline-block lg:mt-0 text-stale-200 hover:text-slate-400 mr-5">
                                    Login
                                </a>
                            </Link>
                            <Link href="/signup">
                                <a className="block mt-4 lg:inline-block lg:mt-0 text-stale-200 hover:text-slate-400 mr-5">
                                    Sign Up
                                </a>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
