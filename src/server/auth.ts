// /src/server/auth.ts

import { headers } from "next/headers";
import { adminAuth, adminDb } from "./firebase-admin";

export async function getUserFromSession() {
  const headerStore = await headers();

  const authHeader = headerStore.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = await adminAuth.verifyIdToken(token);

    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();

    const userData = userDoc.data();

    return {
      uid: decoded.uid,
      email: decoded.email || userData?.email || null,
      displayName: decoded.name || userData?.displayName || null,
      plan: userData?.plan ?? "free",
      isAdmin: userData?.isAdmin ?? false,
    };
  } catch (err) {
    console.error("[getUserFromSession] auth error:", err);
    return null;
  }
}
