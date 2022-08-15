import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";
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

    test("should be able to add piece", async ({ request }) => {
        const url = faker.internet.url();
        const data: CreatePieceFrom = {
            inputString: url,
        };
        const gotCreateResponse = await request.post(`/api/piece`, {
            data,
            headers: { token: token },
        });
        expect(gotCreateResponse.ok()).toBeTruthy();
        const gotCreateResponseBody = await gotCreateResponse.json();
        expect(gotCreateResponseBody).toMatchObject({
            id: expect.any(String),
        });

        const gotGetResponse = await request.get(`/api/piece/pieces`, {
            params: { id: gotCreateResponseBody.id },
            headers: { token: token },
        });

        expect(gotGetResponse.ok()).toBeTruthy();
        const gotPieces: Array<Piece> = await gotGetResponse.json();
        expect(gotPieces[0]).toMatchObject({
            url,
            id: gotCreateResponseBody.id,
        });
    });

    test("should be able to add piece with tags", async ({ request }) => {
        const url = faker.internet.url();
        const data: CreatePieceFrom = {
            inputString: url + " #hello #there!",
        };
        const gotCreateResponse = await request.post(`/api/piece`, {
            data,
            headers: { token: token },
        });
        expect(gotCreateResponse.ok()).toBeTruthy();
        const gotCreateResponseBody = await gotCreateResponse.json();
        expect(gotCreateResponseBody).toMatchObject({
            id: expect.any(String),
        });

        const gotGetResponse = await request.get(`/api/piece/pieces`, {
            params: { id: gotCreateResponseBody.id },
            headers: { token: token },
        });

        expect(gotGetResponse.ok()).toBeTruthy();
        const gotPieces: Array<Piece> = await gotGetResponse.json();
        expect(gotPieces[1]).toMatchObject({
            url,
            id: gotCreateResponseBody.id,
            tags: ["hello", "there!"],
        });
    });
});
