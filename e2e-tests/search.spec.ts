import { test, expect, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { createTestPieces } from "../test-helpers/pieces";
import PageObjectModel from "./page-object-model";

const email = `${Date.now()}${faker.internet.email()}`;
const password = faker.internet.password();

test.describe.serial("pieces", async () => {
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

    test("should be able to insert piece and see added piece", async () => {
        await page.locator("nav >> text=Pieces").click();
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
        const { daveFarley, jezHumble } = await createTestPieces(page.request, undefined);
        await page.goto("/");

        await page.locator('nav :text("Search")').click();
        await page.waitForURL("/pieces/search");

        expect(await page.locator(".piece").count()).toBe(0);

        const testCase = {
            searchInput: "devops agile continuous-delivery",
            expected: [daveFarley, jezHumble],
        };

        await page.locator(`[placeholder="#photography #singapore"]`).fill(testCase.searchInput);
        await page.locator('button:text("search")').click();
        await page.waitForURL("/pieces/search?query=devops+agile+continuous-delivery");

        const pieces = await (await page.locator(`.piece`)).elementHandles();
        await expect(pieces.length).toBe(testCase.expected.length);
        const expectedUrls = testCase.expected.map((tack) => tack.url);
        const actualUrls = await Promise.all(
            pieces.map(async (piece) => {
                return (await piece.$(":not(.tag)"))?.innerText();
            }),
        );
        await expect(actualUrls).toEqual(expect.arrayContaining(expectedUrls));
    });
});
