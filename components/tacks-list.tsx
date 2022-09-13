import { Tack } from "../pages/api/tack/types";
import TackItem from "./tack-item";

export default function TacksList({
    tacks = [],
    tagOnClick,
}: {
    tacks: Array<Tack>;
    tagOnClick?: (tag: string) => void;
}) {
    return (
        <>
            {tacks.map((tack) => {
                return (
                    <div key={tack.id} className="tack w-full">
                        <TackItem tagOnClick={tagOnClick} tack={tack}></TackItem>
                    </div>
                );
            })}
        </>
    );
}
