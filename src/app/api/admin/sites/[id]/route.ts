import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import { adminDb } from "@/server/firebase-admin";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const caller = await getUserFromSession();
  if (!caller?.uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const callerDoc = await adminDb.collection("users").doc(caller.uid).get();
  if (!callerDoc.data()?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await adminDb.collection("sites").doc(params.id).delete();
  return NextResponse.json({ success: true });
}