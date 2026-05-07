/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminDb } from "@/server/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import type {
  AdminUser,
  AdminSite,
  AdminDomain,
  PricingConfig,
  OverviewStats,
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
    .limit(pageSize + 1);

  if (cursor) {
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

// Lightweight summary for overview stats only
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

// ── Overview aggregates ───────────────────────────────────────────────────────

export async function getOverviewStats(): Promise<OverviewStats> {
  const users = await getAllUsersSummary();

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;

  const planDist = { free: 0, basic: 0, growth: 0, pro: 0 } as Record<
    string,
    number
  >;
  users.forEach((u) => {
    planDist[u.plan] = (planDist[u.plan] ?? 0) + 1;
  });

  // MRR computed from user plan counts (no full site scan needed)
  const mrr =
    (planDist.basic ?? 0) * 1500 +
    (planDist.growth ?? 0) * 4000 +
    (planDist.pro ?? 0) * 10000;

  // Cheap server-side counts via Firestore aggregation
  const [sitesCountSnap, domainsCountSnap, verifiedDomainsSnap] =
    await Promise.all([
      adminDb.collection("sites").count().get(),
      adminDb.collection("domains").count().get(),
      adminDb.collection("domains").where("dnsOk", "==", true).count().get(),
    ]);

  const publishedSitesSnap = await adminDb
    .collection("sites")
    .where("status", "==", "published")
    .count()
    .get();

  return {
    totalUsers,
    activeUsers,
    totalSites: sitesCountSnap.data().count,
    publishedSites: publishedSitesSnap.data().count,
    totalDomains: domainsCountSnap.data().count,
    verifiedDomains: verifiedDomainsSnap.data().count,
    mrr,
    planDist,
  };
}

// ── Sites (paginated + search) ────────────────────────────────────────────────

const SITES_PAGE_SIZE = 20;

export async function getSitesPaginated({
  cursor,
  search,
  statusFilter,
  pageSize = SITES_PAGE_SIZE,
}: {
  cursor?: string;
  search?: string;
  statusFilter?: string;
  pageSize?: number;
}): Promise<{ sites: AdminSite[]; nextCursor: string | null }> {
  let q: FirebaseFirestore.Query = adminDb
    .collection("sites")
    .orderBy("createdAt", "desc")
    .limit(pageSize + 1);

  if (statusFilter && statusFilter !== "all") {
    q = adminDb
      .collection("sites")
      .where("status", "==", statusFilter)
      .orderBy("createdAt", "desc")
      .limit(pageSize + 1);
  }

  // Server-side slug prefix search (Firestore range query)
  if (search) {
    const end = search + "\uf8ff";
    q = adminDb
      .collection("sites")
      .where("slug", ">=", search)
      .where("slug", "<=", end)
      .limit(pageSize + 1);
  }

  if (cursor) {
    const cursorDoc = await adminDb.collection("sites").doc(cursor).get();
    if (cursorDoc.exists) {
      q = q.startAfter(cursorDoc);
    }
  }

  const snap = await q.get();
  const docs = snap.docs.slice(0, pageSize);
  const hasMore = snap.docs.length > pageSize;

  const sites: AdminSite[] = docs.map((d) => {
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

  return {
    sites,
    nextCursor: hasMore ? docs[docs.length - 1].id : null,
  };
}

/**
 * Admin-only site deletion — no ownership check.
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

// ── Domains (top-level collection, paginated + search) ────────────────────────
// NOTE: Run migrate-domains.ts first to populate the top-level `domains` collection.

const DOMAINS_PAGE_SIZE = 20;

export async function getDomainsPaginated({
  cursor,
  search,
  pageSize = DOMAINS_PAGE_SIZE,
}: {
  cursor?: string;
  search?: string;
  pageSize?: number;
}): Promise<{ domains: AdminDomain[]; nextCursor: string | null }> {
  let q: FirebaseFirestore.Query = adminDb
    .collection("domains")
    .orderBy("linkedAt", "desc")
    .limit(pageSize + 1);

  // Server-side domain prefix search
  if (search) {
    const end = search + "\uf8ff";
    q = adminDb
      .collection("domains")
      .where("domain", ">=", search)
      .where("domain", "<=", end)
      .limit(pageSize + 1);
  }

  if (cursor) {
    const cursorDoc = await adminDb.collection("domains").doc(cursor).get();
    if (cursorDoc.exists) {
      q = q.startAfter(cursorDoc);
    }
  }

  const snap = await q.get();
  const docs = snap.docs.slice(0, pageSize);
  const hasMore = snap.docs.length > pageSize;

  const domains: AdminDomain[] = docs.map((d) => {
    const data = serializeDoc(d.data());
    return {
      id: d.id,
      uid: data.uid || "",
      domain: data.domain || "",
      siteId: data.siteId || "",
      siteName: data.siteName || "",
      slug: data.slug || "",
      linkedAt: data.linkedAt || "",
      status: data.status || "active",
      vercelStatus: data.vercelStatus || "PENDING_VERIFICATION",
      dnsOk: data.dnsOk || false,
    } as AdminDomain;
  });

  return {
    domains,
    nextCursor: hasMore ? docs[docs.length - 1].id : null,
  };
}