/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminDb } from "@/server/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import type {
  AdminUser,
  AdminSite,
  AdminDomain,
  PricingConfig,
} from "@/screen/admin/adminTypes";

// ── Serialization helper ──────────────────────────────────────────────────────

function serializeDoc(data: any): any {
  if (!data) return data;
  const result = { ...data };
  for (const key of Object.keys(result)) {
    const val = result[key];
    if (val && typeof val === "object" && typeof val.toDate === "function") {
      result[key] = val.toDate().toISOString();
    } else if (val && typeof val === "object" && !Array.isArray(val)) {
      result[key] = serializeDoc(val);
    }
  }
  return result;
}

// ── Users ─────────────────────────────────────────────────────────────────────

const USERS_PAGE_SIZE = 20;

export async function getAllUsers(
  cursor?: string,
  pageSize = USERS_PAGE_SIZE,
): Promise<{ users: AdminUser[]; nextCursor: string | null }> {
  let q = adminDb
    .collection("users")
    .orderBy("createdAt", "desc")
    .limit(pageSize + 1); // fetch one extra to detect next page

  if (cursor) {
    // cursor is an ISO string — convert back to a Firestore Timestamp-comparable value
    const cursorDoc = await adminDb.collection("users").doc(cursor).get();
    if (cursorDoc.exists) {
      q = q.startAfter(cursorDoc);
    }
  }

  const snap = await q.get();
  const docs = snap.docs.slice(0, pageSize);
  const hasMore = snap.docs.length > pageSize;

  const users: AdminUser[] = docs.map((d) => {
    const data = serializeDoc(d.data());
    return {
      uid: d.id,
      displayName: data.displayName || "",
      email: data.email || "",
      plan: data.plan || "free",
      siteCount: data.siteCount || 0,
      createdAt: data.createdAt || "",
      updatedAt: data.updatedAt || "",
      status: data.status || "active",
      isAdmin: data.isAdmin || false,
    } as AdminUser;
  });

  return {
    users,
    nextCursor: hasMore ? docs[docs.length - 1].id : null,
  };
}

// Keep a simple "get all" for the overview stats (just UIDs + plan, lightweight)
export async function getAllUsersSummary(): Promise<
  Pick<AdminUser, "uid" | "plan" | "status">[]
> {
  const snap = await adminDb.collection("users").select("plan", "status").get();
  return snap.docs.map((d) => ({
    uid: d.id,
    plan: d.data().plan || "free",
    status: d.data().status || "active",
  }));
}

export async function updateUserPlan(uid: string, plan: string): Promise<void> {
  await adminDb.collection("users").doc(uid).update({ plan });
}

export async function updateUserStatus(
  uid: string,
  status: string,
): Promise<void> {
  await adminDb.collection("users").doc(uid).update({ status });
}

export async function checkIsAdmin(uid: string): Promise<boolean> {
  if (!uid) return false;
  const userDoc = await adminDb.collection("users").doc(uid).get();
  const data = userDoc.data();
  return !!data?.isAdmin;
}

// ── Sites ─────────────────────────────────────────────────────────────────────

export async function getAllSites(): Promise<AdminSite[]> {
  const snap = await adminDb
    .collection("sites")
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map((d) => {
    const data = serializeDoc(d.data());
    return {
      id: d.id,
      name: data.name || "",
      slug: data.slug || "",
      uid: data.uid || "",
      status: data.status || "draft",
      visits: data.visits || 0,
      plan: data.plan || "free",
      createdAt: data.createdAt || "",
      customDomain: data.customDomain || null,
    } as AdminSite;
  });
}
/**
 * Admin-only site deletion — no ownership check.
 * Deletes the site and decrements the owner's siteCount.
 * Call this from admin API routes only.
 */
export async function adminDeleteSite(siteId: string): Promise<void> {
  const siteRef = adminDb.collection("sites").doc(siteId);
  const siteSnap = await siteRef.get();

  if (!siteSnap.exists) throw new Error("Site not found.");

  const ownerUid = siteSnap.data()?.uid as string | undefined;

  const batch = adminDb.batch();
  batch.delete(siteRef);

  if (ownerUid) {
    const userRef = adminDb.collection("users").doc(ownerUid);
    batch.update(userRef, {
      siteCount: FieldValue.increment(-1),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
}

// ── Domains ───────────────────────────────────────────────────────────────────

export async function getAllDomains(): Promise<AdminDomain[]> {
  const usersSnap = await adminDb.collection("users").get();
  const domains: AdminDomain[] = [];

  await Promise.all(
    usersSnap.docs.map(async (userDoc) => {
      const domSnap = await userDoc.ref.collection("domains").get();
      domSnap.docs.forEach((d) => {
        const data = serializeDoc(d.data());
        domains.push({
          id: d.id,
          uid: userDoc.id,
          domain: data.domain || "",
          siteId: data.siteId || "",
          siteName: data.siteName || "",
          linkedAt: data.linkedAt || "",
          status: data.status || "active",
          vercelStatus: data.vercelStatus || "PENDING_VERIFICATION",
          dnsOk: data.dnsOk || false,
        } as AdminDomain);
      });
    }),
  );

  return domains;
}

// ── Pricing ───────────────────────────────────────────────────────────────────

export async function getPricing(): Promise<PricingConfig | null> {
  const doc = await adminDb.collection("config").doc("pricing").get();
  return doc.exists ? (doc.data() as PricingConfig) : null;
}

export async function savePricing(pricing: PricingConfig): Promise<void> {
  await adminDb.collection("config").doc("pricing").set(pricing);
}
