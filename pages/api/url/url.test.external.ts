import { getTitle } from "./url";
import sites from "./sites-data";

describe("getTitle()", () => {
    it("should get correct title", async () => {
        for (let site of sites) {
            const { url, title: expectedTitle } = site;
            const actualTitle = await getTitle(url);
            expect(actualTitle).toBe(expectedTitle);
        }
    });
});

export {};
