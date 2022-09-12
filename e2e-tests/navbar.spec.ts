import { test, expect, BrowserContext } from "@playwright/test";
import e2eTestHelper from "../test-helpers/e2e-user";
import sites from "../pages/api/url/sites-data";
import { faker } from "@faker-js/faker";
const site = sites[0];

test.describe("navbar", async () => {
    let context: BrowserContext;
    let username: string;

    test.beforeAll(async ({ browser }) => {
        const details = await e2eTestHelper.newContextSignUpAndLogin(browser);
        context = details.context;
        username = details.username;
    });

    test("should not show input in navbar when not logged in", async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto("/");
        await expect(page.locator("nav >> input")).not.toBeVisible();
    });

    test("should show input when logged in", async () => {
        const page = await context.newPage();
        await page.goto("/");
        await expect(page.locator("nav >> input")).toBeVisible();
    });

    test("should go to profile page with added tack on add tack", async () => {
        const page = await context.newPage();
        await page.goto("/");

        const { url, title } = site;
        const inputString = `${url} #hello #there`;

        await page.locator("nav >> [placeholder='Add a tack https://...']").fill(inputString);
        await page.locator('nav >> button:text("add")').click();

        await page.waitForURL(`/profile/${username}`);

        await page.waitForSelector(`.tack:has-text("${url}")`);
        const tack = await page.locator(`.tack:has-text("${url}")`);
        await expect(tack).toBeVisible();

        const tagElements = await (await tack.locator(`.tag`)).elementHandles();
        await expect(tagElements.length).toBe(2);

        const titleElement = await tack.locator(`.title`);
        expect(await titleElement.textContent()).toBe(title);

        const createdAtElement = await tack.locator(`.created-at`);
        await expect((await createdAtElement.allInnerTexts())[0]).toMatch(
            /^[0-9][0-9]\/[0-1][0-9]\/[0-3][0-9] [0-9]?[0-9]:[0-9]?[0-9] (am|pm)$/,
        );
    });

    test("should go to profile page with query on search", async () => {
        const page = await context.newPage();
        await page.goto("/");

        const inputString = `#hello #there`;

        await page.locator("nav >> .search-mode").click();
        await page.locator("nav >> [placeholder='Search']").fill(inputString);
        await page.locator('nav >> button:text("search")').click();

        await page.waitForURL(`/profile/${username}?query=%23hello+%23there`);
    });

    test("should go to home when press on logo", async () => {
        const page = await context.newPage();
        await page.goto(`/${faker.random.word()}`);
        await page.locator('nav >> :text("Tack")').click();
        await page.waitForURL(`/`);
    });
});

export {};
