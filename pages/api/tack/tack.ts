import { getTitle } from "../url/url";
import { CreateTackFrom } from "../user/types";
import { sanitizeTag } from "./helpers";
import { Tack } from "./types";

export class TackClass implements Tack {
    url: string;
    userId: string;
    _id?: string | undefined;
    id?: string | undefined;
    tags: Array<String>;
    created_at: Date;
    title: string | null;

    static async create(createFrom: CreateTackFrom, userId: string): Promise<TackClass> {
        const parsedElements = createFrom.inputString.split(" ");
        const url = parsedElements[0];
        const tags = parsedElements.slice(1).map(sanitizeTag);

        const title = await getTitle(url);

        return new TackClass(url, userId, title, tags);
    }

    constructor(url: string, userId: string, title: string | null, tags: Array<string>) {
        this.url = url;
        this.userId = userId;
        this.title = title;
        this.tags = tags;
        this.created_at = new Date();
    }
}
