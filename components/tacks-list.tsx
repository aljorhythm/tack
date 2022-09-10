import { Tack } from "../pages/api/tack/types";
import TackItem from "./tack-item";

export default function TacksList({ tacks = [] }: { tacks: Array<Tack> }) {
    return (
        <div>
            {tacks.map((tack) => {
                return (
                    <div key={tack.id} className="tack py-2 border-b-2 w-full">
                        <TackItem tack={tack}></TackItem>
                    </div>
                );
            })}
        </div>
    );
}
