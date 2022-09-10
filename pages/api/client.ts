import { SignUpResponse } from "./user/types";

export async function editMyTag(tackId: string, tagsString: string) {
    return await fetch(`/api/user/tack/${tackId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            tagsString,
        }),
    });
}

export async function signUp(
    email: string,
    password: string,
    username: string,
): Promise<SignUpResponse> {
    const response = await fetch("/api/user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
            username,
        }),
    });
    const data: SignUpResponse = (await response.json()) as SignUpResponse;

    if (response.status === 200) {
        return data;
    } else {
        throw data;
    }
}

export async function login(email: string, password: string): Promise<string> {
    const response = await fetch("/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
    if (response.status != 200) {
        throw await response.json();
    }
    const { token } = (await response.json()) as TokenResponse;
    return token;
}

const client = { editMyTag };

export default client;
