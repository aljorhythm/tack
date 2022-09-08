import { isValidPassword } from "../pages/api/user/validation";
import { generatePassword } from "./user";

test("password generation fulfils validation", () => {
    for (let i = 0; i < 200; i++) {
        const password = generatePassword();
        expect(isValidPassword(password)).toEqual(true);
    }
});

export {};
