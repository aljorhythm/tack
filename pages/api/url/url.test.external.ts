import { getTitle } from "./url";
import sites from "./sites-data";

describe("getTitle()", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should get correct title", async () => {
        for (let site of sites) {
            const { url, title: expectedTitle } = site;
            const actualTitle = await getTitle(url);
            expect(actualTitle).toBe(expectedTitle);
        }
    });

    it("should return null if fetch fails", async () => {
        jest.mock("node-fetch", () => {
            const fn = jest.fn();
            fn.mockImplementation(() => {
                throw Error();
            });
            return fn;
        });
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
