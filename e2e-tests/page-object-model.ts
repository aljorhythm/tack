import { expect, Page } from "@playwright/test";

export default class PageObjectModel {
    page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async signup(email: string, password: string) {
        const page = this.page;

        await page.goto("/");
        await page.locator(`nav >> text=Sign Up`).click();

        await page.waitForURL("/signup");

        await page.locator('[placeholder="Email"]').fill(email);
        await page.locator('[placeholder="•••••••••"]').fill(password);

        await page.locator("main >> text=Sign Up").click();
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
