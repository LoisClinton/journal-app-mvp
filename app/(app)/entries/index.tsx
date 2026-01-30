import Button from "@/components/Button";
import { router, useFocusEffect } from "expo-router";
import { signOut } from "firebase/auth";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { auth } from "../../../src/firebase/firebaseConfig";
import {
  JournalEntry,
  listEntries,
} from "../../../src/services/journalService";

export default function JournalListScreen() {
  const uid = auth.currentUser?.uid!;
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await listEntries(uid);
    setEntries(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  return (
    <View style={{ padding: 16, gap: 12, flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button title="Add" onPress={() => router.push("/(app)/entries/new")} />
        <Button
          title="Logout"
          onPress={async () => {
            setError(null);
            try {
              await signOut(auth);
              router.replace("/");
            } catch (error) {
              console.log("Error signing out: ", error);
              setError("Failed to sign out. Please try again.");
            }
          }}
        />
      </View>

      {error && <Text style={{ color: "red" }}>{error}</Text>}

      {loading ? (
        <Text>Loading…</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No entries yet. Tap Add.</Text>}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/(app)/entries/${item.id}`)}
              style={{
                padding: 12,
                borderWidth: 1,
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {item.title || "(Untitled)"}
              </Text>
              <Text style={{ fontSize: 10, fontWeight: "200" }}>
                {"Created: " + (item?.createdAt?.toDate() || " ")}
              </Text>
              <Text numberOfLines={1} style={{ opacity: 0.7 }}>
                {item.content}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
