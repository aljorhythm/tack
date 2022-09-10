import { ObjectId } from "mongodb";
import { getTitle } from "../url/url";
import { CreateTackFrom } from "../user/types";
import { sanitizeTag } from "./helpers";
import { DbTack } from "./types";

export async function createForDb(createFrom: CreateTackFrom, userId: string): Promise<DbTack> {
    const parsedElements = createFrom.inputString.split(" ");
    const url = parsedElements[0];
    const tags = parsedElements.slice(1).map(sanitizeTag);
    const title = await getTitle(url);
    const created_at = new Date();

    return {
        url,
        tags,
        title,
        created_at,
        userId: new ObjectId(userId),
    };
}
