import { faker } from "@faker-js/faker";
import { APIRequestContext } from "@playwright/test";

export async function signUp(request: APIRequestContext): Promise<{
    username: string;
    email: string;
    password: string;
    token: string;
}> {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const username = email.split("@")[0].replaceAll(/[\W_]/g, "");

    const userData = {
        email,
        password,
        username,
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
    return {
        token: body.token || "",
        username,
        email,
        password,
    };
}

export {};
