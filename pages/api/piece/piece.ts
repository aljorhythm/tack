import { CreatePieceFrom } from "../user/types";
import { Piece } from "./types";

export class PieceClass implements Piece {
    url: string;
    userId: string;
    _id?: string | undefined;
    id?: string | undefined;
    tags: Array<String>;

    constructor(createFrom: CreatePieceFrom, userId: string) {
        const parsedElements = createFrom.inputString.split(" ");
        (this.url = parsedElements[0]),
            (this.tags = parsedElements.slice(1).map((rawTag) => {
                const first = [...rawTag].findIndex((char) => char !== "#");
                return rawTag.slice(first);
            }));
        this.userId = userId;
    }
}
