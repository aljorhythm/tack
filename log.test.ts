import { maskEveryFour } from "./log";

test("mask", () => {
    const str = "abcdefghijklmnop";
    expect(maskEveryFour(str)).toBe("abcdxxxxijklxxxx");
});

export {};
