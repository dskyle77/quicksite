// src/server/firestore.ts
// ─────────────────────────────────────────────────────────────────────────────
// All write operations live here. Never import this file from client components.
// Auth and plan enforcement happen at this layer.
// ─────────────────────────────────────────────────────────────────────────────

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getSiteLimit } from "@/lib/plans";
import type { Site, AnalyticsEventType } from "@/lib/types";
import type { Plan } from "@/lib/plans";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getSiteCount(uid: string): Promise<number> {
  const q = query(collection(db, "sites"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.size;
}

async function assertSiteOwner(siteId: string, uid: string): Promise<void> {
  const snap = await getDoc(doc(db, "sites", siteId));
  if (!snap.exists()) throw new Error("Site not found.");
  if (snap.data().uid !== uid) throw new Error("Permission denied.");
}

// ── Sites ─────────────────────────────────────────────────────────────────────

/**
 * Create a site after verifying plan limits.
 * Returns the new site doc ID.
 */
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

  const newRef = doc(collection(db, "sites"));
  await setDoc(newRef, {
    uid,
    visits: 0,
    whatsappClicks: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...data,
  });

  return newRef.id;
}

/**
 * Update a site's content/theme/name.
 * Validates that the requesting uid owns the site.
 */
export async function serverUpdateSite(
  siteId: string,
  uid: string,
  data: Partial<Omit<Site, "id" | "uid" | "createdAt">>,
): Promise<void> {
  await assertSiteOwner(siteId, uid);

  await updateDoc(doc(db, "sites", siteId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update a site by slug.
 * Validates that the requesting uid owns the site.
 */
export async function serverUpdateSiteBySlug(
  uid: string,
  slug: string,
  data: Partial<Omit<Site, "id" | "uid" | "createdAt">>,
): Promise<void> {
  const q = query(
    collection(db, "sites"),
    where("slug", "==", slug),
    where("uid", "==", uid),
  );
  const snap = await getDocs(q);
  if (snap.empty) throw new Error("Site not found.");

  await updateDoc(doc(db, "sites", snap.docs[0].id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Toggle a site's status between "published" and "draft".
 * Validates ownership.
 */
export async function serverToggleSiteStatus(
  siteId: string,
  uid: string,
): Promise<"published" | "draft"> {
  const snap = await getDoc(doc(db, "sites", siteId));
  if (!snap.exists()) throw new Error("Site not found.");
  if (snap.data().uid !== uid) throw new Error("Permission denied.");

  const next = snap.data().status === "published" ? "draft" : "published";

  await updateDoc(doc(db, "sites", siteId), {
    status: next,
    updatedAt: serverTimestamp(),
  });

  return next;
}

/**
 * Delete a site.
 * Validates ownership.
 */
export async function serverDeleteSite(
  siteId: string,
  uid: string,
): Promise<void> {
  await assertSiteOwner(siteId, uid);
  await deleteDoc(doc(db, "sites", siteId));
}

// ── Analytics ─────────────────────────────────────────────────────────────────

/**
 * Track a site visit or whatsapp click.
 * Validates ownership before incrementing.
 */
export async function serverTrackSiteEvent(
  siteId: string,
  uid: string,
  slug: string,
  type: AnalyticsEventType,
): Promise<void> {
  await assertSiteOwner(siteId, uid);

  const metricField = type === "visit" ? "visits" : "whatsappClicks";

  await updateDoc(doc(db, "sites", siteId), {
    [metricField]: increment(1),
    updatedAt: serverTimestamp(),
  });

  const { addDoc } = await import("firebase/firestore");
  await addDoc(collection(db, "analytics_events"), {
    uid,
    siteId,
    siteSlug: slug,
    type,
    createdAt: serverTimestamp(),
  });
}

// ── Slug check ────────────────────────────────────────────────────────────────

export async function checkSlugTaken(
  slug: string,
  excludeSiteId?: string,
): Promise<boolean> {
  const q = query(collection(db, "sites"), where("slug", "==", slug));
  const snap = await getDocs(q);
  return snap.docs.some((d) => d.id !== excludeSiteId);
}
