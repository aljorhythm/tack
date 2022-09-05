import fetch from "node-fetch";
import { parse } from "node-html-parser";
import { convert } from "html-to-text";

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

export async function getText(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        const html = await response.text();
        return convert(html, {
            wordwrap: 130,
        });
    } catch {
        return null;
    }
}
const exports = {};
export default exports;
