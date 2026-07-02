import { Redirect, useRouter } from "expo-router";
import { useShareIntentContext } from "expo-share-intent";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { addTack } from "../lib/api";
import { isLoggedIn } from "../lib/auth";

/** Pull the first http(s) URL out of shared plain text. */
function extractUrl(text?: string | null): string | null {
    if (!text) return null;
    const match = text.match(/https?:\/\/[^\s]+/i);
    return match ? match[0] : text.trim();
}

type Auth = "loading" | "no" | "yes";

export default function ShareScreen() {
    const router = useRouter();
    const { shareIntent, resetShareIntent } = useShareIntentContext();
    const [auth, setAuth] = useState<Auth>("loading");
    const [tags, setTags] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const sharedUrl = useMemo(
        () => shareIntent?.webUrl ?? extractUrl(shareIntent?.text),
        [shareIntent?.webUrl, shareIntent?.text],
    );

    useEffect(() => {
        (async () => {
            setAuth((await isLoggedIn()) ? "yes" : "no");
        })();
    }, []);

    if (auth === "loading") {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    // Must be logged in to save. Send them to login; they can re-share after.
    if (auth === "no") {
        return <Redirect href="/login" />;
    }

    if (!sharedUrl) {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>Nothing to save</Text>
                <Text style={styles.subtle}>
                    That share didn’t contain a link.
                </Text>
                <Pressable style={styles.button} onPress={() => router.replace("/")}>
                    <Text style={styles.buttonText}>Done</Text>
                </Pressable>
            </View>
        );
    }

    async function onSave() {
        setBusy(true);
        setError(null);
        try {
            const tagList = tags
                .split(/[\s,]+/)
                .map((t) => t.trim())
                .filter(Boolean);
            await addTack(sharedUrl!, tagList);
            resetShareIntent();
            setSaved(true);
        } catch {
            setError("Could not save. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    if (saved) {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>Saved to Tack ✓</Text>
                <Text style={styles.url} numberOfLines={2}>
                    {sharedUrl}
                </Text>
                <Pressable style={styles.button} onPress={() => router.replace("/")}>
                    <Text style={styles.buttonText}>Done</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Save to Tack</Text>
            <Text style={styles.label}>Link</Text>
            <Text style={styles.url} numberOfLines={3}>
                {sharedUrl}
            </Text>

            <Text style={styles.label}>Tags (optional)</Text>
            <TextInput
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="reading ai"
                value={tags}
                onChangeText={setTags}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
                style={[styles.button, busy && styles.buttonDisabled]}
                onPress={onSave}
                disabled={busy}
            >
                {busy ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Save tack</Text>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    container: { flex: 1, padding: 24, gap: 10 },
    heading: { fontSize: 24, fontWeight: "700", marginBottom: 4 },
    subtle: { color: "#475569" },
    label: { fontSize: 13, color: "#475569", marginTop: 8 },
    url: {
        fontSize: 15,
        color: "#0f172a",
        backgroundColor: "#f1f5f9",
        padding: 12,
        borderRadius: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    error: { color: "#dc2626", marginTop: 4 },
    button: {
        marginTop: 16,
        backgroundColor: "#0f172a",
        padding: 14,
        borderRadius: 999,
        alignItems: "center",
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
