import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/server/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: NextRequest) {
  try {
    const { uid, email, displayName, photoURL, phoneNumber } = await req.json();

    if (!uid || !email) {
      return NextResponse.json(
        { error: "Missing uid or email" },
        { status: 400 },
      );
    }

    const userRef = adminDb.collection("users").doc(uid);
    const snap = await userRef.get();

    if (!snap.exists) {
      await userRef.set({
        uid,
        email,
        displayName: displayName || "",
        photoURL: photoURL || "",
        phoneNumber: phoneNumber || "",
        defaultMessage: "Hi! I'm interested in your services.",
        plan: "free",
        siteCount: 0,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("create-profile error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
