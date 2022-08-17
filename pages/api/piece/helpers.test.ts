import { sanitizeTag } from "./helpers";

test("sanitizeTag()", () => {
    expect(sanitizeTag("#one")).toBe("one");
});

export {};
