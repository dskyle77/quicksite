/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { adminDb } from "@/server/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const siteRef = adminDb.collection("sites").doc(slug);

    await siteRef.update({
      whatsappClicks: FieldValue.increment(1),
      lastClickedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 5) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }
    console.error("Whatsapp Click Tracking Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
