// token.ts reads AUTH_TOKEN_SECRET at module load, so set it before requiring.
const SECRET = "test-secret";
process.env.AUTH_TOKEN_SECRET = SECRET;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { generateAccessToken, verifyToken } = require("./token");

describe("access token", () => {
    test("embeds the user id and is verifiable", async () => {
        const id = "507f1f77bcf86cd799439011";
        const token = await generateAccessToken(id);
        const decoded = await verifyToken(token);
        expect(decoded.id).toEqual(id);
    });
});

export {};
