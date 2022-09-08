import { createTestTacks, TestTack } from "../test-helpers/tacks";
import { test, expect, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import PageObjectModel from "./page-object-model";
import { signUp } from "../test-helpers/e2e-user";

test.describe.serial("search tacks", async () => {
    let page: Page;
    let pom: PageObjectModel;
    let testTacks: { [key: string]: TestTack };

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        pom = new PageObjectModel(page);
        await page.goto("/");
        await signUp(pom);
        testTacks = await createTestTacks(page.request, undefined);
    });

    test("should show search query from url in search input", async () => {
        const randomString = faker.random.word();
        await page.goto(`/tacks/search?query=${randomString}`);
        expect(await page.locator(`#search-tack-url`).inputValue()).toEqual(randomString);
    });

    test("should be able to see search tag prompts", async () => {
        await page.goto("/tacks/search");
        const expectedPrompts = ["programming", "javascript", "typescript", "framework", "agile"];
        const elementHandles = await page
            .locator(".search-prompts .search-prompt")
            .elementHandles();
        expect(elementHandles.length).toStrictEqual(4);
        const prompts = await Promise.all(elementHandles.map((e) => e.innerText()));
        expect(prompts.every((prompt) => expectedPrompts.indexOf(prompt) >= 0)).toEqual(true);

        const targetPrompt = elementHandles[0];
        await targetPrompt.click();
        await page.waitForURL(`/tacks/search?query=${await targetPrompt.innerText()}`);
    });

    test("should be able to search tacks", async () => {
        await page.goto("/");
        const { daveFarley, jezHumble } = testTacks;
        await page.locator('nav :text("Search")').click();
        await page.waitForURL("/tacks/search");

        await page.waitForFunction(() => {
            return document.querySelectorAll(".tack").length == 0;
        });

        const testCase = {
            searchInput: "devops agile continuous-delivery",
            expected: [daveFarley, jezHumble],
        };

        await page.locator(`[placeholder="#photography #singapore"]`).fill(testCase.searchInput);
        await page.locator('button:text("search")').click();
        await page.waitForURL("/tacks/search?query=devops+agile+continuous-delivery");

        const tacks = await (await page.locator(`.tack`)).elementHandles();
        await expect(tacks.length).toBe(testCase.expected.length);
        const expectedUrls = testCase.expected.map((tack) => tack.url);
        const actualUrls = await Promise.all(
            tacks.map(async (tack) => {
                return (await tack.$(".url"))?.innerText();
            }),
        );
        await expect(actualUrls).toEqual(expect.arrayContaining(expectedUrls));
    });
});
