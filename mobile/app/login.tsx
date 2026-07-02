import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { AuthError, login } from "../lib/api";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function onSubmit() {
        setBusy(true);
        setError(null);
        try {
            await login(email.trim(), password);
            router.replace("/");
        } catch (e) {
            setError(
                e instanceof AuthError
                    ? e.message
                    : "Could not log in. Check your connection and try again.",
            );
        } finally {
            setBusy(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Log in to Tack</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                secureTextEntry
                textContentType="password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
                style={[styles.button, busy && styles.buttonDisabled]}
                onPress={onSubmit}
                disabled={busy || !email || !password}
            >
                {busy ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Log in</Text>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: "center", gap: 8 },
    heading: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
    label: { fontSize: 13, color: "#475569", marginTop: 8 },
    input: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    error: { color: "#dc2626", marginTop: 8 },
    button: {
        marginTop: 20,
        backgroundColor: "#0f172a",
        padding: 14,
        borderRadius: 999,
        alignItems: "center",
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
