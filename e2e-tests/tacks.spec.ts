import { test, expect, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { createTestTacks } from "../test-helpers/tacks";
import PageObjectModel from "./page-object-model";
import sites from "../pages/api/url/sites-data";
import { type Tack } from "../pages/api/tack/types";

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

        const site = sites[0];
        const { url, title } = site;

        const inputString = `${url} #hello #there`;
        await page.locator(`[placeholder="https://tack.app #app #index"]`).fill(inputString);
        await page.locator('button:text("tack")').click();
        await page.waitForNavigation();

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

    test("should be able to edit tack", async () => {
        const site = sites[0];
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

        const response = await page.request.get(`/api/tack/tacks`);
        const tacks: Tack[] = await response.json();
        const targetTack = tacks.find((t) => t.url === url);
        expect(targetTack?.tags).toStrictEqual(["another", "two"]);
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
