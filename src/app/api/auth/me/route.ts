import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import { adminDb } from "@/server/firebase-admin";

export async function GET() {
  const user = await getUserFromSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Double check the admin status in the DB
  const userDoc = await adminDb.collection("users").doc(user.uid).get();
  const isAdmin = userDoc.data()?.isAdmin === true;

  return NextResponse.json({
    ...user,
    isAdmin,
  });
}
