import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

const email = faker.internet.email();
const password = faker.internet.password();

test.describe.serial("story", async () => {
    test("register and sign in", async ({ page }) => {
        await page.goto("/");
        await page.locator("text=Sign Up").click();

        await page.waitForURL("/signup");

        await page.locator('[placeholder="Email"]').fill(email);
        await page.locator('[placeholder="•••••••••"]').fill(password);

        await page.locator("text=Sign Up").click();

        await page.waitForNavigation({ url: "/login" });

        await page.locator('[placeholder="Email"]').fill(email);
        await page.locator('[placeholder="•••••••••"]').fill(password);
        await page.locator('button:text("Login")').click();
        await page.waitForURL("/profile");
        await expect(page.locator(`text=${email}`)).toBeVisible();
    });

    test("should fail", async ({ page }) => {});
});
