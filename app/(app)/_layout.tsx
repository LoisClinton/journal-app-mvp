import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="entries" options={{ title: "My Journal" }} />
    </Stack>
  );
}
