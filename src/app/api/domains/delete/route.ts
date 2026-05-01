/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { adminDb } from "@/server/firebase-admin";
import { getUserFromSession } from "@/server/auth";

const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

export async function DELETE(req: Request) {
  try {
    const sessionUser = await getUserFromSession();
    if (!sessionUser?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { domain, siteId } = await req.json();
    if (!domain || !siteId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // ✅ Ownership check — confirm domain belongs to this user before touching anything
    const userDomainRef = adminDb
      .collection("users")
      .doc(sessionUser.uid)
      .collection("domains")
      .doc(domain);

    const domainDoc = await userDomainRef.get();
    if (!domainDoc.exists) {
      return NextResponse.json({ error: "Domain not found or not owned by user" }, { status: 403 });
    }

    // ✅ Attempt Vercel removal, log but don't hard-fail if it errors
    const vercelRes = await fetch(
      `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${domain}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      }
    );
    if (!vercelRes.ok) {
      console.warn(`Vercel domain removal failed for ${domain}:`, await vercelRes.text());
      // Optionally: return an error here if you want strict consistency
    }

    // ✅ Atomic Firestore cleanup
    const batch = adminDb.batch();
    batch.update(adminDb.collection("sites").doc(siteId), {
      customDomain: null,
      updatedAt: new Date().toISOString(),
    });
    batch.delete(userDomainRef);
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
