/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/domains/register/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/server/firebase-admin";

const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

export async function POST(req: Request) {
  try {
    const { siteId, domain, uid } = await req.json();
    const cleanDomain = domain.toLowerCase().trim();

    // 1. Ownership & Site Check
    const siteRef = adminDb.collection("sites").doc(siteId);
    const siteSnap = await siteRef.get();

    if (!siteSnap.exists || siteSnap.data()?.uid !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Call Vercel API
    const vercelRes = await fetch(
      `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: cleanDomain }),
      },
    );

    const vercelData = await vercelRes.json();

    if (!vercelRes.ok) {
      const errorCode = vercelData.error?.code;
      if (errorCode === "domain_taken" || errorCode === "conflict") {
        return NextResponse.json(
          { error: "This domain is already in use elsewhere." },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { error: vercelData.error?.message },
        { status: 400 },
      );
    }

    // 3. ATOMIC WRITE: Update Site and User Domain Management
    const batch = adminDb.batch();

    // Update the Site document
    batch.update(siteRef, {
      customDomain: cleanDomain,
      updatedAt: new Date().toISOString(),
    });

    // Create/Update the Domain in the user's management collection
    const userDomainRef = adminDb
      .collection("users")
      .doc(uid)
      .collection("domains")
      .doc(cleanDomain); // Using domain as ID prevents duplicates

    batch.set(userDomainRef, {
      domain: cleanDomain,
      siteId: siteId,
      siteName: siteSnap.data()?.name || "My Site",
      linkedAt: new Date().toISOString(),
      status: "active",
    });

    await batch.commit();

    return NextResponse.json({ success: true, vercelData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
