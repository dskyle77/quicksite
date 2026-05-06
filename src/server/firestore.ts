/* eslint-disable @typescript-eslint/no-explicit-any */
// src/server/firestore.ts

import { adminDb } from "./firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { getSiteLimit } from "@/lib/plans";
import type { Site } from "@/lib/types";
import type { Plan } from "@/lib/plans";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getSiteCount(uid: string): Promise<number> {
  const userDoc = await adminDb.collection("users").doc(uid).get();
  return userDoc.data()?.siteCount || 0;
}
/**
 * Returns the user's plan as a string (e.g., "free", "pro", etc.).
 * Defaults to "free" if not set.
 */
export async function getUserPlan(uid: string): Promise<string> {
  const userDoc = await adminDb.collection("users").doc(uid).get();
  const plan = userDoc.data()?.plan;
  return typeof plan === "string" ? plan : "free";
}

async function assertSiteOwner(siteId: string, uid: string): Promise<any> {
  const doc = await adminDb.collection("sites").doc(siteId).get();
  if (!doc.exists) throw new Error("Site not found.");
  if (doc.data()?.uid !== uid) throw new Error("Permission denied.");
  return doc.data();
}

/**
 * Checks if a slug is used as a Doc ID OR if a domain is used in any field.
 */
export async function isIdentifierTaken(
  identifier: string,
  excludeSiteId?: string,
): Promise<boolean> {
  const clean = identifier.trim().toLowerCase();

  // 1. Check if ID exists (Slug)
  const idDoc = await adminDb.collection("sites").doc(clean).get();
  if (idDoc.exists && idDoc.id !== excludeSiteId) return true;

  // 2. Check if customDomain field exists
  const domainSnap = await adminDb
    .collection("sites")
    .where("customDomain", "==", clean)
    .get();

  return domainSnap.docs.some((d) => d.id !== excludeSiteId);
}

// ── Sites ─────────────────────────────────────────────────────────────────────

export async function serverCreateSite(
  uid: string,
  plan: Plan,
  data: Omit<
    Site,
    "id" | "uid" | "visits" | "whatsappClicks" | "createdAt" | "updatedAt"
  > & { slug: string },
): Promise<string> {
  const slug = data.slug.trim().toLowerCase();

  const currentCount = await getSiteCount(uid);

  if (currentCount >= getSiteLimit(plan))
    throw new Error("Plan limit reached.");
  if (await isIdentifierTaken(slug)) throw new Error("URL already taken.");

  const batch = adminDb.batch();
  const siteRef = adminDb.collection("sites").doc(slug);

  batch.set(siteRef, {
    ...data,
    uid,
    slug,
    customDomain: null,
    visits: 0,
    whatsappClicks: 0,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  batch.update(adminDb.collection("users").doc(uid), {
    siteCount: FieldValue.increment(1),
    updatedAt: FieldValue.serverTimestamp(),
  });

  await batch.commit();
  return slug;
}

/**
 * Change the Slug (Requires Doc Copy/Delete)
 */
export async function serverRenameSlug(
  oldSlug: string,
  uid: string,
  newSlug: string,
): Promise<string> {
  const normalizedNew = newSlug.trim().toLowerCase();
  if (await isIdentifierTaken(normalizedNew)) throw new Error("Slug taken.");

  const oldRef = adminDb.collection("sites").doc(oldSlug);
  const oldDoc = await oldRef.get();

  if (!oldDoc.exists || oldDoc.data()?.uid !== uid)
    throw new Error("Unauthorized.");

  const batch = adminDb.batch();
  const newRef = adminDb.collection("sites").doc(normalizedNew);

  batch.set(newRef, {
    ...oldDoc.data(),
    slug: normalizedNew,
    updatedAt: FieldValue.serverTimestamp(),
  });
  batch.delete(oldRef);

  await batch.commit();
  return normalizedNew;
}
/**
 * Standard update for site content/settings (non-ID changes).
 */
export async function serverUpdateSite(
  siteId: string,
  uid: string,
  data: Partial<Omit<Site, "id" | "uid" | "createdAt">>,
): Promise<void> {
  await assertSiteOwner(siteId, uid);

  await adminDb
    .collection("sites")
    .doc(siteId)
    .update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
}
/**
 * Update Custom Domain (Field Update Only)
 */
export async function serverUpdateDomain(
  siteId: string,
  uid: string,
  domain: string | null,
): Promise<void> {
  await assertSiteOwner(siteId, uid);

  if (domain && (await isIdentifierTaken(domain, siteId))) {
    throw new Error("Domain already in use.");
  }

  await adminDb
    .collection("sites")
    .doc(siteId)
    .update({
      customDomain: domain ? domain.trim().toLowerCase() : null,
      updatedAt: FieldValue.serverTimestamp(),
    });
}
export async function serverToggleSiteStatus(
  siteId: string,
  uid: string,
): Promise<"published" | "draft"> {
  const siteData = await assertSiteOwner(siteId, uid);
  const nextStatus = siteData.status === "published" ? "draft" : "published";

  await adminDb.collection("sites").doc(siteId).update({
    status: nextStatus,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return nextStatus;
}

export async function serverDeleteSite(
  siteId: string,
  uid: string,
): Promise<void> {
  await assertSiteOwner(siteId, uid);

  const siteRef = adminDb.collection("sites").doc(siteId);
  const userRef = adminDb.collection("users").doc(uid);
  const batch = adminDb.batch();

  batch.delete(siteRef);
  batch.update(userRef, {
    siteCount: FieldValue.increment(-1),
    updatedAt: FieldValue.serverTimestamp(),
  });

  await batch.commit();
}
