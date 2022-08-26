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

export default function TacksList({ tacks = [] }: { tacks: Array<Piece> }) {
    return (
        <div>
            {tacks.map((tack) => {
                return (
                    <div key={tack.id} className="tack px-4 lg:px-72 py-2 border-b-2 w-full ">
                        <div className="flex items-center">
                            <div className="url w-1/4 text-xl font-medium text-slate-800">
                                {tack.url}
                            </div>
                            <div className="created-at text-sm text-slate-800">
                                {formatDate(tack.created_at)}
                            </div>
                        </div>
                        <div className="">
                            {tack.tags.sort().map((tag, i) => {
                                return (
                                    <div className="inline-block tag mr-4 text-slate-600" key={i}>
                                        {tag}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
