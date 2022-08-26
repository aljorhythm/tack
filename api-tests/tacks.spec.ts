import { faker } from "@faker-js/faker";
import { test, expect, APIRequestContext } from "@playwright/test";
import { type Piece } from "../pages/api/tack/types";
import { type CreatePieceFrom } from "../pages/api/user/types";
import {
    createPiece,
    createTestTacks,
    daveFarley,
    django,
    java,
    jezHumble,
    nextjs,
    nodejs,
    react,
    springboot,
    TestPiece,
} from "../test-helpers/tacks";

test.describe.serial("tacks", async () => {
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
        assertGotTacksResponseBody: (body: Array<Piece>, id: string) => void,
        token: string,
    ) {
        const data: CreatePieceFrom = {
            inputString,
        };
        const gotCreateResponse = await createPiece(request, data, token);
        expect(gotCreateResponse.ok()).toBeTruthy();

        const gotCreateResponseBody: { id: string } = await gotCreateResponse.json();
        assertGotCreateResponseBody(gotCreateResponseBody);

        const gotGetResponse = await request.get(`/api/tack/tacks`, {
            headers: { token },
        });
        expect(gotGetResponse.ok()).toBeTruthy();
        const gotTacks: Array<Piece> = await gotGetResponse.json();
        assertGotTacksResponseBody(gotTacks, gotCreateResponseBody.id);
    }

    test("should be able to add tack", async ({ request }) => {
        const url = faker.internet.url();
        await addPieceHelper(
            request,
            url,
            (gotCreateResponseBody) => {
                expect(gotCreateResponseBody).toMatchObject({
                    id: expect.any(String),
                });
            },
            (gotTacks, createdId) => {
                expect(gotTacks[0]).toMatchObject({
                    url,
                    id: createdId,
                    tags: [],
                });
            },
            token,
        );
    });

    test("should be able to add tack with tags", async ({ request }) => {
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
            (gotTacks, createdId) => {
                expect(gotTacks[0]).toMatchObject({
                    url,
                    id: createdId,
                    tags: ["hello", "there!"],
                });
            },
            token,
        );
    });

    test("should be able to search tack with tags", async ({ request }) => {
        await createTestTacks(request, token);
        const testCases: Array<{ searchInput: string; expected: Array<TestPiece> }> = [
            { searchInput: "doesnotexist", expected: [] },
            { searchInput: "programming", expected: [java, springboot, django] },
            { searchInput: "javascript typescript", expected: [nodejs, nextjs, react] },
            { searchInput: "javascript #typescript", expected: [nodejs, nextjs, react] },
            { searchInput: "devops agile continuous-delivery", expected: [daveFarley, jezHumble] },
            { searchInput: "devops agile #continuous-delivery", expected: [daveFarley, jezHumble] },
        ];
        await Promise.all(
            testCases.map(async (testCase) => {
                const { searchInput: query, expected } = testCase;
                const gotQueryResponse = await request.get(`/api/tack/tacks`, {
                    params: { query },
                    headers: { token: token },
                });
                const gotTacks: Array<Piece> = await gotQueryResponse.json();
                expect(
                    gotTacks.map((tack) => {
                        return { url: tack.url, tags: tack.tags };
                    }),
                ).toEqual(expect.arrayContaining(expected));
                expect(gotTacks.length).toEqual(expected.length);
            }),
        );
    });
});
