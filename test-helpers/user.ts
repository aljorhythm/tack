import { faker } from "@faker-js/faker";

export function generatePassword(): string {
    return faker.internet.password() + "Bq6";
}

export {};
