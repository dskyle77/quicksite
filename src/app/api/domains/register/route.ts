/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/domains/register/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/server/firebase-admin";

const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

export async function POST(req: Request) {
  try {
    const { siteId, domain, uid } = await req.json();

    if (!siteId || !domain || !uid) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

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
      },
    );

    const vercelData = await vercelRes.json();

    // Check for Vercel-specific errors
    if (!vercelRes.ok) {
      const errorCode = vercelData.error?.code;

      // Handle the "Already Used" case
      if (errorCode === "domain_taken" || errorCode === "conflict") {
        return NextResponse.json(
          {
            error:
              "This domain is already in use by another project. Please remove it from its current host first.",
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          error:
            vercelData.error?.message || "Failed to link domain with Vercel",
        },
        { status: 400 },
      );
    }

    // 3. Update Firestore with the custom domain ONLY if Vercel succeeded
    await siteRef.update({
      customDomain: domain.toLowerCase().trim(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, vercelData });
  } catch (error: any) {
    console.error("Domain Registration Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
