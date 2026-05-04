/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/domains/register/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/server/firebase-admin";
import { getUserFromSession } from "@/server/auth";
import { getUserPlan } from "@/server/firestore";

const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

// Helper to detect vercel.app domains
function isVercelAppDomain(domain: string): boolean {
  return domain.endsWith(".vercel.app");
}

async function isAdminUser(uid: string): Promise<boolean> {
  // Fetch the user doc from Firestore and check the isAdmin property
  const userDoc = await adminDb.collection("users").doc(uid).get();
  return !!userDoc.data()?.isAdmin;
}

export async function POST(req: Request) {
  try {
    // Authenticate and get user information from session
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { siteId, domain } = await req.json();
    const cleanDomain = domain.toLowerCase().trim();

    // Only admins can add .vercel.app domains
    if (isVercelAppDomain(cleanDomain)) {
      const admin = await isAdminUser(user.uid);
      if (!admin) {
        return NextResponse.json(
          {
            error: "You cannot add this domain type",
          },
          { status: 403 },
        );
      }
    }

    // 1. Ownership & Site Check
    const siteRef = adminDb.collection("sites").doc(siteId);
    const siteSnap = await siteRef.get();

    if (!siteSnap.exists || siteSnap.data()?.uid !== user.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1b. Plan Check: Use getUserPlan helper
    const plan = await getUserPlan(user.uid);

    if (plan === "free") {
      return NextResponse.json(
        {
          error:
            "Custom domains are not available on the free plan. Please upgrade your subscription.",
        },
        { status: 403 },
      );
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
      // Suppress Vercel project access error for "*.v.vercel.app" domains with a generic message
      const projectAccessErrorMatch =
        typeof vercelData.error?.message === "string" &&
        vercelData.error.message.includes("does not have access to") &&
        vercelData.error.message.includes("vercel.app");

      if (errorCode === "domain_taken" || errorCode === "conflict") {
        return NextResponse.json(
          { error: "This domain is already in use elsewhere." },
          { status: 400 },
        );
      }

      if (projectAccessErrorMatch) {
        return NextResponse.json(
          {
            error:
              "Failed to connect this domain. Please check your custom domain and try again or contact support.",
          },
          { status: 400 },
        );
      }

      // Other errors: fallback to a less revealing, generic message
      return NextResponse.json(
        {
          error:
            "Failed to connect domain. Please check the domain or try again later.",
        },
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
      .doc(user.uid)
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
    // Fallback: Hide internal errors with a generic message
    return NextResponse.json(
      {
        error:
          "Something went wrong while connecting your domain. Please try again later.",
      },
      { status: 500 },
    );
  }
}

/**
 * Recommended for maintainability:
 * - Move plan-checking logic to a helper, e.g., `getUserPlan(uid: string): Promise<Plan>`
 * - (If needed elsewhere:) Move site ownership check to a shared utility.
 */
