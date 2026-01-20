import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { auth } from "../../../src/firebase/firebaseConfig";
import { createEntry } from "../../../src/services/journalService";

export default function NewEntryScreen() {
  const uid = auth.currentUser?.uid!;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert("Nothing to save", "Add a title or some content.");
      return;
    }
    await createEntry(uid, title.trim(), content.trim());
    router.replace("/");
  };

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
      <Button title="Save" onPress={onSave} />
    </View>
  );
}
