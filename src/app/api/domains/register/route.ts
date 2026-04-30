/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/domains/register/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/server/firebase-admin";

const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

export async function POST(req: Request) {
  try {
    const { siteId, domain, uid } = await req.json();

    // 1. Verify user owns the site in Firestore
    const siteRef = adminDb.collection("sites").doc(siteId);
    const siteSnap = await siteRef.get();
    
    if (!siteSnap.exists || siteSnap.data()?.uid !== uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Call Vercel API to add the domain to your project
    const vercelRes = await fetch(
      `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: domain }),
      }
    );

    const vercelData = await vercelRes.json();
    if (vercelData.error) {
      return NextResponse.json({ error: vercelData.error.message }, { status: 400 });
    }

    // 3. Update Firestore with the custom domain
    await siteRef.update({ 
      customDomain: domain,
      updatedAt: new Date().toISOString() 
    });

    return NextResponse.json({ success: true, vercelData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}