import { test, expect } from "@playwright/test";
import e2eTestHelper, { ContextDetails } from "../test-helpers/e2e-user";

test.describe("keypresses", () => {
    let contextDetails: ContextDetails;
    test.beforeAll(async ({ browser }) => {
        contextDetails = await e2eTestHelper.newContextSignUpAndLogin(browser);
    });

    test("focus on navbar input when CTRL a", async () => {
        const page = await contextDetails.context.newPage();
        await page.goto("/");
        while (await page.locator("nav >> text=add").isVisible()) {
            await page.locator("nav >> .set-mode-icon").click();
        }

        await page.locator("main").click();

        await expect(page.locator("nav >> input")).not.toHaveFocus();

        page.keyboard.down("Control");
        page.keyboard.down("a");
        page.keyboard.up("a");
        page.keyboard.up("Control");
        expect(await page.waitForSelector("nav >> text=add")).not.toBeNull();

        await expect(page.locator("nav >> input")).toHaveFocus();
    });
});

export {};
