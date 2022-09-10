import { faker } from "@faker-js/faker";
import PageObjectModel from "../e2e-tests/page-object-model";
import { generatePassword } from "./user";

export async function signUp(pom: PageObjectModel): Promise<{
    username: string;
    email: string;
}> {
    const email = `${Date.now()}${faker.internet.email()}`;
    const username = email.split("@")[0].replaceAll(/[\W_]/g, "");
    const password = generatePassword();

    await pom.signup(email, password, username);
    await pom.login(email, password);
    await pom.page.waitForNavigation();
    return { username, email };
}

export {};
