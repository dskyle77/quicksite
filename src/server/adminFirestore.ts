/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only"
import { adminDb } from "@/server/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import type {
  AdminUser,
  AdminSite,
  AdminDomain,
  OverviewStats,
} from "@/screen/admin/adminTypes";
import type { Site } from "@/lib/types";

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

export async function getAllUsers({
  cursor,
  search,
  planFilter,
  pageSize = USERS_PAGE_SIZE,
}: {
  cursor?: string;
  search?: string;
  planFilter?: string;
  pageSize?: number;
} = {}): Promise<{ users: AdminUser[]; nextCursor: string | null }> {
  let q: FirebaseFirestore.Query = adminDb.collection("users");

  if (planFilter && planFilter !== "all") {
    q = q.where("plan", "==", planFilter);
  }

  // Server-side search (prefix)
  // Note: Firestore only supports range queries on one field at a time.
  // We prioritize email search if it looks like an email, otherwise displayName.
  if (search) {
    const term = search.toLowerCase();
    const end = term + "\uf8ff";
    
    // This is still limited because we can't easily search across both email and displayName
    // efficiently in Firestore without composite indexes or a search service.
    // For now, let's stick to email if it contains '@', otherwise displayName.
    const field = term.includes("@") ? "email" : "displayName";
    q = q.where(field, ">=", term).where(field, "<=", end);
  } else {
    q = q.orderBy("createdAt", "desc");
  }

  q = q.limit(pageSize + 1);

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

export async function getUsersByIds(uids: string[]): Promise<AdminUser[]> {
  if (uids.length === 0) return [];
  
  // Firestore IN query limit is 30
  const uniqueUids = Array.from(new Set(uids)).slice(0, 30);
  const snap = await adminDb.collection("users").where("__name__", "in", uniqueUids).get();
  
  return snap.docs.map((d) => {
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
    (planDist.growth ?? 0) * 1000 +
    (planDist.pro ?? 0) * 3000;

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

// lib/firestore-admin.ts

export async function getSiteByLookup(
  identifier: string,
): Promise<Site | null> {
  if (!identifier) return null;
  const clean = identifier.toLowerCase();

  const snap = await adminDb.collection("sites").doc(clean).get();
  if (snap.exists && snap.data()?.status === "published") {
    return { id: snap.id, ...snap.data() } as Site;
  }

  // Try custom domain
  const querySnap = await adminDb
    .collection("sites")
    .where("customDomain", "==", clean)
    .where("status", "==", "published")
    .limit(1)
    .get();

  if (!querySnap.empty) {
    const d = querySnap.docs[0];
    return { id: d.id, ...d.data() } as Site;
  }

  return null;
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
