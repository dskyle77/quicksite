/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { adminDb } from "@/server/firebase-admin";

const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

export async function DELETE(req: Request) {
  try {
    const { domain, uid, siteId } = await req.json();

    if (!domain || !uid || !siteId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    // 1. Remove from Vercel Project
    const vercelRes = await fetch(
      `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${domain}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      },
    );

    // Note: We proceed even if Vercel fails (e.g., if domain was already deleted manually)
    // to keep our database clean.

    // 2. Atomic Cleanup in Firestore
    const batch = adminDb.batch();

    // Clear the domain from the Site document
    const siteRef = adminDb.collection("sites").doc(siteId);
    batch.update(siteRef, {
      customDomain: null,
      updatedAt: new Date().toISOString(),
    });

    // Remove from User's domain management list
    const userDomainRef = adminDb
      .collection("users")
      .doc(uid)
      .collection("domains")
      .doc(domain);
    batch.delete(userDomainRef);

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
