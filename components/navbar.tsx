import Link from "next/link";
import { useRouter } from "next/router";

import { type UserType } from "../pages/api/user/types";
import NavbarInput from "./navbar-input";
import useSessionUser from "../pages/useSessionUser";

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
    const [user, isLoggedIn, _, __, logout] = useSessionUser();
    const router = useRouter();

    function goToProfile() {
        router.push({ pathname: `/profile/${user?.username}` });
    }

    return (
        <nav className="py-2 px-10 flex items-center justify-between flex-wrap bg-slate-50">
            <div className="flex items-center text-white">
                <Link href="/">
                    <a className="font-semibold text-xl tracking-tight text-slate-600">Tack</a>
                </Link>
            </div>
            <div className="flex lg:w-7/12 justify-center">
                {isLoggedIn ? <NavbarInput username={user?.username || ""} /> : <></>}
            </div>
            <NavbarRight
                logout={logout}
                goToProfile={goToProfile}
                user={user}
                isLoggedIn={isLoggedIn}
            />
        </nav>
    );
}
