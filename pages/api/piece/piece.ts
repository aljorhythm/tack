import { CreatePieceFrom } from "../user/types";
import { sanitizeTag } from "./helpers";
import { Piece } from "./types";

export class PieceClass implements Piece {
    url: string;
    userId: string;
    _id?: string | undefined;
    id?: string | undefined;
    tags: Array<String>;

    constructor(createFrom: CreatePieceFrom, userId: string) {
        const parsedElements = createFrom.inputString.split(" ");
        (this.url = parsedElements[0]), (this.tags = parsedElements.slice(1).map(sanitizeTag));
        this.userId = userId;
    }
}
