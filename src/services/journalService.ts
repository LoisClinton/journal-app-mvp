import { collection, getDocs, query, where } from "firebase/firestore";
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
