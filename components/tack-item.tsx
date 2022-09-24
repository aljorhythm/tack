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

function presentUrl(url: string): string {
    try {
        new URL(url);
        return url.split("?")[0];
    } catch {
        return url;
    }
}

export default function TackItem({
    tack: tackArg,
    tagOnClick,
}: {
    tack: Tack;
    tagOnClick?: (tag: string) => void;
}) {
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

    const actionButtonClassNames = classNames(
        "p-2 bg-slate-400/40 hover:bg-slate-400/80 text-center text-xs w-12 h-12 rounded-full",
    );

    return isDeleted ? (
        <></>
    ) : (
        <div className="space-y-2 border-b-2 pb-2">
            <div className="flex justify-between items-center">
                <div className="title text-lg font-medium">{tack.title}</div>
                <div className="flex items-center flex-row flex-wrap flex-grow justify-end">
                    <div className="created-at text-slate-800 text-sm">
                        {formatDate(tack.created_at)}
                    </div>
                    <button
                        className={classNames("flex", "p-2", "hover:border-b-2", {
                            "border-b-2": isViewing,
                        })}
                        onClick={() => setViewing(!isViewing)}
                    >
                        🔍
                    </button>
                    <button
                        className={classNames("flex", "p-2", "hover:border-b-2", {
                            "border-b-2": isViewingUrllToText,
                        })}
                        onClick={toggleSetViewingUrlToText}
                    >
                        📖
                    </button>
                    {isEditing ? (
                        <></>
                    ) : (
                        <button onClick={startEdit} className={actionButtonClassNames}>
                            edit tags
                        </button>
                    )}
                    <button onClick={deleteTack} className={actionButtonClassNames}>
                        delete
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
                    {presentUrl(tack.url)}
                </a>
            </div>
            <div className="flex flex-wrap justify-between">
                {isEditing ? (
                    <>
                        <input
                            ref={editInput}
                            value={editTagsInputValue}
                            className="edit-input rounded w-10/12 border-4 border-slate-300 focus:outline-none p-1 text-slate-900"
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
                        <button className={actionButtonClassNames} onClick={save}>
                            save
                        </button>
                    </>
                ) : (
                    <div className="tags w-10/12 flex flex-wrap">
                        {tack.tags.sort().map((tag, i) => {
                            return (
                                <div
                                    onClick={() => tagOnClick && tagOnClick(tag)}
                                    className="tag mr-2 text-slate-800 rounded-3xl bg-slate-300/40 hover:bg-slate-300/80 hover:cursor-pointer text-sm p-2 h-fit"
                                    key={i}
                                >
                                    {tag}
                                </div>
                            );
                        })}
                    </div>
                )}
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
