import validator from "validator";

export function isValidPassword(password: string | undefined) {
    return (
        password &&
        validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
            returnScore: false,
        })
    );
}
