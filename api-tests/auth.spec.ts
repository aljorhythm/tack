import { faker } from "@faker-js/faker";
import { test, expect } from "@playwright/test";
import { type SignUpResponse } from "../pages/api/user/types";
import { generatePassword } from "../test-helpers/user";

let email = `${Date.now().toString()}${faker.internet.email()}`;
let password = generatePassword();
let username = email.split("@")[0].replaceAll(/[\W_]/g, "");

test.describe.serial("sign up, login and token issuance", async () => {
    test("should fail to create user with invalid fields", async ({ request }) => {
        const response = await request.post(`/api/user`, {
            data: {},
        });
        expect(response.status()).toEqual(400);
        expect(await response.json()).toEqual({
            errors: {
                username: "username must be non-empty alphanumeric",
                password:
                    "password must be at least 8 characters long, contain 1 lowercase, 1 uppercase and 1 digit",
                email: "invalid email",
            },
        });
    });

    test("should create user with valid fields", async ({ request }) => {
        const response = await request.post(`/api/user`, {
            data: {
                email: email,
                password: password,
                username,
            },
        });

        expect(response.ok()).toBeTruthy();
        const data: SignUpResponse = await response.json();
        expect(data.id).toBeTruthy();
        expect(data.errors).toEqual({});
    });

    test("should fail to create user with taken username/e-mail", async ({ request }) => {
        const response = await request.post(`/api/user`, {
            data: {
                email: email,
                password: password,
                username,
            },
        });

        expect(response.ok()).not.toBeTruthy();
        expect(await response.json()).toEqual({
            errors: {
                username: "username already taken",
                email: "email already taken",
            },
        });
    });

    let token: string = "";

    test("should auth user and return token", async ({ request }) => {
        const response = await request.post(`/api/token`, {
            data: {
                email: email,
                password: password,
            },
        });
        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body.token).toBeDefined();
        token = body.token;
    });

    test("should get user details with token", async ({ request }) => {
        await Promise.all(
            Array.from({ length: 100 }).map(async () => {
                const response = await request.get(`/api/user`, {
                    headers: { token: token },
                });
                expect(response.ok()).toBeTruthy();
                const body = await response.json();
                expect(body).toMatchObject({
                    email: email,
                    id: expect.any(String),
                });
                expect(body.password).not.toBeDefined();
            }),
        );
    });

    test("should fail to auth non-existing user", async ({ request }) => {
        const response = await request.post(`/api/auth/token`, {
            data: {
                email: `${email}.net`,
                password: generatePassword(),
            },
        });
        expect(response.ok()).not.toBeTruthy();
    });
});
