/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/domains/register/route.ts

import { NextResponse } from "next/server";
import { adminDb } from "@/server/firebase-admin";
import { getUserFromSession } from "@/server/auth";
import { getUserPlan } from "@/server/serverFirestore";
import { verifyDomain } from "@/server/domains";
import { rateLimits, withRateLimit } from "@/server/rateLimit";

const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

// Standard regex for validating domain names (allows subdomains, enforces valid TLD extension)
const DOMAIN_REGEX =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-24]{2,63}$/;

function isVercelAppDomain(domain: string): boolean {
  return domain.endsWith(".vercel.app");
}

async function isAdminUser(uid: string): Promise<boolean> {
  const userDoc = await adminDb.collection("users").doc(uid).get();
  return !!userDoc.data()?.isAdmin;
}

async function handleDomainRegister(req: Request) {
  // 1. Authenticate user
  const user = await getUserFromSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // Rate limit
  const rlConnect = await withRateLimit(rateLimits.domains.connect, user.uid);
  if (!rlConnect.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "X-RateLimit-Reset": rlConnect.reset?.toString?.() ?? "" },
      },
    );
  }

  const rlHourly = await withRateLimit(rateLimits.domains.hourly, user.uid);
  if (!rlHourly.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "X-RateLimit-Reset": rlHourly.reset?.toString?.() ?? "" },
      },
    );
  }

  const { siteId, domain } = await req.json();

  // Sanitize the input
  if (!domain || typeof domain !== "string") {
    return NextResponse.json(
      { error: "Invalid domain payload." },
      { status: 400 },
    );
  }
  const cleanDomain = domain.toLowerCase().trim();

  // 🛑 NEW: Scrutinize the format immediately to block rubbish inputs
  if (!DOMAIN_REGEX.test(cleanDomain)) {
    return NextResponse.json(
      { error: "Please enter a valid domain name (e.g., example.com)." },
      { status: 400 },
    );
  }

  // 2. Guard against unauthorized .vercel.app usage
  if (isVercelAppDomain(cleanDomain)) {
    const admin = await isAdminUser(user.uid);
    if (!admin) {
      return NextResponse.json(
        { error: "You cannot add this domain type" },
        { status: 403 },
      );
    }
  }

  // 3. Fetch site data for ownership verification (Read-only)
  const siteRef = adminDb.collection("sites").doc(siteId);
  const siteSnap = await siteRef.get();

  if (!siteSnap.exists || siteSnap.data()?.uid !== user.uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 4. Plan Check
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

  // 5. Run local DNS verification (Now safe from gibberish inputs)
  const verifyResult = await verifyDomain(cleanDomain);
  if (!verifyResult.isValid) {
    return NextResponse.json(
      {
        error:
          "DNS check failed. Please ensure your domain points to 76.76.21.21.",
        found: verifyResult.found,
        isValid: false,
      },
      { status: 400 },
    );
  }

  // 6. Call Vercel API First
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

    return NextResponse.json(
      {
        error:
          "Failed to connect domain. Please check the domain or try again later.",
      },
      { status: 400 },
    );
  }

  // 7. Both checks passed -> Persist to Firebase
  const batch = adminDb.batch();

  batch.update(siteRef, {
    customDomain: cleanDomain,
    updatedAt: new Date().toISOString(),
  });

  const userDomainRef = adminDb
    .collection("users")
    .doc(user.uid)
    .collection("domains")
    .doc(cleanDomain);

  batch.set(userDomainRef, {
    domain: cleanDomain,
    siteId: siteId,
    siteName: siteSnap.data()?.name || "My Site",
    linkedAt: new Date().toISOString(),
    status: "active",
  });

  await batch.commit();

  return NextResponse.json({
    success: true,
    vercelData,
    found: verifyResult.found,
    isValid: verifyResult.isValid,
  });
}

export async function POST(req: Request) {
  try {
    return await handleDomainRegister(req);
  } catch (error: any) {
    console.error("Domain registration runtime error:", error);
    return NextResponse.json(
      {
        error:
          "Something went wrong while connecting your domain. Please try again later.",
      },
      { status: 500 },
    );
  }
}
