import { test, expect } from "@playwright/test";

let testId = "";

test.beforeAll(async ({ browserName }, workerInfo) => {
    testId = `worker #${workerInfo.workerIndex}\t${workerInfo.project.name} - ${browserName}\t`;

    console.log(`Running ${testId}`);
});

test("index", async ({ page }) => {
    await page.goto(`/`);
});
