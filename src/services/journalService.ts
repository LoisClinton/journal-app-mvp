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

export async function listEntries(uid: string): Promise<JournalEntry[]> {
  const q = query(collection(db, "entries"), where("userId", "==", uid));
  const snap = await getDocs(q);

  const entries = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as any),
  })) as JournalEntry[];
  return entries;
}

export async function getEntry(
  uid: string,
  id: string
): Promise<JournalEntry | null> {
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
