import "server-only"

import dns from "node:dns/promises";
import { adminDb } from "./firebase-admin";

const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

export async function verifyDomain(domain: string) {
  const cleanDomain = domain.toLowerCase().trim();

  // 1. If it's a vercel.app domain, we don't need to check DNS
  // Vercel handles these automatically, so we mark it as valid immediately.
  if (cleanDomain.endsWith(".vercel.app")) {
    return {
      isValid: true,
      found: ["Vercel Internal Routing"],
    };
  }

  // 2. For custom domains (mysite.com), perform the A Record check
  const aRecords: string[] = await dns.resolve4(cleanDomain).catch(() => []);
  const targetIp = "76.76.21.21";
  const isValid = aRecords.includes(targetIp);

  return {
    isValid,
    found: aRecords,
  };
}

export async function deleteDomainForUser({
  uid,
  domain,
  siteId,
}: {
  uid: string;
  domain: string;
  siteId: string;
}) {
  // ✅ Ownership check — confirm domain belongs to this user before touching anything
  const userDomainRef = adminDb
    .collection("users")
    .doc(uid)
    .collection("domains")
    .doc(domain);

  const domainDoc = await userDomainRef.get();
  if (!domainDoc.exists) {
    return { error: "Domain not found or not owned by user", status: 403 };
  }

  // ✅ Attempt Vercel removal, log but don't hard-fail if it errors
  const vercelRes = await fetch(
    `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${domain}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    },
  );
  if (!vercelRes.ok) {
    console.warn(
      `Vercel domain removal failed for ${domain}:`,
      await vercelRes.text(),
    );
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

  return { success: true };
}
