import Button from "@/components/Button";
import { auth } from "@/src/firebase/firebaseConfig";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onRegister = async () => {
    setError(null);
    setSuccess(null);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      setSuccess(
        "Account created successfully! Return to login screen and log in to your account.",
      );
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Create account</Text>

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
      {success ? <Text style={{ color: "green" }}>{success}</Text> : null}

      <Button title="Create account" onPress={onRegister} />
      <Button title="Back to login" onPress={() => router.back()} />
    </View>
  );
}
