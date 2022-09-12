import { test, expect, BrowserContext } from "@playwright/test";
import e2eTestHelper from "../test-helpers/e2e-user";
import sites from "../pages/api/url/sites-data";
import { createTack } from "../test-helpers/tacks";
import retry from "async-retry";
const site = sites[0];

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

    test("should be able to edit tack", async () => {
        const page = await context.newPage();
        await createTack(context.request, { inputString: `${site.url} #hello #there` });
        await page.goto("/tacks");

        const { url } = site;
        const tack = await page.locator(`.tack:has-text("${url}")`);

        let tagsContainer = await tack.locator(".tags");
        expect(await tagsContainer.count()).toBe(1);

        let editButton = await tack.locator('button:text-is("edit")');
        await editButton.click();

        tagsContainer = await tack.locator(".tags");
        expect(await tagsContainer.count()).toBe(0);

        const editInput = await tack.locator(".edit-input");
        expect(await editInput.inputValue()).toBe("#hello #there");
        await editInput.fill("#another #two");

        editButton = await tack.locator('button:text-is("edit")');
        expect(await editButton.count()).toBe(0);

        let saveButton = await tack.locator('button:text-is("save")');
        await saveButton.click();

        editButton = await tack.locator('button:text-is("edit")');
        expect(await editButton.count()).toBe(1);

        saveButton = await tack.locator('button:text-is("save")');
        expect(await saveButton.count()).toBe(0);

        await retry(
            async () => {
                const tack = await page.locator(`.tack:has-text("${url}")`);
                const tagElements = await (await tack.locator(`.tag`)).elementHandles();
                const expectedTags = await Promise.all(
                    tagElements.map(async (e) => await e.textContent()),
                );
                expect(expectedTags).toStrictEqual(["another", "two"]);
            },
            {
                retries: 3,
            },
        );
    });
});
