import {
    ApiPaths,
    CreateTackResponse,
    LoginRequest,
    TokenResponse,
    TOKEN_HEADER,
    buildTackInput,
} from "@tack/shared";
import { API_BASE_URL } from "./config";
import {
    getCredentials,
    getToken,
    saveCredentials,
    saveToken,
} from "./auth";

export class AuthError extends Error {}

function url(path: string): string {
    return `${API_BASE_URL}${path}`;
}

/**
 * Log in with email/password. On success persists the token AND the credentials
 * (so the app can silently re-login when the token later expires) and returns
 * the token.
 */
export async function login(email: string, password: string): Promise<string> {
    const body: LoginRequest = { email, password };
    const response = await fetch(url(ApiPaths.login), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    // The backend returns 400 + `null` on bad credentials.
    if (!response.ok) {
        throw new AuthError("Invalid email or password");
    }
    const data = (await response.json()) as TokenResponse | null;
    if (!data?.token) {
        throw new AuthError("Invalid email or password");
    }

    await saveToken(data.token);
    await saveCredentials({ email, password });
    return data.token;
}

/** Decode a JWT's `exp` (seconds since epoch), or null if it can't be read. */
function tokenExpiry(token: string): number | null {
    try {
        const payload = token.split(".")[1];
        // base64url -> base64
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        // `atob` is available in Hermes (RN 0.74+).
        const json =
            typeof atob === "function"
                ? atob(base64)
                : // eslint-disable-next-line @typescript-eslint/no-var-requires
                  Buffer.from(base64, "base64").toString("utf8");
        const { exp } = JSON.parse(json) as { exp?: number };
        return typeof exp === "number" ? exp : null;
    } catch {
        return null;
    }
}

function isExpired(token: string): boolean {
    const exp = tokenExpiry(token);
    if (exp === null) {
        return false; // unknown — let the request attempt decide
    }
    // treat as expired 60s early to avoid racing the boundary
    return Date.now() / 1000 >= exp - 60;
}

/** Re-login using stored credentials. Throws AuthError if none are stored. */
async function reauthenticate(): Promise<string> {
    const creds = await getCredentials();
    if (!creds) {
        throw new AuthError("Session expired — please log in again");
    }
    return login(creds.email, creds.password);
}

/**
 * Return a token we believe is valid, refreshing pre-emptively if the current
 * one is missing or expired.
 */
async function getValidToken(): Promise<string> {
    const token = await getToken();
    if (!token || isExpired(token)) {
        return reauthenticate();
    }
    return token;
}

/**
 * Create/share a tack from a URL (+ optional tags).
 *
 * Sends the JWT via the `token` header (the backend's custom auth header — not
 * `Authorization: Bearer`). If the request fails in a way that looks like an
 * auth failure, it re-logs in once with stored credentials and retries.
 */
export async function addTack(
    urlToTack: string,
    tags: string[] = [],
): Promise<string> {
    const inputString = buildTackInput(urlToTack, tags);

    const submit = async (token: string): Promise<Response> =>
        fetch(url(ApiPaths.createTack), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                [TOKEN_HEADER]: token,
            },
            body: JSON.stringify({ inputString }),
        });

    let token = await getValidToken();
    let response = await submit(token);

    // The backend does not emit a clean 401 for an invalid token (it 500s when
    // no user resolves), so on any server-side failure we optimistically
    // re-authenticate once and retry before giving up.
    if (!response.ok) {
        token = await reauthenticate();
        response = await submit(token);
    }

    if (!response.ok) {
        throw new Error(`Failed to save tack (status ${response.status})`);
    }

    const data = (await response.json()) as CreateTackResponse;
    return data.id;
}
