import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";
import getTestData from "./test-data";

test.describe.serial("sign up, login and post resource", async () => {
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

    let token = null;

    test("should auth user and return token", async ({ request }) => {
        const response = await request.post(`/api/auth/token`, {
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

    test("should fail to auth user", async ({ request }) => {
        const response = await request.post(`/api/auth/token`, {
            data: {
                email: testData.email,
                password: faker.internet.password(),
            },
        });
        expect(response.ok()).not.toBeTruthy();
    });
});
