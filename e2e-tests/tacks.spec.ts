import { test, expect } from "@playwright/test";

test.describe.serial("list tacks", async () => {
    test("should see page not found", async ({ browser }) => {
        const page = await browser.newPage();
        await page.goto("/tacks");
        await expect(page.locator("main")).toMatchText(/404/);
    });
});
