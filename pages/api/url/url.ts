import fetch from "node-fetch";
import { parse } from "node-html-parser";

export async function getTitle(url: string) {
    const response = await fetch(url);
    const html = parse(await response.text());
    const title = html.querySelector("title");
    return title?.text;
}
const exports = {};
export default exports;
