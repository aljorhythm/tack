import { test, expect, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { createTestPieces } from "../test-helpers/pieces";

const email = `${Date.now()}${faker.internet.email()}`;
const password = faker.internet.password();

class PageObjectModel {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async logout() {
        const page = this.page;
        await page.locator(`nav >> text=Logout`).click();
    }

    async login(email: string, password: string) {
        const page = this.page;
        await page.locator(`nav >> text=Login`).click();
        await page.waitForURL("/login");
        await page.locator("#email").fill(email);
        await page.locator("#password").fill(password);
        await page.locator('button:text("Login")').click();
        expect(await page.waitForSelector(`nav >> text=Logout`));
        expect(await page.locator(`nav >> text=Sign Up`).count()).toBe(0);
        expect(await page.locator(`nav >> text=Login`).count()).toBe(0);
    }
}

test.describe.serial("story", async () => {
    let page: Page;
    let pom: PageObjectModel;
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        pom = new PageObjectModel(page);
        await page.goto("/");
    });

    test("register and sign in", async () => {
        await page.goto("/");
        await page.locator(`nav >> text=Sign Up`).click();

        await page.waitForURL("/signup");

        await page.locator('[placeholder="Email"]').fill(email);
        await page.locator('[placeholder="•••••••••"]').fill(password);

        await page.locator("main >> text=Sign Up").click();

        await page.waitForNavigation({ url: "/login" });
        await page.locator('[placeholder="Email"]').fill(email);
        await page.locator('[placeholder="•••••••••"]').fill(password);
        await page.locator('button:text("Login")').click();

        await page.waitForNavigation({ url: "/pieces" });

        await page.goto("/profile");
        await page.waitForURL("/profile");
        await expect(page.locator(`text=${email}`)).toBeVisible();
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

    test("should be able to insert piece and see added piece", async () => {
        await page.goto("/");

        await page.locator("text=Pieces").click();
        await page.waitForURL("/pieces");

        const url = faker.internet.url();
        const inputString = `${url} #hello #there`;
        await page.locator(`[placeholder="https://tack.app #app #index"]`).fill(inputString);
        await page.locator('button:text("tack")').click();
        await page.waitForNavigation();

        const textElement = await page.locator(`.piece :has-text("${url}")`);
        await expect(textElement).toBeVisible();

        const tagsElements = await (
            await page.locator(`.piece :has-text("${url}") ~ * .tag`)
        ).elementHandles();
        await expect(tagsElements.length).toBe(2);
    });

    test("should be able to search pieces", async () => {
        const testPieces = await createTestPieces(page.request, undefined);
        await page.goto("/");

        await page.locator('nav :text("Search")').click();
        await page.waitForURL("/pieces/search");

        // const tagsElements = await (
        //     await page.locator(`.piece :text("${url}") ~ .tag`)
        // ).elementHandles();
        // await expect(tagsElements.length).toBe(2);
    });
});
