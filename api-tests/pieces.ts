import { faker } from "@faker-js/faker";
import { test, expect, APIRequestContext } from "@playwright/test";
import { type Piece } from "../pages/api/piece/types";
import { type CreatePieceFrom } from "../pages/api/user/types";

test.describe("pieces", async () => {
    let token: string = "";
    const email = faker.internet.email();
    const password = faker.internet.password();

    test.beforeAll(async ({ request }) => {
        const response = await request.post(`/api/token`, {
            data: {
                email,
                password,
            },
        });
        const body = await response.json();
        token = body.token;
    });

    async function createPiece(request: APIRequestContext, data: CreatePieceFrom, token: string) {
        return await request.post(`/api/piece`, {
            data,
            headers: { token },
        });
    }

    async function addPieceHelper(
        request: APIRequestContext,
        inputString: string,
        assertGotCreateResponseBody: (body: { id: string }) => void,
        assertGotPiecesResponseBody: (body: Array<Piece>, id: string) => void,
        token: string,
    ) {
        const data: CreatePieceFrom = {
            inputString,
        };
        const gotCreateResponse = await createPiece(request, data, token);
        expect(gotCreateResponse.ok()).toBeTruthy();

        const gotCreateResponseBody: { id: string } = await gotCreateResponse.json();
        assertGotCreateResponseBody(gotCreateResponseBody);

        const gotGetResponse = await request.get(`/api/piece/pieces`, {
            headers: { token },
        });
        expect(gotGetResponse.ok()).toBeTruthy();
        const gotPieces: Array<Piece> = await gotGetResponse.json();
        assertGotPiecesResponseBody(gotPieces, gotCreateResponseBody.id);
    }

    test("should be able to add piece", async ({ request }) => {
        const url = faker.internet.url();
        await addPieceHelper(
            request,
            url,
            (gotCreateResponseBody) => {
                expect(gotCreateResponseBody).toMatchObject({
                    id: expect.any(String),
                });
            },
            (gotPieces, createdId) => {
                expect(gotPieces[0]).toMatchObject({
                    url,
                    id: createdId,
                    tags: [],
                });
            },
            token,
        );
    });

    test("should be able to add piece with tags", async ({ request }) => {
        const url = faker.internet.url();
        const inputString = url + " #hello #there!";

        await addPieceHelper(
            request,
            inputString,
            (gotCreateResponseBody) => {
                expect(gotCreateResponseBody).toMatchObject({
                    id: expect.any(String),
                });
            },
            (gotPieces, createdId) => {
                expect(gotPieces[0]).toMatchObject({
                    url,
                    id: createdId,
                    tags: ["hello", "there!"],
                });
            },
            token,
        );
    });

    test("should be able to search piece with tags", async ({ request }) => {
        type Tack = { url: string; tags: string[] };
        const google = {
            url: "www.google.com",
            tags: ["search"],
        };
        const java = {
            url: "www.java.com",
            tags: ["programming"],
        };
        const springboot = {
            url: "www.springboot.com",
            tags: ["programming", "java", "framework"],
        };
        const nextjs = {
            url: "nextjs.com",
            tags: ["javascript", "typescript", "framework", "frontend", "backend", "serverless"],
        };
        const react = {
            url: "react.com",
            tags: ["javascript", "typescript", "frontend"],
        };
        const allenHolub = {
            url: "allenholub.com",
            tags: ["agile", "c++"],
        };
        const daveFarley = {
            url: "davefarley.com",
            tags: ["agile", "devops", "continuous-delivery", "continuous-integration"],
        };

        const tacksData: Array<Tack> = [
            google,
            java,
            springboot,
            nextjs,
            react,
            allenHolub,
            daveFarley,
        ];
        for (let tack of tacksData) {
            await createPiece(
                request,
                {
                    inputString: `${tack.url} ${tack.tags.reduce((a, _, tag) => {
                        return a + tag;
                    }, "")}`,
                },
                token,
            );
        }
        const testCases: Array<{ searchInput: string; expected: Array<Tack> }> = [
            { searchInput: "doesnotexist", expected: [] },
        ];

        //  await    Promise.all(
        //             testCases.map(async (testCase) => {
        //                 const { searchInput: query, expected } = testCase;
        //                 const gotQueryResponse = await request.get(`/api/piece/pieces`, {
        //                     params: { query },
        //                     headers: { token: token },
        //                 });
        //                 const queryResult = await gotQueryResponse.json();
        //                 expect(queryResult).toEqual(expect.arrayContaining(expected));
        //                 expect(queryResult.length).toEqual(expected.length);
        //             }),
        //         );
    });
});
