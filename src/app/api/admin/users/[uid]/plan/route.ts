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

  const { plan } = await req.json();
  const validPlans = ["free", "basic", "growth", "pro"];
  if (!validPlans.includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  await adminDb.collection("users").doc(params.uid).update({ plan });
  return NextResponse.json({ success: true });
}