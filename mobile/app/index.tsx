import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { addTack } from "../lib/api";
import { clearSession, isLoggedIn } from "../lib/auth";

type Status = "loading" | "signedOut" | "signedIn";

export default function HomeScreen() {
    const router = useRouter();
    const [status, setStatus] = useState<Status>("loading");
    const [manualUrl, setManualUrl] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        (async () => {
            setStatus((await isLoggedIn()) ? "signedIn" : "signedOut");
        })();
    }, []);

    if (status === "loading") {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
            </View>
        );
    }

    if (status === "signedOut") {
        return <Redirect href="/login" />;
    }

    async function onAdd() {
        if (!manualUrl.trim()) return;
        setBusy(true);
        setMessage(null);
        try {
            await addTack(manualUrl.trim());
            setManualUrl("");
            setMessage("Saved!");
        } catch {
            setMessage("Could not save. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    async function onLogout() {
        await clearSession();
        router.replace("/login");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Tack</Text>
            <Text style={styles.subtle}>
                Share a link from any app and pick “Tack” to save it here. You
                can also paste a URL below.
            </Text>

            <TextInput
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                placeholder="https://example.com"
                value={manualUrl}
                onChangeText={setManualUrl}
            />

            <Pressable
                style={[styles.button, busy && styles.buttonDisabled]}
                onPress={onAdd}
                disabled={busy || !manualUrl.trim()}
            >
                {busy ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Save tack</Text>
                )}
            </Pressable>

            {message ? <Text style={styles.message}>{message}</Text> : null}

            <Pressable style={styles.logout} onPress={onLogout}>
                <Text style={styles.logoutText}>Log out</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
    container: { flex: 1, padding: 24, gap: 12 },
    heading: { fontSize: 28, fontWeight: "700", marginTop: 8 },
    subtle: { color: "#475569", marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#0f172a",
        padding: 14,
        borderRadius: 999,
        alignItems: "center",
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
    message: { color: "#0f766e", marginTop: 4 },
    logout: { marginTop: "auto", alignItems: "center", padding: 12 },
    logoutText: { color: "#64748b", fontWeight: "600" },
});
