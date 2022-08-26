import { CreatePieceFrom } from "../user/types";
import { PieceClass } from "./tack";

describe("construct Piece", () => {
    const userId = "123";
    test("create from input without tags", () => {
        const createFrom: CreatePieceFrom = {
            inputString: "https://www.google.com",
        };
        const tack: PieceClass = new PieceClass(createFrom, userId);

        expect(tack).toEqual(
            expect.objectContaining({
                url: "https://www.google.com",
                tags: [],
                userId,
            }),
        );
    });

    test("create from input with tags", () => {
        const createFrom: CreatePieceFrom = {
            inputString: "https://www.google.com #hello #bye",
        };
        const tack: PieceClass = new PieceClass(createFrom, userId);

        expect(tack).toEqual(
            expect.objectContaining({
                url: "https://www.google.com",
                tags: ["hello", "bye"],
                userId,
            }),
        );
    });
});

export {};
