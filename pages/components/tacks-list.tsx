import { useState } from "react";
import { Piece } from "../api/tack/types";

function formatDate(date: Date): string {
    const timeString = date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
    const dateString = date.toISOString().split("T")[0].replaceAll("-", "/").slice(2);
    return `${dateString} ${timeString.toLocaleLowerCase()}`;
}

function Tack({ tack }: { tack: Piece }) {
    const [isEditing, setEditing] = useState(false);
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
                    <></>
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
                    <button
                        onClick={() => setEditing(true)}
                        className="btn btn-slate p-2 radius rounded text-white bg-slate-400"
                    >
                        edit
                    </button>
                </div>
            </div>
        </>
    );
}

export default function TacksList({ tacks = [] }: { tacks: Array<Piece> }) {
    return (
        <div>
            {tacks.map((tack) => {
                return (
                    <div key={tack.id} className="tack px-4 lg:px-72 py-2 border-b-2 w-full ">
                        <Tack tack={tack}></Tack>
                    </div>
                );
            })}
        </div>
    );
}
