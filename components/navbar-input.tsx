import { FaSearch, FaPlus } from "react-icons/fa";
import { IconType } from "react-icons";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import api from "../pages/api/client";
import classNames from "classnames";
import { getFirstParamValue } from "../pages/request";

enum NavbarInputMode {
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

export default function NavbarInput({ username }: { username: string }) {
    const [mode, setMode] = useState<NavbarInputMode>(NavbarInputMode.Add);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [inputTextValue, setInputTextValue] = useState<string>("");

    useEffect(() => {
        setInputTextValue(getFirstParamValue(router?.query, "query") || "");
        if (router?.query?.query) {
            setMode(NavbarInputMode.Search);
        }
    }, [router.query]);

    function setModeOnClick(mode: NavbarInputMode) {
        setMode(mode);
        setInputTextValue("");
    }

    async function addTack() {
        const id = await api.addTack(inputTextValue);
        setInputTextValue("");
        if (id) {
            router.push({ pathname: `/profile/${username}` });
        }
    }

    async function search() {
        const query = { query: inputTextValue };
        router.push(
            { pathname: `/profile/[username]`, query: query },
            { pathname: `/profile/${username}`, query: query },
        );
    }

    const modeDetails: { [key in NavbarInputMode]: NavbarModeDetails } = {
        [NavbarInputMode.Add]: {
            icon: FaPlus,
            className: "add-mode",
            btnOnClick: addTack,
            btnText: "add",
            inputPlaceholder: "Tack a url https://...",
        },
        [NavbarInputMode.Search]: {
            icon: FaSearch,
            className: "search-mode",
            btnOnClick: search,
            btnText: "search",
            inputPlaceholder: "Search",
        },
    };

    useEffect(() => {
        inputRef.current!.focus();
    }, [mode]);

    const CurrentIcon = modeDetails[mode].icon;

    return (
        <div className="flex flex-wrap space-x-2 w-full justify-center items-center">
            {Object.entries(modeDetails)
                .filter(([modeKey]) => {
                    return mode !== modeKey;
                })
                .map(([modeKey, details]) => {
                    const Icon = details.icon;
                    return (
                        <Icon
                            key={modeKey}
                            className={classNames("set-mode-icon", details.className)}
                            onClick={() => setModeOnClick(modeKey as NavbarInputMode)}
                        />
                    );
                })}

            <div className="lg:w-8/12 flex rounded items-center py-2 px-2 space-x-2  bg-slate-50  border border-slate-300 text-slate-900 text-sm">
                <CurrentIcon
                    style={{ color: "SlateGray" }}
                    className="border-slate-300 text-slate-900 font-light"
                />
                <input
                    ref={inputRef}
                    value={inputTextValue}
                    onKeyDown={(event) => {
                        if (event.code === "Enter" || event.code === "NumpadEnter") {
                            modeDetails[mode].btnOnClick();
                        }
                    }}
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
