import { test, expect } from "@playwright/test";

test("should get healthy endpoint", async ({ request }) => {
    const response = await request.get(`/api/health`);
    expect(response.ok()).toBeTruthy();
    expect(await response.json()).toStrictEqual({ mongodb: "OK" });
});
