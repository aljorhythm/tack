import { sanitizeTag } from "./helpers";

test("sanitizeTag()", () => {
    expect(sanitizeTag("#one")).toBe("one");
    expect(sanitizeTag("#One")).toBe("one");
    expect(sanitizeTag("#OnE")).toBe("one");
    expect(sanitizeTag("OnE")).toBe("one");
});

export {};
