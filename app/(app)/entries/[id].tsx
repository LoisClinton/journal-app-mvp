import Button from "@/components/Button";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { auth } from "../../../src/firebase/firebaseConfig";
import {
  getEntry,
  removeEntry,
  updateEntry,
} from "../../../src/services/journalService";

export default function EditEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const uid = auth.currentUser?.uid!;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const entry = await getEntry(uid, id!);
      setTitle(entry?.title ?? "");
      setContent(entry?.content ?? "");
      setLoading(false);
    })();
  }, [id]);

  const onSave = async () => {
    await updateEntry(id!, title.trim(), content.trim());
    router.back();
  };

  const onDelete = async () => {
    Alert.alert("Delete entry?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeEntry(id!);
          router.back();
        },
      },
    ]);
  };

  if (loading)
    return (
      <View style={{ padding: 16 }}>
        <Text>Loading…</Text>
      </View>
    );

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 12, borderRadius: 8 }}
      />
      <TextInput
        placeholder="Write something…"
        value={content}
        onChangeText={setContent}
        multiline
        style={{
          borderWidth: 1,
          padding: 12,
          borderRadius: 8,
          height: 200,
          textAlignVertical: "top",
        }}
      />
      <Button title="Save changes" onPress={onSave} />
      <Button
        title="Delete"
        onPress={onDelete}
        color="#d9534f"
        clickedColor="#c9302c"
      />
    </View>
  );
}
