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
    onTrigger: Function;
    btnText: string;
    inputPlaceholder: string;
    loadingText?: string;
};

export default function NavbarInput({ username }: { username: string }) {
    const [mode, setMode] = useState<NavbarInputMode>(NavbarInputMode.Add);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [inputTextValue, setInputTextValue] = useState<string>("");
    const [loadingText, setLoadingText] = useState<string | undefined | null>(null);

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
            onTrigger: addTack,
            btnText: "add",
            inputPlaceholder: "Tack a url https://...",
            loadingText: "adding...",
        },
        [NavbarInputMode.Search]: {
            icon: FaSearch,
            className: "search-mode",
            onTrigger: search,
            btnText: "search",
            inputPlaceholder: "Search",
        },
    };

    useEffect(() => {
        inputRef.current!.focus();
    }, [mode]);

    async function triggerAction(modeDetails: NavbarModeDetails): Promise<void> {
        if (modeDetails.loadingText) {
            setLoadingText(modeDetails.loadingText);
        }
        try {
            await modeDetails.onTrigger();
        } catch {}
        setLoadingText(null);
        setInputTextValue("");
    }

    const CurrentIcon = modeDetails[mode].icon;

    return loadingText ? (
        <>{loadingText}</>
    ) : (
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
                            className={classNames(
                                "set-mode-icon hover:text-lg hover:cursor-pointer",
                                details.className,
                            )}
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
                            triggerAction(modeDetails[mode]);
                        }
                    }}
                    className="flex-grow bg-slate-50 focus:outline-none border-none"
                    placeholder={modeDetails[mode].inputPlaceholder}
                    onChange={(e) => setInputTextValue(e.target.value)}
                />
            </div>

            <button
                className="px-4 py-1 text-m w-32 font-semibold rounded border border-slate-200 text-white bg-slate-600 hover:bg-slate-500 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2"
                onClick={() => triggerAction(modeDetails[mode])}
            >
                {modeDetails[mode].btnText}
            </button>
        </div>
    );
}
