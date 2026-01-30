import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export type JournalEntry = {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt?: any;
  updatedAt?: any;
};

const cacheKey = (uid: string) => `entries:${uid}`;

export async function listEntries(uid: string): Promise<JournalEntry[]> {
  const cached = await AsyncStorage.getItem(cacheKey(uid));
  const cachedEntries = cached ? (JSON.parse(cached) as JournalEntry[]) : [];
  try {
    const q = query(collection(db, "entries"), where("userId", "==", uid));
    const snap = await getDocs(q);

    const entries = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    })) as JournalEntry[];
    await AsyncStorage.setItem(cacheKey(uid), JSON.stringify(entries));
    return entries;
  } catch (error) {
    console.error(
      "Error fetching entries from Firestore, returning cached entries:",
      error,
    );
    return cachedEntries;
  }
}

export async function getEntry(
  uid: string,
  id: string,
): Promise<JournalEntry | null> {
  // cache first (for offline read)
  const cached = await AsyncStorage.getItem(cacheKey(uid));
  const cachedEntries = cached ? (JSON.parse(cached) as JournalEntry[]) : [];
  const cachedEntry = cachedEntries.find((e) => e.id === id);
  if (cachedEntry) return cachedEntry;

  // then Firestore
  const ref = doc(db, "entries", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as any) } as JournalEntry;
}

export async function createEntry(uid: string, title: string, content: string) {
  await addDoc(collection(db, "entries"), {
    userId: uid,
    title,
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateEntry(id: string, title: string, content: string) {
  await updateDoc(doc(db, "entries", id), {
    title,
    content,
    updatedAt: serverTimestamp(),
  });
}

export async function removeEntry(id: string) {
  await deleteDoc(doc(db, "entries", id));
}
