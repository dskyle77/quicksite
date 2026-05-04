import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import { adminDb } from "@/server/firebase-admin";

export async function PATCH(
  req: Request,
  { params }: { params: { uid: string } }
) {
  const caller = await getUserFromSession();
  if (!caller?.uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const callerDoc = await adminDb.collection("users").doc(caller.uid).get();
  if (!callerDoc.data()?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { status } = await req.json(); // "active" | "suspended"
  await adminDb.collection("users").doc(params.uid).update({ status });
  return NextResponse.json({ success: true });
}