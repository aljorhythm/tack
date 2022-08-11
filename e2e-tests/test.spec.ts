import { test, expect } from "@playwright/test";
import log from "../log";

let testId = "";

test.beforeAll(async ({ browserName }, workerInfo) => {
    testId = `worker #${workerInfo.workerIndex}\t${workerInfo.project.name} - ${browserName}\t`;

    log(`Running ${testId}`);
});

test("index", async ({ page }) => {
    await page.goto(`/`);
});
