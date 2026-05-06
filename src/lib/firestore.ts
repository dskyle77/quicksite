/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/firestore.ts

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
import { db } from "@/lib/firebase";
import { getSiteLimit } from "@/lib/plans";
import type { UserProfile, Site, DashboardStats } from "@/lib/types";
import type { Plan } from "@/lib/plans";

// ── Helpers ───────────────────────────────────────────────────────────────────

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

/**
 * INITIAL SIGN UP: Creates the user document.
 * Only called once when the user first authenticates.
 */
export async function createUserProfile(uid: string, data: any): Promise<void> {
  const userRef = doc(db, "users", uid);

  await setDoc(userRef, {
    uid,
    email: data.email,
    displayName: data.displayName || "",
    photoURL: data.photoURL || "",
    phoneNumber: data.phoneNumber || "",
    defaultMessage:
      data.defaultMessage || "Hi! I'm interested in your services.",
    plan: "free", // Hardcoded default
    siteCount: 0, // Hardcoded default
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * PROFILE UPDATE: Updates existing user data.
 * Does not touch 'plan', 'siteCount', or 'createdAt'.
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<
    Omit<UserProfile, "uid" | "plan" | "siteCount" | "createdAt" | "updatedAt">
  >,
): Promise<void> {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function checkIsAdmin(uid: string): Promise<boolean> {
  if (!uid) return false;
  const snap = await getDoc(doc(db, "users", uid));
  return !!snap.data()?.isAdmin;
}

// ── Sites (read-only) ─────────────────────────────────────────────────────────

export async function getUserSites(uid: string): Promise<Site[]> {
  const q = query(collection(db, "sites"), where("uid", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => serializeData<Site>({ id: d.id, ...d.data() }));
}

// src/lib/firestore.ts

/**
 * PUBLIC: Fetches a site.
 * Priority 1: Document ID (Slug)
 * Priority 2: customDomain field
 */
export async function getSiteByLookup(
  identifier: string,
): Promise<Site | null> {
  if (!identifier) return null;
  const clean = identifier.toLowerCase();

  // Try Slug (ID)
  const snap = await getDoc(doc(db, "sites", clean));
  if (snap.exists() && snap.data().status === "published") {
    return serializeData<Site>({ id: snap.id, ...snap.data() });
  }

  // Try Domain (Field)
  const q = query(
    collection(db, "sites"),
    where("customDomain", "==", clean),
    where("status", "==", "published"),
  );
  const querySnap = await getDocs(q);

  if (!querySnap.empty) {
    const d = querySnap.docs[0];
    return serializeData<Site>({ id: d.id, ...d.data() });
  }

  return null;
}

/**
 * PRIVATE: Editor fetch
 */
export async function getPrivateSite(
  uid: string,
  slug: string,
): Promise<Site | null> {
  const snap = await getDoc(doc(db, "sites", slug.toLowerCase()));
  if (!snap.exists() || snap.data().uid !== uid) return null;
  return serializeData<Site>({ id: snap.id, ...snap.data() });
}

/**
 * Validates if a slug/domain is available.
 * Checks both Document IDs and the customDomain field.
 */
export async function isIdentifierTaken(
  identifier: string,
  excludeSiteId?: string,
): Promise<boolean> {
  const cleanId = identifier.toLowerCase();

  // 1. Check if an ID already exists
  const directSnap = await getDoc(doc(db, "sites", cleanId));
  if (directSnap.exists() && directSnap.id !== excludeSiteId) return true;

  // 2. Check if a customDomain field matches
  const q = query(
    collection(db, "sites"),
    where("customDomain", "==", cleanId),
  );
  const snap = await getDocs(q);
  return snap.docs.some((d) => d.id !== excludeSiteId);
}

// ── Dashboard & Limits ────────────────────────────────────────────────────────

export async function getUserSiteLimit(uid: string): Promise<number> {
  const profile = await getUserProfile(uid);
  return getSiteLimit((profile?.plan ?? "free") as Plan);
}
