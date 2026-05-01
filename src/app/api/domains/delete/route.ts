/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { adminDb } from "@/server/firebase-admin";
import { getUserFromSession } from "@/server/auth";

const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

export async function DELETE(req: Request) {
  try {
    const sessionUser = await getUserFromSession();
    if (!sessionUser || !sessionUser.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domain, siteId } = await req.json();

    if (!domain || !siteId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    // 1. Remove from Vercel Project
    await fetch(
      `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${domain}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      },
    );

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
      .doc(sessionUser.uid)
      .collection("domains")
      .doc(domain);
    batch.delete(userDomainRef);

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
