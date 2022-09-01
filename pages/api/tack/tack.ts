import { getTitle } from "../url/url";
import { CreatePieceFrom } from "../user/types";
import { sanitizeTag } from "./helpers";
import { Piece } from "./types";

export class PieceClass implements Piece {
    url: string;
    userId: string;
    _id?: string | undefined;
    id?: string | undefined;
    tags: Array<String>;
    created_at: Date;
    title: string | null;

    static async create(createFrom: CreatePieceFrom, userId: string): Promise<PieceClass> {
        const parsedElements = createFrom.inputString.split(" ");
        const url = parsedElements[0];
        const tags = parsedElements.slice(1).map(sanitizeTag);

        const title = await getTitle(url);

        return new PieceClass(url, userId, title, tags);
    }

    constructor(url: string, userId: string, title: string | null, tags: Array<string>) {
        this.url = url;
        this.userId = userId;
        this.title = title;
        this.tags = tags;
        this.created_at = new Date();
    }
}
