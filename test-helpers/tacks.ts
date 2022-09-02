import { APIRequestContext } from "@playwright/test";
import { type CreateTackFrom } from "../pages/api/user/types";

export async function createTack(request: APIRequestContext, data: CreateTackFrom, token?: string) {
    return await request.post(`/api/tack`, {
        data,
        headers: { ...(token ? { token } : {}) },
    });
}

export type TestTack = { url: string; tags: string[] };

export const google = {
    url: "www.google.com",
    tags: ["search"],
};
export const java = {
    url: "www.java.com",
    tags: ["programming"],
};
export const springboot = {
    url: "www.springboot.com",
    tags: ["programming", "java", "framework"],
};
export const nextjs = {
    url: "nextjs.com",
    tags: ["javascript", "typescript", "framework", "frontend", "backend", "serverless"],
};
export const nodejs = {
    url: "nodejs.com",
    tags: ["javascript", "typescript"],
};
export const django = {
    url: "django.com",
    tags: ["programming", "python", "framework"],
};
export const react = {
    url: "react.com",
    tags: ["javascript", "typescript", "frontend"],
};
export const allenHolub = {
    url: "allenholub.com",
    tags: ["agile", "c++"],
};
export const daveFarley = {
    url: "davefarley.com",
    tags: ["agile", "devops", "continuous-delivery", "continuous-integration"],
};
export const jezHumble = {
    url: "jeshumble.com",
    tags: ["devops", "continuous-delivery", "agile"],
};

export const testTacks: { [key: string]: TestTack } = {
    google,
    java,
    nodejs,
    django,
    springboot,
    nextjs,
    react,
    allenHolub,
    daveFarley,
    jezHumble,
};

export default testTacks;

export async function createTestTacks(
    request: APIRequestContext,
    token: string | undefined,
): Promise<{ [key: string]: TestTack }> {
    await Promise.all(
        Object.entries(testTacks).map(([_, tack]) => {
            return createTack(
                request,
                {
                    inputString: `${tack.url} ${tack.tags.join(" ")}`,
                },
                token,
            );
        }),
    );
    return testTacks;
}
