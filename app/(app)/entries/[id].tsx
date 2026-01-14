import { useState } from "react";
import { Text, View } from "react-native";

export default function EditEntryScreen() {
  const [loading] = useState(true);

  if (loading)
    return (
      <View style={{ padding: 16 }}>
        <Text>Loading…</Text>
      </View>
    );

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text>Entry Detail Screen</Text>
    </View>
  );
}
