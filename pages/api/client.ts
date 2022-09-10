import { Tack } from "./tack/types";
import { CreateTackFrom, SignUpResponse, UserType } from "./user/types";

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

export async function addTack(addTackUrl: string): Promise<string> {
    const createTackFrom: CreateTackFrom = {
        inputString: addTackUrl,
    };
    const response = await fetch("/api/tack", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(createTackFrom),
    });

    const { id } = await response.json();
    return id;
}

export async function getMyTag(tackId: string): Promise<Tack> {
    const response = await fetch(`/api/user/tack/${tackId}`, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return await response.json();
}

export async function getTackText(tackId: string): Promise<string | null> {
    const response = await fetch(`/api/tack/${tackId}/text`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const { text } = await response.json();
    return text;
}

export async function getMe(): Promise<UserType> {
    const response = await fetch("/api/user");
    return await response.json();
}

const client = { editMyTag };

export default client;