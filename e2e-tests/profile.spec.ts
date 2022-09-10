import { test, expect, Page, BrowserContext } from "@playwright/test";
import PageObjectModel from "./page-object-model";
import { signUp } from "../test-helpers/e2e-user";

test.describe("profile", async () => {
    let username: string;
    let context: BrowserContext;
    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        const page = await browser.newPage();
        const pom = new PageObjectModel(page);
        const userInfo = await signUp(pom);
        username = userInfo.username;
    });

    test("should show profile page elements", async () => {
        const page = await context.newPage();

        await page.goto(`/profile/${username}`);
        await expect(page.locator(`main :text-is("${username}")`)).toBeVisible();
    });

    test("should show profile page elements from public view", async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(`/profile/${username}`);
        await expect(page.locator(`main :text-is("${username}")`)).toBeVisible();
    });
});
