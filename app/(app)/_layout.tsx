import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="entries/index" options={{ title: "My Journal" }} />
      <Stack.Screen name="entries/new" options={{ title: "New Entry" }} />
      <Stack.Screen name="entries/[id]" options={{ title: "Edit Entry" }} />
    </Stack>
  );
}
