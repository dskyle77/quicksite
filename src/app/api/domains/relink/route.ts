/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { adminDb } from "@/server/firebase-admin";
import { getUserFromSession } from "@/server/auth";
import { getUserPlan } from "@/server/firestore";

export async function POST(req: Request) {
  try {
    // Authenticate user from session (not client-supplied uid)
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { domain, newSiteId } = await req.json();

    if (!domain || !newSiteId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // Check user's plan -- free users can't use custom domains
    const plan = await getUserPlan(user.uid);
    if (plan === "free") {
      return NextResponse.json(
        {
          error:
            "Custom domains are not available on the free plan. Please upgrade your subscription.",
        },
        { status: 403 }
      );
    }

    // 1. Find the NEW site and verify ownership
    const newSiteRef = adminDb.collection("sites").doc(newSiteId);
    const newSiteSnap = await newSiteRef.get();

    if (!newSiteSnap.exists || newSiteSnap.data()?.uid !== user.uid) {
      return NextResponse.json(
        { error: "Unauthorized or site not found" },
        { status: 401 }
      );
    }

    // 2. Find any OLD site currently using this domain to clean it up
    const sitesQuery = await adminDb
      .collection("sites")
      .where("customDomain", "==", domain)
      .get();

    const batch = adminDb.batch();

    // 3. Remove domain from old site(s)
    sitesQuery.forEach((doc) => {
      batch.update(doc.ref, {
        customDomain: null,
        updatedAt: new Date().toISOString(),
      });
    });

    // 4. Update the NEW site
    batch.update(newSiteRef, {
      customDomain: domain,
      updatedAt: new Date().toISOString(),
    });

    // 5. Update the User's domain management record
    const userDomainRef = adminDb
      .collection("users")
      .doc(user.uid)
      .collection("domains")
      .doc(domain);

    batch.update(userDomainRef, {
      siteId: newSiteId,
      siteName: newSiteSnap.data()?.name || "Untitled Site",
      linkedAt: new Date().toISOString(),
    });

    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
