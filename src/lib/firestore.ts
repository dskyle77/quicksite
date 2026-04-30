/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/firestore.ts
// ─────────────────────────────────────────────────────────────────────────────
// READ-ONLY Firestore operations. Safe to import from client components.
// All write operations live in src/server/firestore.ts
// ─────────────────────────────────────────────────────────────────────────────

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { getSiteLimit } from "@/lib/plans";
import type {
  UserProfile,
  Site,
  DashboardStats,
  AnalyticsEvent,
  AnalyticsEventType,
} from "@/lib/types";
import type { Plan } from "@/lib/plans";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Converts Firestore Timestamps to ISO strings so data is serializable
 * for Next.js Client Components.
 */
function serializeData<T>(data: any): T {
  if (!data) return data;

  const serialized = { ...data };

  Object.keys(serialized).forEach((key) => {
    const value = serialized[key];
    if (
      value &&
      typeof value === "object" &&
      typeof value.toDate === "function"
    ) {
      serialized[key] = value.toDate().toISOString();
    } else if (Array.isArray(value)) {
      serialized[key] = value.map((item) =>
        typeof item === "object" ? serializeData(item) : item,
      );
    }
  });

  return serialized as T;
}

// ── User Profile ──────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return serializeData<UserProfile>(snap.data());
}

export async function createOrUpdateUserProfile(uid: string, data: any) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    // INITIAL SIGN UP: Set everything
    await setDoc(userRef, {
      uid,
      email: data.email,
      displayName: data.displayName || "",
      photoURL: data.photoURL || "",
      phoneNumber: data.phoneNumber || "",
      defaultMessage:
        data.defaultMessage || "Hi! I'm interested in your services.",
      plan: "free", // Hardcoded safe default
      siteCount: 0, // Hardcoded safe default
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    // PROFILE UPDATE: Only allow specific fields
    // We ignore 'plan' and 'siteCount' entirely here
    await updateDoc(userRef, {
      displayName: data.displayName ?? snap.data().displayName,
      photoURL: data.photoURL ?? snap.data().photoURL,
      phoneNumber: data.phoneNumber ?? snap.data().phoneNumber,
      defaultMessage: data.defaultMessage ?? snap.data().defaultMessage,
      updatedAt: serverTimestamp(),
    });
  }
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<UserProfile, "uid" | "createdAt" | "updatedAt">>,
): Promise<void> {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function uploadProfilePhoto(
  uid: string,
  file: File,
): Promise<string> {
  const storageRef = ref(storage, `profile-photos/${uid}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ── Sites (read-only) ─────────────────────────────────────────────────────────

export async function getUserSites(uid: string): Promise<Site[]> {
  const q = query(collection(db, "sites"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => serializeData<Site>({ id: d.id, ...d.data() }));
}

export async function getSite(siteId: string): Promise<Site | null> {
  if (!siteId) return null;
  const snap = await getDoc(doc(db, "sites", siteId));
  if (!snap.exists()) return null;
  return serializeData<Site>({ id: snap.id, ...snap.data() });
}

/**
 * PUBLIC: Fetches a published site by slug only. No uid required.
 * Used on the public /s/[slug] page.
 */
export async function getSiteBySlug(slug: string): Promise<Site | null> {
  if (!slug) return null;

  const q = query(
    collection(db, "sites"),
    where("slug", "==", slug),
    where("status", "==", "published"),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;

  const d = snap.docs[0];
  return serializeData<Site>({ id: d.id, ...d.data() });
}
/**
 * PUBLIC: Fetches a published site by its custom domain.
 * Used by middleware to route custom domain traffic.
 */
export async function getSiteByDomain(domain: string): Promise<Site | null> {
  if (!domain) return null;

  // We query the 'sites' collection for a matching 'customDomain' field
  const q = query(
    collection(db, "sites"),
    where("customDomain", "==", domain),
    where("status", "==", "published"),
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  const d = snap.docs[0];
  return serializeData<Site>({ id: d.id, ...d.data() });
}
/**
 * PRIVATE: Fetches a site by slug for the owner (uid required).
 * Used in the editor. Returns draft or published.
 */
export async function getPrivateSiteBySlug(
  uid: string,
  slug: string,
): Promise<Site | null> {
  if (!slug || !uid) return null;

  const q = query(
    collection(db, "sites"),
    where("slug", "==", slug),
    where("uid", "==", uid),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;

  const d = snap.docs[0];
  return serializeData<Site>({ id: d.id, ...d.data() });
}

/**
 * Returns the site limit for a user based on their plan.
 * Uses PLAN_LIMITS as the single source of truth.
 */
export async function getUserSiteLimit(uid: string): Promise<number> {
  const profile = await getUserProfile(uid);
  if (!profile) return getSiteLimit("free");
  return getSiteLimit((profile.plan ?? "free") as Plan);
}

export async function getUserSitesCount(uid: string): Promise<number> {
  const q = query(collection(db, "sites"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.size;
}

/**
 * Find a siteId (doc.id) for a slug, optionally filtered by UID.
 */
export async function getSiteIdBySlug(
  slug: string,
  uid?: string,
): Promise<string | null> {
  const q = uid
    ? query(
        collection(db, "sites"),
        where("slug", "==", slug),
        where("uid", "==", uid),
      )
    : query(collection(db, "sites"), where("slug", "==", slug));

  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].id;
}

export async function isSlugTaken(
  slug: string,
  excludeSiteId?: string,
): Promise<boolean> {
  const q = query(collection(db, "sites"), where("slug", "==", slug));
  const snap = await getDocs(q);
  return snap.docs.some((d) => d.id !== excludeSiteId);
}

// ── Analytics (read-only) ─────────────────────────────────────────────────────

export async function getDashboardStats(uid: string): Promise<DashboardStats> {
  const sites = await getUserSites(uid);
  const siteLimit = await getUserSiteLimit(uid);
  return {
    totalVisits: sites.reduce((a, s) => a + (s.visits ?? 0), 0),
    totalWhatsappClicks: sites.reduce((a, s) => a + (s.whatsappClicks ?? 0), 0),
    totalSites: sites.length,
    sitesLeft: Math.max(siteLimit - sites.length, 0),
  };
}

export async function getAnalyticsEventsForUser(
  uid: string,
): Promise<AnalyticsEvent[]> {
  const q = query(collection(db, "analytics_events"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) =>
    serializeData<AnalyticsEvent>({ id: d.id, ...d.data() }),
  );
}
