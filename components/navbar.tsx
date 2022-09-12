import { useCookies } from "react-cookie";

import Link from "next/link";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";
import { type UserType } from "../pages/api/user/types";
import * as api from "../pages/api/client";
import { FaSearch, FaPlus } from "react-icons/fa";
import { IconType } from "react-icons";

enum NavbarMode {
    Search = "search",
    Add = "add",
}

type NavbarModeDetails = {
    className: string;
    icon: IconType;
    btnOnClick: Function;
    btnText: string;
    inputPlaceholder: string;
};

function NavbarInput({ username }: { username: string }) {
    const [mode, setMode] = useState<NavbarMode>(NavbarMode.Add);
    const [inputTextValue, setInputTextValue] = useState("");
    const router = useRouter();

    async function addTack() {
        const id = await api.addTack(inputTextValue);
        if (id) {
            router.push({ pathname: `/profile/${username}` });
        }
    }

    async function search() {
        router.push({ pathname: `/profile/${username}`, query: { query: inputTextValue } });
    }

    const modeDetails: { [key in NavbarMode]: NavbarModeDetails } = {
        [NavbarMode.Add]: {
            icon: FaPlus,
            className: "add-mode",
            btnOnClick: addTack,
            btnText: "add",
            inputPlaceholder: "Add a tack https://...",
        },
        [NavbarMode.Search]: {
            icon: FaSearch,
            className: "search-mode",
            btnOnClick: search,
            btnText: "search",
            inputPlaceholder: "Search",
        },
    };

    const CurrentIcon = modeDetails[mode].icon;

    return (
        <div className="flex flex-wrap space-x-2 items-center hover:cursor-pointer">
            {Object.entries(modeDetails)
                .filter(([modeKey]) => {
                    return mode !== modeKey;
                })
                .map(([modeKey, details]) => {
                    const Icon = details.icon;
                    return (
                        <Icon
                            key={modeKey}
                            className={details.className}
                            onClick={() => setMode(modeKey as NavbarMode)}
                        />
                    );
                })}

            <div
                className="flex rounded items-center py-2 px-2 space-x-2
                    lg:w-96
                    bg-slate-50  border border-slate-300 text-slate-900 text-sm"
            >
                <CurrentIcon
                    style={{ color: "SlateGray" }}
                    className="border-slate-300 text-slate-900 font-light"
                />
                <input
                    className="flex-grow bg-slate-50 focus:outline-none border-none"
                    placeholder={modeDetails[mode].inputPlaceholder}
                    onChange={(e) => setInputTextValue(e.target.value)}
                />
            </div>

            <button
                className="px-4 py-1 text-m w-32 font-semibold rounded border border-slate-200 text-white bg-slate-600 hover:bg-slate-500 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2"
                onClick={() => modeDetails[mode].btnOnClick()}
            >
                {modeDetails[mode].btnText}
            </button>
        </div>
    );
}

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
        setIsLoggedIn(!!cookies["token"]);
        (async () => {
            if (!user && cookies.token) {
                const me = await api.getMe();
                setUser(me);
            }
        })();
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
                <span className="font-semibold text-xl tracking-tight text-slate-600">Tack</span>
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
