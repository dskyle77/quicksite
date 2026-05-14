import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import { adminDb } from "@/server/firebase-admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ uid: string }> },
) {
  const caller = await getUserFromSession();
  if (!caller?.uid)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!caller.isAdmin)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { plan } = await req.json();

  const validPlans = ["free", "growth", "pro"];
  if (!validPlans.includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const { uid } = await params;

  await adminDb.collection("users").doc(uid).update({ plan });
  return NextResponse.json({ success: true });
}
