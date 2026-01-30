import Button from "@/components/Button";
import { auth } from "@/src/firebase/firebaseConfig";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onLogin = async () => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/");
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Login Screen</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Button title="Log in" onPress={onLogin} />
      <Button
        title="Create an account"
        onPress={() => router.push("/(auth)/register")}
      />
    </View>
  );
}
