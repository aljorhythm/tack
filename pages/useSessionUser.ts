import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import api, { getMe } from "./api/client";
import { UserType } from "./api/user/types";

export default function useSessionUser(): [
    user: UserType | null,
    isLoggedIn: boolean,
    login: (username: string, password: string) => Promise<void>,
    loginErrorMessage: string | null,
    logout: () => Promise<void>,
] {
    const [user, setUser] = useState<null | UserType>(null);
    const [cookies, setCookie, removeCookies] = useCookies(["token"]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            setIsLoggedIn(!!cookies["token"]);
            if (cookies["token"]) {
                const storedUser = localStorage.getItem("sessionUser");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    const retrievedUser = await getMe();
                    localStorage.setItem("sessionUser", JSON.stringify(retrievedUser));
                    setUser(retrievedUser);
                }
            } else {
                localStorage.removeItem("sessionUser");
                setUser(null);
            }
        })();
    }, [cookies]);

    async function logout() {
        removeCookies("token");
        router.reload();
    }

    async function login(email: string, password: string) {
        try {
            const token = await api.login(email, password);
            setLoginErrorMessage(null);
            setCookie("token", token);
            router.push("/");
        } catch {
            setLoginErrorMessage("Login unsuccessful");
        }
    }

    return [user, isLoggedIn, login, loginErrorMessage, logout];
}
