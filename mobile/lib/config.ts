import Constants from "expo-constants";

/**
 * Base URL of the Tack backend (the Next.js app that serves `/api/*`).
 *
 * Resolution order:
 *  1. EXPO_PUBLIC_API_BASE_URL env var (set at build/start time) — best for
 *     pointing a dev build at a local machine, e.g.
 *     EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:3000
 *  2. `expo.extra.apiBaseUrl` in app.json (the default / production URL).
 */
export const API_BASE_URL: string =
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ||
    "https://tack.vercel.app";
