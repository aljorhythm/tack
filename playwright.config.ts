// playwright.config.ts
import { devices } from "@playwright/test";

const slowMo = parseInt(process.env.PLAYWRIGHT_SLOW_MO || "0");
const CI = !!process.env.CI;

console.log(`playwright env config: ${JSON.stringify({ CI, slowMo })}`);

const config = {
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  use: {
    locale: "en-SG",
    trace: "on",
    headless: CI,
    launchOptions: {
      slowMo: slowMo,
    },
    actionTimeout: 5000,
    workers: CI ? 4 : undefined,
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
