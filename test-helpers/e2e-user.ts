import { faker } from "@faker-js/faker";
import PageObjectModel from "../e2e-tests/page-object-model";

export async function signUp(pom: PageObjectModel): Promise<{
    username: string;
    email: string;
}> {
    const email = `${Date.now()}${faker.internet.email()}`;
    const username = email.split("@")[0].replaceAll(/[\W_]/g, "");
    const password = faker.internet.password();

    await pom.signup(email, password, username);
    await pom.login(email, password);

    return { username, email };
}

export {};
