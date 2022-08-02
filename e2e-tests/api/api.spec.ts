import { test, expect } from "@playwright/test";

test("should get John Doe", async ({ request }) => {
    const response = await request.get(`/api/hello`);
    expect(response.ok()).toBeTruthy();
    expect(await response.json()).toStrictEqual({ name: "John Doe" });
});
