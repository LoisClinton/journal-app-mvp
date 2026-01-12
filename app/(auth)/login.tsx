import { Button, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Login Screen</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />

      <Button title="Log in" />
    </View>
  );
}
