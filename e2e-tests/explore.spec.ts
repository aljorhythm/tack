import { createTestTacks, TestTack } from "../test-helpers/tacks";
import { test, expect, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import PageObjectModel from "./page-object-model";
import { type PopularTag } from "../pages/api/explore";

const email = `${Date.now()}${faker.internet.email()}`;
const password = faker.internet.password();

test.describe.serial("explore tacks", async () => {
    let page: Page;
    let pom: PageObjectModel;
    let testTacks: { [key: string]: TestTack };
    let tagsAggregate: { [key: string]: { count: number } } = {};
    let expectedPopularTags: PopularTag[] = [];

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        pom = new PageObjectModel(page);
        await page.goto("/");
        await pom.signup(email, password);
        await pom.login(email, password);
        testTacks = await createTestTacks(page.request, undefined);

        for (const [_, testTack] of Object.entries(testTacks)) {
            for (const tag of testTack.tags) {
                tagsAggregate[tag] = tagsAggregate[tag] || {
                    count: 0,
                };

                tagsAggregate[tag].count += 1;
            }
        }

        expectedPopularTags = Object.entries(tagsAggregate)
            .map((entry) => {
                return { tag: entry[0], count: entry[1].count };
            })
            .sort((t1, t2) => {
                return t2.count - t1.count;
            });
    });

    test("should show tags with counts at /explore", async () => {
        await page.goto(`/`);
        await page.locator('nav :text("Explore")').click();
        await expect(page.locator("body")).toContainText("Your Popular Tags");
        const container = await page.locator(".popular-tags");
        expect(container).toBeVisible();
        const popularTagElements = await container.locator(".popular-tag");
        const count = await popularTagElements.count();
        expect(count).toEqual(expectedPopularTags.length);

        const receivedPopularTags = await Promise.all(
            Array.from({ length: count }).map(async (_, i) => {
                const tagElement = popularTagElements.nth(i);
                const [tag, count] = await Promise.all([
                    tagElement.locator(".tag").innerText(),
                    tagElement.locator(".count").innerText(),
                ]);

                return { tag, count: parseInt(count) };
            }),
        );

        expect(receivedPopularTags).toEqual(expect.arrayContaining(expectedPopularTags));
    });
});
