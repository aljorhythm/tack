import { test, expect, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { createTestTacks } from "../test-helpers/tacks";
import PageObjectModel from "./page-object-model";

const email = `${Date.now()}${faker.internet.email()}`;
const password = faker.internet.password();

test.describe.serial("tacks", async () => {
    let page: Page;
    let pom: PageObjectModel;
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        pom = new PageObjectModel(page);
        await page.goto("/");
    });

    test("register and sign in", async () => {
        await pom.signup(email, password);
        await pom.login(email, password);
    });

    test("should be able to insert tack and see added tack", async () => {
        await page.locator("nav >> text=Tacks").click();
        await page.waitForURL("/tacks");

        const url = faker.internet.url();
        const inputString = `${url} #hello #there`;
        await page.locator(`[placeholder="https://tack.app #app #index"]`).fill(inputString);
        await page.locator('button:text("tack")').click();
        await page.waitForNavigation();

        const tack = await page.locator(`.tack:has-text("${url}")`);
        await expect(tack).toBeVisible();

        const tagElements = await (await tack.locator(`.tag`)).elementHandles();
        await expect(tagElements.length).toBe(2);

        const createdAtElement = await tack.locator(`.created-at`);
        await expect((await createdAtElement.allInnerTexts())[0]).toMatch(
            /^[0-9][0-9]\/[0-1][0-9]\/[0-3][0-9] [0-9]?[0-9]:[0-9]?[0-9] (am|pm)$/,
        );
    });

    test("should be able to search tacks", async () => {
        const { daveFarley, jezHumble } = await createTestTacks(page.request, undefined);
        await page.goto("/");

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
