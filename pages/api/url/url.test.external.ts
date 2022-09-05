import { getTitle, getText } from "./url";
import sites from "./sites-data";

describe("getText()", () => {
    let fetch: (url: RequestInfo, init?: RequestInit) => Promise<Response>;

    const { text: expectedText, url } = sites[0];

    it("should get correct text", async () => {
        const actualText: string | null = await getText(url);
        expect(actualText).toStrictEqual(expectedText);
    });

    it("should return null if fetch fails", async () => {
        const actualText = await getText("www.no-exist.com.no-exist");
        expect(actualText).toBeNull();
    });
});

describe("getTitle()", () => {
    it("should get correct title", async () => {
        for (let site of sites) {
            const { url, title: expectedTitle } = site;
            const actualTitle = await getTitle(url);
            expect(actualTitle).toBe(expectedTitle);
        }
    });

    it("should return null if fetch fails", async () => {
        const actualTitle = await getTitle("https://www.no-exist.com.no-exist");
        expect(actualTitle).toBeNull();
    });

    it("should return null if url is does not exist", async () => {
        const actualTitle = await getTitle("https://www.no-exist.com.no-exist");
        expect(actualTitle).toBeNull();
    });

    it("should return title from scheme appended url", async () => {
        const actualTitle = await getTitle("www.google.com");
        expect(actualTitle).toBe("Google");
    });
});

export {};
