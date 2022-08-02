import { test, expect } from "@playwright/test";
const { TEST_HOST } = process.env;

if (!TEST_HOST) {
  throw new Error("missing TEST_HOST");
}

test.use({
  ignoreHTTPSErrors: true,
});

const host = TEST_HOST.replace(/\/$/, "");

let testId = "";

test.beforeAll(async ({ browserName }, workerInfo) => {
  testId = `worker #${workerInfo.workerIndex}\t${workerInfo.project.name} - ${browserName}\t`;

  console.log(`Running ${testId}`);

  console.log(`${testId}: host is ${host}`);
});

test("index", async ({ page }) => {
  await page.goto(`${host}/`);
  const welcomeTitle = await page.$("text=Welcome to Next.js!");
  expect(welcomeTitle).not.toBeNull();
});
