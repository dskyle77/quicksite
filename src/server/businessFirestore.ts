// src/server/businessFirestore.ts
import "server-only";
import { cache } from "react";
import { adminDb } from "@/server/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import type { BusinessProfile, DirectoryFilters } from "@/lib/business";

function serializeDoc(data: Record<string, unknown>): Record<string, unknown> {
  if (!data) return data;
  const result = { ...data };
  for (const key of Object.keys(result)) {
    const val = result[key];
    if (
      val &&
      typeof val === "object" &&
      typeof (val as { toDate?: () => Date }).toDate === "function"
    ) {
      result[key] = (val as { toDate: () => Date }).toDate().toISOString();
    } else if (val && typeof val === "object" && !Array.isArray(val)) {
      result[key] = serializeDoc(val as Record<string, unknown>);
    }
  }
  return result;
}

// ── Create business profile ───────────────────────────────────────────────────

export async function createBusinessProfile(
  uid: string,
  data: Omit<
    BusinessProfile,
    "id" | "uid" | "createdAt" | "updatedAt" | "profileViews" | "whatsappClicks"
  >,
): Promise<string> {
  const slug = data.slug.trim().toLowerCase();

  const existing = await adminDb.collection("businesses").doc(slug).get();
  if (existing.exists) throw new Error("This business URL is already taken.");

  await adminDb
    .collection("businesses")
    .doc(slug)
    .set({
      ...data,
      uid,
      slug,
      profileViews: 0,
      whatsappClicks: 0,
      isVerified: false,
      isFeatured: false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

  await adminDb.collection("users").doc(uid).update({
    hasBusinessProfile: true,
    businessSlug: slug,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return slug;
}

// ── Get business profile by slug ──────────────────────────────────────────────

export const getBusinessProfile = cache(async function (
  slug: string,
): Promise<BusinessProfile | null> {
  const doc = await adminDb
    .collection("businesses")
    .doc(slug.toLowerCase())
    .get();
  if (!doc.exists) return null;
  return serializeDoc({
    id: doc.id,
    ...doc.data(),
  }) as unknown as BusinessProfile;
});

// ── Get business profile by user UID ─────────────────────────────────────────

export const getBusinessProfileByUid = cache(async function (
  uid: string,
): Promise<BusinessProfile | null> {
  const snap = await adminDb
    .collection("businesses")
    .where("uid", "==", uid)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return serializeDoc({
    id: doc.id,
    ...doc.data(),
  }) as unknown as BusinessProfile;
});

// ── Update business profile ───────────────────────────────────────────────────

export async function updateBusinessProfile(
  slug: string,
  uid: string,
  data: Partial<BusinessProfile>,
): Promise<void> {
  const doc = await adminDb.collection("businesses").doc(slug).get();
  if (!doc.exists) throw new Error("Business profile not found.");
  const bizData = doc.data();
  if (bizData?.uid !== uid) throw new Error("Permission denied.");

  // ── RATE LIMIT CHECK ────────────────────────────────────────────────────────
  
  // 1. Get user plan
  const userDoc = await adminDb.collection("users").doc(uid).get();
  const plan = userDoc.data()?.plan || "free";
  const isPaid = plan === "growth" || plan === "pro";

  // 2. Get last edit time
  const lastEdit = bizData?.lastProfileEditAt;
  if (lastEdit) {
    const lastEditDate = (lastEdit as FirebaseFirestore.Timestamp).toDate();
    const now = new Date();
    const diffMs = now.getTime() - lastEditDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    const limitHours = isPaid ? 24 : 168; // 24 hours for paid, 168 hours (7 days) for free
    
    if (diffHours < limitHours) {
      const remainingHours = Math.ceil(limitHours - diffHours);
      if (remainingHours > 24) {
        const days = Math.ceil(remainingHours / 24);
        throw new Error(`You can update your profile again in ${days} days.`);
      }
      throw new Error(`You can update your profile again in ${remainingHours} hours.`);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────

  const {
    id: _id,
    uid: _uid,
    slug: _slug,
    createdAt: _ca,
    ...updateData
  } = data;

  await adminDb
    .collection("businesses")
    .doc(slug)
    .update({
      ...updateData,
      lastProfileEditAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
}

// ── Track profile view ────────────────────────────────────────────────────────

export async function trackBusinessProfileView(slug: string): Promise<void> {
  try {
    await adminDb
      .collection("businesses")
      .doc(slug)
      .update({
        profileViews: FieldValue.increment(1),
        lastViewedAt: FieldValue.serverTimestamp(),
      });
  } catch {
    // Silently fail
  }
}

// ── Track WhatsApp click ──────────────────────────────────────────────────────

export async function trackBusinessWhatsAppClick(slug: string): Promise<void> {
  try {
    await adminDb
      .collection("businesses")
      .doc(slug)
      .update({
        whatsappClicks: FieldValue.increment(1),
        lastClickedAt: FieldValue.serverTimestamp(),
      });
  } catch {
    // Silently fail
  }
}

// ── Directory listing (paginated + filtered) ──────────────────────────────────

const DIRECTORY_PAGE_SIZE = 24;

export async function getDirectoryListings(
  filters: DirectoryFilters,
  cursor?: string,
  pageSize = DIRECTORY_PAGE_SIZE,
): Promise<{ businesses: BusinessProfile[]; nextCursor: string | null }> {
  try {
    let q: FirebaseFirestore.Query = adminDb
      .collection("businesses")
      .where("status", "==", "active");

    const hasSpecificFilter =
      (filters.category && filters.category !== "all") ||
      filters.state ||
      filters.verified;

    if (filters.category && filters.category !== "all") {
      q = q.where("category", "==", filters.category);
    }

    if (filters.state) {
      q = q.where("state", "==", filters.state);
    }

    if (filters.featured) {
      q = q.where("isFeatured", "==", true);
    }

    if (filters.verified) {
      q = q.where("isVerified", "==", true);
    }

    if (!hasSpecificFilter) {
      q = q.orderBy("isFeatured", "desc").orderBy("createdAt", "desc");
    } else {
      q = q.orderBy("isFeatured", "desc");
    }

    q = q.limit(pageSize + 1);

    if (cursor) {
      const cursorDoc = await adminDb.collection("businesses").doc(cursor).get();
      if (cursorDoc.exists) q = q.startAfter(cursorDoc);
    }

    const snap = await q.get();
    const docs = snap.docs.slice(0, pageSize);
    const hasMore = snap.docs.length > pageSize;

    let businesses = docs.map(
      (d) => serializeDoc({ id: d.id, ...d.data() }) as unknown as BusinessProfile,
    );

    if (filters.search) {
      const searchQ = filters.search.toLowerCase();
      businesses = businesses.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQ) ||
          b.description?.toLowerCase().includes(searchQ) ||
          b.tagline?.toLowerCase().includes(searchQ) ||
          b.tags?.some((t) => t.toLowerCase().includes(searchQ)) ||
          b.state?.toLowerCase().includes(searchQ),   // ← also search state
      );
    }

    return { businesses, nextCursor: hasMore ? docs[docs.length - 1].id : null };
  } catch (err) {
    console.error("Firestore getDirectoryListings error:", err);
    return { businesses: [], nextCursor: null };
  }
}

// ── Get featured businesses ───────────────────────────────────────────────────

export const getFeaturedBusinesses = cache(async function (
  limit = 8,
): Promise<BusinessProfile[]> {
  const snap = await adminDb
    .collection("businesses")
    .where("status", "==", "active")
    .where("isFeatured", "==", true)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map(
    (d) =>
      serializeDoc({ id: d.id, ...d.data() }) as unknown as BusinessProfile,
  );
});

// ── Get businesses by category ────────────────────────────────────────────────

export const getBusinessesByCategory = cache(async function (
  category: string,
  limit = 8,
): Promise<BusinessProfile[]> {
  const snap = await adminDb
    .collection("businesses")
    .where("status", "==", "active")
    .where("category", "==", category)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snap.docs.map(
    (d) =>
      serializeDoc({ id: d.id, ...d.data() }) as unknown as BusinessProfile,
  );
});

// ── Get similar businesses ────────────────────────────────────────────────────

export const getSimilarBusinesses = cache(async function (
  category: string,
  excludeSlug: string,
  limit = 4,
): Promise<BusinessProfile[]> {
  const snap = await adminDb
    .collection("businesses")
    .where("status", "==", "active")
    .where("category", "==", category)
    .limit(limit + 1)
    .get();

  return snap.docs
    .filter((d) => d.id !== excludeSlug)
    .slice(0, limit)
    .map(
      (d) =>
        serializeDoc({ id: d.id, ...d.data() }) as unknown as BusinessProfile,
    );
});

// ── SEO: generate meta for a business ────────────────────────────────────────

export function generateBusinessSeoMeta(business: BusinessProfile) {
  const locationPart = business.city ? ` in ${business.city}` : "";
  const title =
    business.seoTitle || `${business.name}${locationPart} — Quicksite`;
  const description =
    business.seoDescription ||
    business.description ||
    `${business.name} is a verified business on Quicksite${locationPart}. Contact them directly on WhatsApp.`;

  const keywords = [
    business.name.toLowerCase(),
    business.category,
    ...(business.tags || []),
    ...(business.city ? [business.city.toLowerCase()] : []),
    "nigeria",
    "whatsapp",
  ];

  return { title, description, keywords };
}
