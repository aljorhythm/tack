import { Stack, useRouter } from "expo-router";
import {
    ShareIntentProvider,
    useShareIntentContext,
} from "expo-share-intent";
import { useEffect } from "react";

/**
 * Watches for an incoming OS share (a URL shared into Tack from another app)
 * and routes to the /share screen to handle it.
 */
function RootNavigator() {
    const router = useRouter();
    const { hasShareIntent } = useShareIntentContext();

    useEffect(() => {
        if (hasShareIntent) {
            router.replace("/share");
        }
    }, [hasShareIntent]);

    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Tack" }} />
            <Stack.Screen name="login" options={{ title: "Log in" }} />
            <Stack.Screen
                name="share"
                options={{ title: "Save to Tack", presentation: "modal" }}
            />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <ShareIntentProvider>
            <RootNavigator />
        </ShareIntentProvider>
    );
}
