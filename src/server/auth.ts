// /src/server/auth.ts

import { headers } from "next/headers";
import { adminAuth, adminDb } from "./firebase-admin";

export async function getUserFromSession() {
  const authHeader =
    (await headers()).get("authorization") ||
    (await headers()).get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = await adminAuth.verifyIdToken(token);

    // 🔥 get user profile (for plan)
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();

    const userData = userDoc.data();

    return {
      uid: decoded.uid,
      email: decoded.email,
      plan: userData?.plan || "free",
    };
  } catch (err) {
    console.error("Auth error:", err);
    return null;
  }
}
