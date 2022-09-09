import { test, expect, Page } from "@playwright/test";
import PageObjectModel from "./page-object-model";
import { signUp } from "../test-helpers/e2e-user";

test.describe.serial("profile", async () => {
    let page: Page;
    let pom: PageObjectModel;
    let username: string;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        pom = new PageObjectModel(page);
        const userInfo = await signUp(pom);
        username = userInfo.username;
    });

    test("should show profile page elements", async () => {
        await page.goto(`/profile/${username}`);
        await expect(page.locator(`main :text-is("${username}")`)).toBeVisible();
    });

    test("should show profile page elements from public view", async ({ browser }) => {
        const anotherContext = await browser.newContext();
        const anotherPage = await anotherContext.newPage();
        await anotherPage.goto(`/profile/${username}`);
        await expect(anotherPage.locator(`main :text-is("${username}")`)).toBeVisible();
        await anotherPage.close();
        await anotherContext.close();
    });
});
