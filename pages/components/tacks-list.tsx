import { useState } from "react";
import { Tack } from "../api/tack/types";

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

function TackItem({ tack: tackArg }: { tack: Tack }) {
    const [tack, setTack] = useState(tackArg);
    const [isEditing, setEditing] = useState(false);
    const [editTagsInputValue, setEditTagsInputValue] = useState(
        tack.tags.map((t) => `#${t}`).join(" "),
    );

    function startEdit() {
        setEditing(true);
    }

    function save() {
        (async function () {
            await fetch(`/api/user/tack/${tack.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tagsString: editTagsInputValue,
                }),
            });

            const response = await fetch(`/api/user/tack/${tack.id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const updatedTack = await response.json();
            setTack(updatedTack);
        })();
        setEditing(false);
    }

    return (
        <>
            <div className="flex items-top">
                <div className="w-2/4 text-xl  text-slate-800">
                    <div className="title font-medium">{tack.title}</div>
                    <div className="url text-sm">{tack.url}</div>
                </div>
                <div className="created-at text-sm text-slate-800">
                    {formatDate(tack.created_at)}
                </div>
            </div>
            <div className="flex items-top">
                {isEditing ? (
                    <input
                        value={editTagsInputValue}
                        className="edit-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500"
                        onChange={(e) => setEditTagsInputValue(e.target.value)}
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
                            className="btn btn-slate p-2 radius rounded text-white bg-slate-700"
                            onClick={save}
                        >
                            save
                        </button>
                    ) : (
                        <button
                            onClick={startEdit}
                            className="btn btn-slate p-2 radius rounded text-white bg-slate-400"
                        >
                            edit
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default function TacksList({ tacks = [] }: { tacks: Array<Tack> }) {
    return (
        <div>
            {tacks.map((tack) => {
                return (
                    <div key={tack.id} className="tack px-4 lg:px-72 py-2 border-b-2 w-full ">
                        <TackItem tack={tack}></TackItem>
                    </div>
                );
            })}
        </div>
    );
}
