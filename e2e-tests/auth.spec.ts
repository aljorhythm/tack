import { test, expect, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import PageObjectModel from "./page-object-model";

const email = `${Date.now()}${faker.internet.email()}`;
const password = faker.internet.password();
const username = email.split("@")[0].replaceAll(/[\W_]/g, "");

test.describe.serial("auth", async () => {
    let page: Page;
    let pom: PageObjectModel;
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        pom = new PageObjectModel(page);
        await page.goto("/");
    });

    test("should show not logged in message", async () => {
        await page.goto("/");
        await page.waitForSelector(`text=Log in to view your tacks`);

        await expect(await page.locator("nav >> text=Tacks").count()).toEqual(0);
        await expect(await page.locator("nav >> text=Search").count()).toEqual(0);
    });

    test("should show error message on sign up failure", async () => {
        await page.goto("/");
        await page.locator(`nav >> text=Sign Up`).click();
        await page.waitForURL("/signup");

        await page.locator('[placeholder="Username"]').fill(username);
        await page.locator('[placeholder="Email"]').fill("");
        await page.locator('[placeholder="•••••••••"]').fill("");
        await page.locator("main >> text=Sign Up").click();
        expect(await page.locator("main >> .error-message").innerText()).toEqual(
            "password must be at least 8 characters long, contain 1 lowercase, 1 uppercase and 1 digit. invalid email.",
        );
    });

    test("sign up, sign in and see profile page", async () => {
        await page.goto("/");
        await page.locator(`nav >> text=Sign Up`).click();

        await page.waitForURL("/signup");

        await page.locator('[placeholder="Username"]').fill(username);
        await page.locator('[placeholder="Email"]').fill(email);
        await page.locator('[placeholder="•••••••••"]').fill(password);

        await page.locator("main >> text=Sign Up").click();

        await page.waitForNavigation({ url: "/login" });
        await page.locator('[placeholder="Email"]').fill(email);
        await page.locator('[placeholder="•••••••••"]').fill(password);
        await page.locator('button:text("Login")').click();

        await page.waitForNavigation({ url: "/tacks" });

        await page.locator(`nav >> text='${username}'`).click();
        await page.waitForURL(`/profile/${username}`);
        await expect(page.locator(`main :text-is("${email}")`)).toBeVisible();
        await expect(page.locator(`main :text-is("${username}")`)).toBeVisible();

        await page.goto("/");
        await page.waitForSelector(`[placeholder="https://tack.app #app #index"]`);
    });

    test("logout", async () => {
        await page.goto("/");
        expect(await page.locator(`nav >> text=Sign Up`).count()).toBe(0);
        expect(await page.locator(`nav >> text=Login`).count()).toBe(0);
        await pom.logout();
        expect(await page.locator(`nav >> text=Sign Up`).count()).toBe(1);
    });

    test("should fail login with incorrect credentials", async () => {
        await page.goto("/");

        await (await page.waitForSelector("nav >> text=Login")).click();
        await page.waitForURL("/login");
        await page.locator('[placeholder="Email"]').fill(email);
        const wrongPassword = password + "wrong";
        await page.locator('[placeholder="•••••••••"]').fill(wrongPassword);
        await page.locator('button:text("Login")').click();
        await expect(page.locator(`text=Login unsuccessful`)).toBeVisible();
    });

    test("logging in", async () => {
        await pom.login(email, password);
    });
});
