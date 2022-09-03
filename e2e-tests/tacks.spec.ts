import { test, expect, Page, BrowserContext } from "@playwright/test";
import { faker } from "@faker-js/faker";
import PageObjectModel from "./page-object-model";
import sites from "../pages/api/url/sites-data";
import retry from "async-retry";

const email = `${Date.now()}${faker.internet.email()}`;
const password = faker.internet.password();

test.describe.serial("tacks", async () => {
    let page: Page;
    let pom: PageObjectModel;
    let context: BrowserContext;
    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        pom = new PageObjectModel(page);
        await page.goto("/");
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
    });

    test("should be able to see updated tack after editing", async () => {
        const site = sites[0];
        const { url } = site;
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

    test("should be able to see iframe of target website after clicking 🔍", async () => {
        const site = sites[0];
        const { url } = site;
        const tack = await page.locator(`.tack:has-text("${url}")`);

        let iframe = await tack.locator("iframe");
        expect(iframe).not.toBeVisible();

        // open
        await tack.locator("text=🔍").click();
        iframe = await tack.locator("iframe");
        expect(iframe).toBeVisible();

        expect(await iframe.getAttribute("src")).toBe(url);

        // close
        await tack.locator("text=🔍").click();
        iframe = await tack.locator("iframe");
        expect(iframe).not.toBeVisible();
    });
});
