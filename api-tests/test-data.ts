import { faker } from "@faker-js/faker";

type Data = {
    email: string;
    password: string;
};

let cache: Data | null = null;

export default async function getData(): Promise<Data> {
    if (!cache) {
        cache = {
            email: `${Date.now()}${faker.internet.email()}`,
            password: faker.internet.password(),
        };
    }
    return cache;
}
