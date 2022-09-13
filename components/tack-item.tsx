import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { Tack } from "../pages/api/tack/types";
import api from "../pages/api/client";

function formatDate(date: Date): string {
    date = new Date(date);
    const timeString = date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
    const dateString = date.toISOString().split("T")[0].replaceAll("-", "/").slice(2);
    return `${dateString} ${timeString.toLocaleLowerCase()}`;
}

function removeQueryFromUrl(url: string): string {
    try {
        new URL(url);
        return url.split("?")[0];
    } catch {
        return url;
    }
}

export default function TackItem({ tack: tackArg }: { tack: Tack }) {
    const [tack, setTack] = useState<Tack>(tackArg);
    const [isViewing, setViewing] = useState(false);
    const [isViewingUrllToText, setViewingUrlToText] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [urlToText, setUrlToText] = useState<string | null>(null);
    const [editTagsInputValue, setEditTagsInputValue] = useState(
        tack.tags.map((t) => `#${t}`).join(" "),
    );

    const editInput = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        isEditing && editInput.current!.focus();
    }, [isEditing]);

    async function deleteTack() {
        setIsDeleted(true);
        await api.deleteMyTack(tack.id);
    }

    function startEdit() {
        setEditing(true);
    }

    async function save() {
        setEditing(false);
        await api.editMyTack(tack.id, editTagsInputValue);
        const updatedTack = await api.getMyTack(tack.id);
        setTack(updatedTack);
    }

    async function toggleSetViewingUrlToText() {
        setViewingUrlToText(!isViewingUrllToText);

        if (urlToText != undefined) {
            return;
        }

        const text = await api.getTackText(tack.id);
        setUrlToText(text || "");
    }

    return isDeleted ? (
        <></>
    ) : (
        <div className="space-y-2 border-b-2 pb-2">
            <div className="flex flex-wrap">
                <div className="flex space-x-4 items-center">
                    <div className="title text-lg font-medium">{tack.title}</div>
                    <div className="created-at text-slate-800">{formatDate(tack.created_at)}</div>
                    <button
                        className={classNames(
                            "flex",
                            "p-2",
                            "rounded",
                            "items-start",
                            "hover:border-b-2",
                            {
                                "border-b-2": isViewing,
                            },
                        )}
                        onClick={() => setViewing(!isViewing)}
                    >
                        🔍
                    </button>
                    <button
                        className={classNames(
                            "flex",
                            "p-2",
                            "rounded",
                            "items-start",
                            "hover:border-b-2",
                            {
                                "border-b-2": isViewingUrllToText,
                            },
                        )}
                        onClick={toggleSetViewingUrlToText}
                    >
                        📖
                    </button>
                </div>
            </div>
            <div className="flex flex-wrap">
                <a
                    className="url text-sm hover:underline hover:text-slate-600"
                    href={tack.url}
                    target="_blank"
                    rel="noreferrer"
                >
                    {removeQueryFromUrl(tack.url)}
                </a>
            </div>
            <div className="flex flex-wrap">
                {isEditing ? (
                    <input
                        ref={editInput}
                        value={editTagsInputValue}
                        className="edit-input w-7/12 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                        onChange={(e) => {
                            setEditTagsInputValue(e.target.value);
                        }}
                        onKeyDown={(event) => {
                            if (event.code === "Enter" || event.code === "NumpadEnter") {
                                save();
                            }
                        }}
                        required
                    />
                ) : (
                    <div className="tags w-10/12">
                        {tack.tags.sort().map((tag, i) => {
                            return (
                                <div className="inline-block tag mr-4 text-slate-600" key={i}>
                                    {tag}
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className="flex justify-end">
                    {isEditing ? (
                        <button
                            className="btn btn-slate p-2 radius rounded font-bold text-black hover:bg-slate-300 bg-slate-200"
                            onClick={save}
                        >
                            save
                        </button>
                    ) : (
                        <button
                            onClick={startEdit}
                            className="btn btn-slate p-2 radius rounded font-bold text-black hover:bg-slate-200 bg-slate-300"
                        >
                            edit
                        </button>
                    )}

                    <button
                        onClick={deleteTack}
                        className="delete btn btn-slate p-2 radius rounded font-bold text-black hover:bg-slate-200 bg-slate-300"
                    >
                        delete
                    </button>
                </div>
                {isViewing ? (
                    <div className="w-full">
                        <div className=" border-slate-400 border-opacity-25 border-2  my-2"></div>
                        <iframe className="w-full" src={tack.url} />{" "}
                    </div>
                ) : (
                    <></>
                )}

                {isViewingUrllToText ? (
                    <div className="">
                        <div className="border-slate-400 border-opacity-25 border-2 my-2"></div>
                        <div className="w-full url-to-text">{urlToText}</div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
