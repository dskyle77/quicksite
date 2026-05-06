/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/analytics/visit/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/server/firebase-admin"; // Ensure this points to your admin/server-side DB init
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const siteRef = adminDb.collection("sites").doc(slug);

    await siteRef.update({
      visits: FieldValue.increment(1),
      lastVisitAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 5) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    console.error("Visit Tracking Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
