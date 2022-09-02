import fetch from "node-fetch";
import { parse } from "node-html-parser";

export async function getTitle(url: string): Promise<string | null> {
    url = url.indexOf("://") === -1 ? "https://" + url : url;
    try {
        const response = await fetch(url);
        const html = parse(await response.text());
        const title = html.querySelector("title");
        return title?.text || null;
    } catch {
        return null;
    }
}
const exports = {};
export default exports;
