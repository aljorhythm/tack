/**
 * Shared API contract for the Tack backend.
 *
 * This is the single source of truth for the request/response shapes and
 * endpoint paths that clients (the mobile app, and later the web app) use to
 * talk to the Next.js API under `/pages/api`. Keep these in sync with:
 *   - pages/api/user/types.d.ts   (CreateTackFrom)
 *   - pages/api/token/types.d.ts  (TokenResponse)
 */

/** Body for `POST /api/token` (login). */
export type LoginRequest = {
    email: string;
    password: string;
};

/** Response from `POST /api/token`. `token` is a JWT sent back on every
 *  authenticated request via the `token` header. */
export type TokenResponse = {
    token: string;
};

/**
 * Body for `POST /api/tack` (create/share a tack).
 *
 * `inputString` is space-delimited: the first token is the URL, any remaining
 * tokens are treated as tags (a leading `#` is stripped server-side). e.g.
 *   "https://example.com #reading #ai"
 */
export type CreateTackFrom = {
    inputString: string;
};

/** Response from `POST /api/tack`. */
export type CreateTackResponse = {
    id: string;
};

/** Body for `POST /api/user` (sign up), included for completeness. */
export type SignUpRequest = {
    email: string;
    password: string;
    username: string;
};

/** API endpoint paths (appended to the configured API base URL). */
export const ApiPaths = {
    login: "/api/token",
    createTack: "/api/tack",
    me: "/api/user",
    signUp: "/api/user",
} as const;

/**
 * Name of the HTTP header the API reads the JWT from. The Tack backend uses a
 * custom `token` header (see pages/request.ts getUserFromToken), NOT
 * `Authorization: Bearer`.
 */
export const TOKEN_HEADER = "token";

/**
 * Build the `inputString` for a tack from a URL and optional tags.
 * Mirrors the server-side parsing in pages/api/tack/domain.ts.
 */
export function buildTackInput(url: string, tags: string[] = []): string {
    const cleanTags = tags
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => (t.startsWith("#") ? t : `#${t}`));
    return [url.trim(), ...cleanTags].join(" ");
}
