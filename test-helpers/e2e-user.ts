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
    const pom: PageObjectModel = new PageObjectModel(page);
    const email = `${Date.now()}${faker.internet.email()}`;
    const username = email.split("@")[0].replaceAll(/[\W_]/g, "");
    const password = generatePassword();

    await pom.signup(email, password, username);
    await pom.login(email, password);
    await page.close();
    return { context, username, email, password };
}

const e2eTestHelper = {
    newContextSignUpAndLogin,
};

export default e2eTestHelper;
