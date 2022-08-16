import { faker } from "@faker-js/faker";
import { test, expect, APIRequestContext } from "@playwright/test";
import { type Piece } from "../pages/api/piece/types";
import { type CreatePieceFrom } from "../pages/api/user/types";
import {
    createPiece,
    createTestPieces,
    daveFarley,
    django,
    java,
    jezHumble,
    nextjs,
    nodejs,
    react,
    springboot,
    TestPiece,
} from "../test-helpers/pieces";

test.describe.serial("pieces", async () => {
    let token: string = "";
    const email = faker.internet.email();
    const password = faker.internet.password();

    test.beforeAll(async ({ request }) => {
        const userData = {
            email,
            password,
        };
        await request.post(`/api/user`, {
            data: userData,
        });
        const response = await (
            await request.post(`/api/token`, {
                data: userData,
            })
        ).json();
        const body = await response;
        token = body.token;
    });

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
        await createTestPieces(request, token);
        const testCases: Array<{ searchInput: string; expected: Array<TestPiece> }> = [
            { searchInput: "doesnotexist", expected: [] },
            { searchInput: "programming", expected: [java, springboot, django] },
            { searchInput: "javascript typescript", expected: [nodejs, nextjs, react] },
            { searchInput: "devops agile continuous-delivery", expected: [daveFarley, jezHumble] },
        ];
        await Promise.all(
            testCases.map(async (testCase) => {
                const { searchInput: query, expected } = testCase;
                const gotQueryResponse = await request.get(`/api/piece/pieces`, {
                    params: { query },
                    headers: { token: token },
                });
                const gotPieces: Array<Piece> = await gotQueryResponse.json();
                expect(
                    gotPieces.map((piece) => {
                        return { url: piece.url, tags: piece.tags };
                    }),
                ).toEqual(expect.arrayContaining(expected));
                expect(gotPieces.length).toEqual(expected.length);
            }),
        );
    });
});
