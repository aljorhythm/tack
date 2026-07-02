import * as SecureStore from "expo-secure-store";

/**
 * Secure credential + token storage, backed by the OS keychain (iOS) /
 * keystore-encrypted store (Android) via expo-secure-store.
 *
 * We persist the login credentials (not just the token) on purpose: the backend
 * has no refresh-token endpoint, so when the short-lived JWT expires the app
 * silently re-logs in with the stored credentials (see lib/api.ts). This keeps
 * the "stay logged in" UX without building refresh-token infrastructure.
 */

const TOKEN_KEY = "tack.token";
const EMAIL_KEY = "tack.email";
const PASSWORD_KEY = "tack.password";

export type StoredCredentials = {
    email: string;
    password: string;
};

export async function saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function saveCredentials(creds: StoredCredentials): Promise<void> {
    await SecureStore.setItemAsync(EMAIL_KEY, creds.email);
    await SecureStore.setItemAsync(PASSWORD_KEY, creds.password);
}

export async function getCredentials(): Promise<StoredCredentials | null> {
    const email = await SecureStore.getItemAsync(EMAIL_KEY);
    const password = await SecureStore.getItemAsync(PASSWORD_KEY);
    if (email && password) {
        return { email, password };
    }
    return null;
}

/** Whether the user has an active session (a token is stored). */
export async function isLoggedIn(): Promise<boolean> {
    return (await getToken()) !== null;
}

/** Clear the session and stored credentials (logout). */
export async function clearSession(): Promise<void> {
    await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(EMAIL_KEY),
        SecureStore.deleteItemAsync(PASSWORD_KEY),
    ]);
}
