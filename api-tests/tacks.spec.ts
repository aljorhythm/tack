import { faker } from "@faker-js/faker";
import { test, expect, APIRequestContext } from "@playwright/test";
import { type Tack } from "../pages/api/tack/types";
import { type CreateResponse, type CreateTackFrom } from "../pages/api/user/types";
import randomCase from "random-case";

import {
    createTack,
    createTestTacks,
    daveFarley,
    django,
    java,
    jezHumble,
    nextjs,
    nodejs,
    react,
    springboot,
    TestTack,
} from "../test-helpers/tacks";
import { signUp } from "../test-helpers/api-user";

test.describe.serial("tacks api", async () => {
    let token: string = "";

    test.beforeAll(async ({ request }) => {
        const userInfo = await signUp(request);
        token = userInfo.token;
    });

    async function addTackHelper(
        request: APIRequestContext,
        inputString: string,
        assertGotCreateResponseBody: (body: CreateResponse) => void,
        assertGotTacksResponseBody: (body: Array<Tack>, id: string) => void,
        token: string,
    ) {
        const data: CreateTackFrom = {
            inputString,
        };
        const gotCreateResponse = await createTack(request, data, token);
        expect(gotCreateResponse.ok()).toBeTruthy();

        const gotCreateResponseBody: CreateResponse = await gotCreateResponse.json();
        assertGotCreateResponseBody(gotCreateResponseBody);

        const gotGetResponse = await request.get(`/api/tack/tacks`, {
            headers: { token },
        });
        expect(gotGetResponse.ok()).toBeTruthy();
        const gotTacks: Array<Tack> = await gotGetResponse.json();
        assertGotTacksResponseBody(gotTacks, gotCreateResponseBody.id);
    }

    test("should be able to add tack", async ({ request }) => {
        const url = faker.internet.url();
        await addTackHelper(
            request,
            url,
            (gotCreateResponseBody) => {
                expect(gotCreateResponseBody).toMatchObject({
                    id: expect.any(String),
                });
            },
            (gotTacks, createdId) => {
                expect(gotTacks[0]).toMatchObject({
                    url,
                    id: createdId,
                    tags: [],
                });
            },
            token,
        );
    });

    test("should be able to add tack with tags", async ({ request }) => {
        const url = faker.internet.url();
        const inputString = url + " #hello #there!";

        await addTackHelper(
            request,
            inputString,
            (gotCreateResponseBody) => {
                expect(gotCreateResponseBody).toMatchObject({
                    id: expect.any(String),
                });
            },
            (gotTacks, createdId) => {
                expect(gotTacks[0]).toMatchObject({
                    url,
                    id: createdId,
                    tags: ["hello", "there!"],
                });
            },
            token,
        );
    });

    const testCases: Array<{ searchInput: string; expected: Array<TestTack> }> = [
        { searchInput: "doesnotexist", expected: [] },
        { searchInput: "programming", expected: [java, springboot, django] },
        { searchInput: "javascript typescript", expected: [nodejs, nextjs, react] },
        { searchInput: "javascript #typescript", expected: [nodejs, nextjs, react] },
        { searchInput: "devops agile continuous-delivery", expected: [daveFarley, jezHumble] },
        { searchInput: "devops agile #continuous-delivery", expected: [daveFarley, jezHumble] },
    ];

    test("create test tacks", async ({ request }) => {
        await createTestTacks(request, token);
        const gotGetResponse = await request.get(`/api/tack/tacks`, {
            headers: { token },
        });
        expect(
            ((await gotGetResponse.json()) as Tack[]).some((t) => {
                return t.url === "www.java.com";
            }),
        ).toBe(true);
    });

    for (const testCase of testCases) {
        test(`should be able to search tack with tags ${testCase.searchInput}`, async ({
            request,
        }) => {
            const { searchInput: query, expected } = testCase;
            const gotQueryResponse = await request.get(`/api/tack/tacks`, {
                params: { query },
                headers: { token: token },
            });
            const gotTacks: Array<Tack> = await gotQueryResponse.json();
            expect(
                gotTacks.map((tack) => {
                    return { url: tack.url, tags: tack.tags };
                }),
            ).toEqual(expect.arrayContaining(expected));
            expect(gotTacks.length).toEqual(expected.length);
        });
    }

    test("should be able to add and search tack with case insensitive tags", async ({
        request,
    }) => {
        const testTacks = [
            { url: "singapore", tags: ["country", "southeast-asia"] },
            { url: "malaysia", tags: ["country", "southeast-asia"] },
            { url: "unitedkingdom", tags: ["country", "europe"] },
            { url: "kualalumpur", tags: ["city", "southeast-asia"] },
            { url: "gordonramsey", tags: ["food", "chef"] },
        ];
        const [singapore, malaysia, unitedkingdom, kualalumpur, gordonramsey] = testTacks;
        await Promise.all(
            testTacks.map(async (testTack) => {
                await createTack(
                    request,
                    {
                        inputString: `${testTack.url} ${testTack.tags.map(randomCase).join(" ")}`,
                    },
                    token,
                );
            }),
        );

        const testCases: Array<{ searchInput: string; expected: Array<TestTack> }> = [
            { searchInput: "doesnotexist", expected: [] },
            { searchInput: "food", expected: [gordonramsey] },
            { searchInput: "country", expected: [singapore, malaysia, unitedkingdom] },
            { searchInput: "southeast-asia", expected: [singapore, malaysia, kualalumpur] },
        ];

        await Promise.all(
            testCases.map(async (testCase) => {
                const { searchInput: query, expected } = testCase;
                const gotQueryResponse = await request.get(`/api/tack/tacks`, {
                    params: { query: randomCase(query) },
                    headers: { token: token },
                });
                const gotTacks: Array<Tack> = await gotQueryResponse.json();
                expect(
                    gotTacks.map((gotTack) => {
                        return { url: gotTack.url, tags: gotTack.tags };
                    }),
                ).toEqual(expect.arrayContaining(expected));
                expect(gotTacks.length).toEqual(expected.length);
            }),
        );
    });
});
