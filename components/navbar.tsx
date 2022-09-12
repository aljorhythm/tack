import { useCookies } from "react-cookie";

import Link from "next/link";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { type UserType } from "../pages/api/user/types";
import * as api from "../pages/api/client";
import NavbarInput from "./navbar-input";

function NavbarRight({
    isLoggedIn,
    user,
    logout,
    goToProfile,
}: {
    logout: Function;
    goToProfile: Function;
    isLoggedIn: boolean;
    user?: UserType | null;
}) {
    return (
        <div className="flex-wrap">
            {isLoggedIn ? (
                <>
                    {user ? (
                        <a
                            onClick={() => goToProfile()}
                            className="hover:cursor-pointer block mt-4 lg:inline-block lg:mt-0 text-stale-200 hover:text-slate-400 mr-5"
                        >
                            {user?.username}
                        </a>
                    ) : (
                        <></>
                    )}
                    <a
                        onClick={() => logout()}
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
    );
}

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<null | UserType>(null);
    const router = useRouter();

    const [cookies, _, removeCookies] = useCookies(["token"]);

    useEffect(() => {
        const isLoggedIn = !!cookies["token"];
        setIsLoggedIn(!!cookies["token"]);
        isLoggedIn &&
            typeof window !== "undefined" &&
            setUser(JSON.parse(localStorage.getItem("user") || "null"));
    }, [isLoggedIn, cookies, user]);

    function logout() {
        removeCookies("token");
        router.push("/login");
    }

    function goToProfile() {
        router.push(`/profile/${user?.username}`);
    }

    return (
        <nav className="py-2 px-10 flex items-center justify-between flex-wrap bg-slate-50">
            <div className="flex items-center text-white">
                <Link href="/">
                    <a className="font-semibold text-xl tracking-tight text-slate-600">Tack</a>
                </Link>
            </div>
            {isLoggedIn ? <NavbarInput username={user?.username || ""} /> : <></>}
            <NavbarRight
                logout={logout}
                goToProfile={goToProfile}
                user={user}
                isLoggedIn={isLoggedIn}
            />
        </nav>
    );
}
