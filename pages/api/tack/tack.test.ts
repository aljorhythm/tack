import { CreateTackFrom } from "../user/types";
import * as url from "../url/url";
import { createForDb } from "./domain";
import { ObjectId } from "mongodb";

jest.mock("../url/url");

const getTitleMock = url.getTitle as jest.Mock;

describe("create Tack", () => {
    beforeEach(() => {
        getTitleMock.mockReturnValue(Promise.resolve("Title OF this Web page"));
    });

    afterAll(() => {
        getTitleMock.mockClear();
    });

    const userId: string = new ObjectId().toString();

    test("create from input without tags", async () => {
        const createFrom: CreateTackFrom = {
            inputString: "https://www.google.com",
        };
        const tack = await createForDb(createFrom, userId);

        expect(tack).toEqual(
            expect.objectContaining({
                url: "https://www.google.com",
                tags: [],
                userId: new ObjectId(userId),
                title: "Title OF this Web page",
            }),
        );
    });

    test("create from input with tags", async () => {
        const createFrom: CreateTackFrom = {
            inputString: "https://www.google.com #hello #bye",
        };

        const tack = await createForDb(createFrom, userId);
        expect(tack).toEqual(
            expect.objectContaining({
                url: "https://www.google.com",
                tags: ["hello", "bye"],
                userId: new ObjectId(userId),
                title: "Title OF this Web page",
            }),
        );
    });
});

export {};
