/* eslint-disable @typescript-eslint/no-explicit-any */

// lib/utils/serialize.ts
export function serializeFirestoreDoc<T extends Record<string, any> | null>(
  doc: T,
): T {
  if (doc === null) return doc;
  return Object.fromEntries(
    Object.entries(doc).map(([key, value]) => {
      // Firestore Timestamp (has _seconds / toDate)
      if (value && typeof value === "object" && "_seconds" in value) {
        return [key, new Date(value._seconds * 1000).toISOString()];
      }
      // Nested objects (but not arrays, not null)
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return [key, serializeFirestoreDoc(value)];
      }
      return [key, value];
    }),
  ) as T;
}
