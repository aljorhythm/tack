import { faker } from "@faker-js/faker";
import { Browser, BrowserContext } from "@playwright/test";
import PageObjectModel from "../e2e-tests/page-object-model";
import { generatePassword } from "./user";

export type ContextDetails = {
    username: string;
    email: string;
    password: string;
    context: BrowserContext;
};

async function newContextSignUpAndLogin(browser: Browser): Promise<ContextDetails> {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/");
    const email = `${Date.now()}${faker.internet.email()}`;
    const username = email.split("@")[0].replaceAll(/[\W_]/g, "");
    const password = generatePassword();

    await (async function signUp() {
        const response = await page.request.post(`/api/user`, {
            data: {
                email,
                password,
                username,
            },
        });
        if (!(await response.ok())) {
            throw "signup failed";
        }
    })();

    await (async function login() {
        const response = await page.request.post(`/api/token`, {
            data: {
                email,
                password,
            },
        });
        if (!(await response.ok())) {
            throw "login failed";
        }
        const body = await response.json();

        await context.addCookies([{ name: "token", value: body.token, url: page.url() }]);
    })();

    return { context, username, email, password };
}

const e2eTestHelper = {
    newContextSignUpAndLogin,
};

export default e2eTestHelper;
