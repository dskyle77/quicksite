/* eslint-disable @typescript-eslint/no-explicit-any */
// src/server/firestore.ts

import { adminDb } from "./firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { getSiteLimit } from "@/lib/plans";
import type { Site, AnalyticsEventType } from "@/lib/types";
import type { Plan } from "@/lib/plans";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getSiteCount(uid: string): Promise<number> {
  const userDoc = await adminDb.collection("users").doc(uid).get();

  if (!userDoc.exists) {
    return 0;
  }
  return userDoc.data()?.siteCount || 0;
}

async function assertSiteOwner(siteId: string, uid: string): Promise<any> {
  const doc = await adminDb.collection("sites").doc(siteId).get();
  if (!doc.exists) throw new Error("Site not found.");
  if (doc.data()?.uid !== uid) throw new Error("Permission denied.");
  return doc.data();
}

// ── Sites ─────────────────────────────────────────────────────────────────────

export async function serverCreateSite(
  uid: string,
  plan: Plan,
  data: Omit<
    Site,
    "id" | "uid" | "visits" | "whatsappClicks" | "createdAt" | "updatedAt"
  >,
): Promise<string> {
  const [currentCount, slugTaken] = await Promise.all([
    getSiteCount(uid),
    checkSlugTaken(data.slug),
  ]);

  const limit = getSiteLimit(plan);

  if (currentCount >= limit) {
    throw new Error(
      `Plan limit reached. Your ${plan} plan allows ${limit} site${limit === 1 ? "" : "s"}.`,
    );
  }

  if (slugTaken) {
    throw new Error("That URL slug is already taken. Please choose another.");
  }

  const newRef = adminDb.collection("sites").doc();
  const userRef = adminDb.collection("users").doc(uid);

  // We use a writeBatch to ensure both the site creation AND
  // the user's siteCount update happen together (or not at all).
  const batch = adminDb.batch();

  batch.set(newRef, {
    uid,
    visits: 0,
    whatsappClicks: 0,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    ...data,
  });

  // This ensures your Security Rules function (getUserSiteCount)
  // actually has a value to look at!
  batch.update(userRef, {
    siteCount: FieldValue.increment(1),
    updatedAt: FieldValue.serverTimestamp(),
  });

  await batch.commit();

  return newRef.id;
}

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

export async function serverUpdateSiteBySlug(
  uid: string,
  slug: string,
  data: Partial<Omit<Site, "id" | "uid" | "createdAt">>,
): Promise<void> {
  const snap = await adminDb
    .collection("sites")
    .where("slug", "==", slug)
    .where("uid", "==", uid)
    .limit(1)
    .get();

  if (snap.empty) throw new Error("Site not found.");

  await snap.docs[0].ref.update({
    ...data,
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
  // 1. Verify ownership first
  await assertSiteOwner(siteId, uid);

  const siteRef = adminDb.collection("sites").doc(siteId);
  const userRef = adminDb.collection("users").doc(uid);

  // 2. Initialize a batch
  const batch = adminDb.batch();

  // 3. Queue the delete operation
  batch.delete(siteRef);

  // 4. Queue the decrement operation
  batch.update(userRef, {
    siteCount: FieldValue.increment(-1),
    updatedAt: FieldValue.serverTimestamp(),
  });

  // 5. Commit both at once
  await batch.commit();
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export async function serverTrackSiteEvent(
  siteId: string,
  uid: string,
  slug: string,
  type: AnalyticsEventType,
): Promise<void> {
  await assertSiteOwner(siteId, uid);

  const metricField = type === "visit" ? "visits" : "whatsappClicks";

  await adminDb
    .collection("sites")
    .doc(siteId)
    .update({
      [metricField]: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    });

  await adminDb.collection("analytics_events").add({
    uid,
    siteId,
    siteSlug: slug,
    type,
    createdAt: FieldValue.serverTimestamp(),
  });
}

// ── Slug check ────────────────────────────────────────────────────────────────

export async function checkSlugTaken(
  slug: string,
  excludeSiteId?: string,
): Promise<boolean> {
  const snap = await adminDb
    .collection("sites")
    .where("slug", "==", slug)
    .get();

  return snap.docs.some((d) => d.id !== excludeSiteId);
}
