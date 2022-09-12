import { createTestTacks, TestTack } from "../test-helpers/tacks";
import { test, expect, BrowserContext } from "@playwright/test";
import { type PopularTag } from "../pages/api/user/types";
import e2eTestHelper from "../test-helpers/e2e-user";

test.describe.serial("explore tacks", async () => {
    let testTacks: { [key: string]: TestTack };
    let tagsAggregate: { [key: string]: { count: number } } = {};
    let expectedPopularTags: PopularTag[] = [];
    let context: BrowserContext;

    test.beforeAll(async ({ browser }) => {
        const details = await e2eTestHelper.newContextSignUpAndLogin(browser);
        context = details.context;
        testTacks = await createTestTacks(context.request, undefined);

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
        const page = await context.newPage();
        await page.goto(`/explore`);
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

        const url = `/tacks/search?query=${await popularTagElements
            .nth(0)
            .locator(".tag")
            .innerText()}`;
        await popularTagElements.nth(0).click();
        await page.waitForURL(url);
    });
});
