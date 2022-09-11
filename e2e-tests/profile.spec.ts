import { test, expect, Page, BrowserContext } from "@playwright/test";
import e2eTestHelper from "../test-helpers/e2e-user";

test.describe("profile", async () => {
    let username: string;
    let context: BrowserContext;

    test.beforeAll(async ({ browser }) => {
        const details = await e2eTestHelper.newContextSignUpAndLogin(browser);
        username = details.username;
        context = details.context;
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
