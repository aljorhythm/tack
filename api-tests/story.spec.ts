import { faker } from "@faker-js/faker";
import { test, expect, Request, APIRequestContext } from "@playwright/test";
import { type Piece } from "../pages/api/piece/types";
import { type CreatePieceFrom } from "../pages/api/user/types";

import getTestData from "./test-data";

test.describe.serial("sign up, login and token issuance", async () => {
    const testData = await getTestData();
    test("should create user", async ({ request }) => {
        const response = await request.post(`/api/user`, {
            data: {
                email: testData.email,
                password: testData.password,
            },
        });
        expect(response.ok()).toBeTruthy();
        expect(Object.keys(await response.json())).toEqual(["id"]);
    });

    let token: string = "";

    test("should auth user and return token", async ({ request }) => {
        const response = await request.post(`/api/token`, {
            data: {
                email: testData.email,
                password: testData.password,
            },
        });
        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body.token).toBeDefined();
        token = body.token;
    });

    test("should get user details with token", async ({ request }) => {
        const response = await request.get(`/api/user`, {
            headers: { token: token },
        });
        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body).toMatchObject({
            email: testData.email,
            id: expect.any(String),
        });
        expect(body.password).not.toBeDefined();
    });

    test("should fail to auth user", async ({ request }) => {
        const response = await request.post(`/api/auth/token`, {
            data: {
                email: testData.email,
                password: faker.internet.password(),
            },
        });
        expect(response.ok()).not.toBeTruthy();
    });

    async function createPiece(request: APIRequestContext, data: CreatePieceFrom) {
        return await request.post(`/api/piece`, {
            data,
            headers: { token: token },
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
        const gotCreateResponse = await createPiece(request, data);
        expect(gotCreateResponse.ok()).toBeTruthy();

        const gotCreateResponseBody: { id: string } = await gotCreateResponse.json();
        assertGotCreateResponseBody(gotCreateResponseBody);

        const gotGetResponse = await request.get(`/api/piece/pieces`, {
            headers: { token: token },
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
        const testData: Array<{ url: string; tags: string[] }> = [
            {
                url: "www.google.com",
                tags: ["search"],
            },
            {
                url: "www.google.com",
                tags: ["search"],
            },
        ];

        const url = faker.internet.url();
        const inputString = url + " #hello #there!";
    });
});
