import { test, expect, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";

const email = `${Date.now()}${faker.internet.email()}`;
const password = faker.internet.password();

test.describe.serial("story", async () => {
    let page: Page;
    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        await page.goto("/");
    });

    test("register and sign in", async () => {
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

    test("should fail login with incorrect credentials", async () => {
        await page.goto("/");
        await page.locator("text=Login").click();
        await page.waitForURL("/login");
        await page.locator('[placeholder="Email"]').fill(email);
        const wrongPassword = password + "wrong";
        await page.locator('[placeholder="•••••••••"]').fill(wrongPassword);
        await page.locator('button:text("Login")').click();
        await expect(page.locator(`text=Login unsuccessful`)).toBeVisible();
    });

    test("should be able to insert piece and see added piece", async () => {
        await page.goto("/pieces");
        const url = faker.internet.url();
        await page.locator(`[placeholder="http://www.example.com/"]`).fill(url);
        await page.locator('button:text("Add")').click();
        await page.waitForNavigation();
        const element = await page.locator(`.piece:text("${url}")`);
        await expect(element).toBeVisible();
    });
});
