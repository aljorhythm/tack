import fetch from "node-fetch";
import { parse } from "node-html-parser";
import axios, { AxiosError } from "axios";
import { log } from "../../../log";

export async function getTitle(url: string): Promise<string | null> {
    url = url.indexOf("://") === -1 ? "https://" + url : url;
    log("#toremove", "getTitle", url, axios.defaults);
    try {
        const response = await axios({
            method: "get",
            url: url,
        });
        const html = parse(response.data);
        const title = html.querySelector("title");
        return title?.text || null;
    } catch (e) {
        log((e as AxiosError).message);
        return null;
    }
}

export async function getText(url: string): Promise<string | null> {
    url = url.indexOf("://") === -1 ? "https://" + url : url;

    try {
        const response = await fetch(url);
        const html = parse(await response.text());
        const body = html.querySelector("body");
        return body ? body.innerText.trim() : null;
    } catch {
        return null;
    }
}
const exports = {};
export default exports;
