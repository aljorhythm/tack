import { createTestTacks } from "../test-helpers/tacks";
import { test, expect, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import PageObjectModel from "./page-object-model";

const email = `${Date.now()}${faker.internet.email()}`;
const password = faker.internet.password();

test.describe.serial("search tacks", async () => {
    let page: Page;
    let pom: PageObjectModel;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        pom = new PageObjectModel(page);
        await page.goto("/");
        await pom.signup(email, password);
        await pom.login(email, password);
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
