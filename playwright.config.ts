// playwright.config.ts
import { expect, devices, PlaywrightTestConfig } from "@playwright/test";
import { matchers } from "expect-playwright";

expect.extend(matchers);

const slowMo = parseInt(process.env.PLAYWRIGHT_SLOW_MO || "0");
const CI = !!process.env.CI;

const { TEST_HOST } = process.env;

if (!TEST_HOST) {
    throw new Error("missing TEST_HOST");
}
const host = TEST_HOST.replace(/\/$/, "");

console.log(`playwright env config: ${JSON.stringify({ host, CI, slowMo })}`);

const config: PlaywrightTestConfig = {
    forbidOnly: CI,
    retries: CI ? 2 : 0,
    workers: CI ? 4 : 1,

    use: {
        baseURL: host,
        ignoreHTTPSErrors: true,

        locale: "en-SG",
        trace: "on",
        headless: CI,
        launchOptions: {
            slowMo: slowMo,
        },
        actionTimeout: 10000,
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "Pixel 4",
            use: {
                browserName: "chromium",
                ...devices["Pixel 4"],
            },
        },
        {
            name: "iPhone 11",
            use: {
                browserName: "webkit",
                ...devices["iPhone 11"],
            },
        },
    ],
};
export default config;
