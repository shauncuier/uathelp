// src/lib/server/pagination.ts
// Firestore cursor-based pagination helpers
import { adminDb } from "@/lib/firebase/admin";
import {
  Query,
  DocumentData,
  CollectionReference,
} from "firebase-admin/firestore";

export async function paginate<T>(
  query: Query<DocumentData>,
  limit: number,
  cursor?: string
): Promise<{ items: T[]; hasMore: boolean; nextCursor: string | null }> {
  let q = query.limit(limit + 1);

  if (cursor) {
    const cursorDoc = await adminDb.doc(cursor).get();
    if (cursorDoc.exists) {
      q = q.startAfter(cursorDoc);
    }
  }

  const snapshot = await q.get();
  const docs = snapshot.docs;
  const hasMore = docs.length > limit;
  if (hasMore) docs.pop();

  const items = docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];

  const nextCursor = hasMore ? docs[docs.length - 1]?.ref.path : null;

  return { items, hasMore, nextCursor };
}
