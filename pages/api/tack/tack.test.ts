import { CreateTackFrom } from "../user/types";
import { TackClass } from "./tack";
import * as url from "../url/url";

jest.mock("../url/url");

const getTitleMock = url.getTitle as jest.Mock;

describe("construct Tack", () => {
    beforeEach(() => {
        getTitleMock.mockReturnValue(Promise.resolve("Title OF this Web page"));
    });

    afterAll(() => {
        getTitleMock.mockClear();
    });

    const userId = "123";
    test("create from input without tags", async () => {
        const createFrom: CreateTackFrom = {
            inputString: "https://www.google.com",
        };
        const tack: TackClass = await TackClass.create(createFrom, userId);

        expect(tack).toEqual(
            expect.objectContaining({
                url: "https://www.google.com",
                tags: [],
                userId,
                title: "Title OF this Web page",
            }),
        );
    });

    test("create from input with tags", async () => {
        const createFrom: CreateTackFrom = {
            inputString: "https://www.google.com #hello #bye",
        };

        const tack: TackClass = await TackClass.create(createFrom, userId);

        expect(tack).toEqual(
            expect.objectContaining({
                url: "https://www.google.com",
                tags: ["hello", "bye"],
                userId,
                title: "Title OF this Web page",
            }),
        );
    });
});

export {};
