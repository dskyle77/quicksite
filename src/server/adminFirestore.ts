/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminDb } from "@/server/firebase-admin";
import type {
  AdminUser,
  AdminSite,
  AdminDomain,
  PricingConfig,
} from "@/screen/admin/adminTypes";

// ── Users ─────────────────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<AdminUser[]> {
  const snap = await adminDb
    .collection("users")
    .orderBy("createdAt", "desc")
    .get();
  return snap.docs.map((d) => {
    const userData = d.data();
    return {
      uid: d.id,
      ...userData,
      createdAt: userData.createdAt
        ? userData.createdAt.toDate().toISOString()
        : "",
      updatedAt: userData.updatedAt
        ? userData.updatedAt.toDate().toISOString()
        : "",
    } as AdminUser;
  });
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

/**
 * Checks if the user with the given uid is an admin.
 * @param uid - User ID to check
 * @returns Promise<boolean> true if the user is admin, false otherwise
 */
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
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdminSite);
}

export async function deleteSite(siteId: string): Promise<void> {
  await adminDb.collection("sites").doc(siteId).delete();
}

// ── Domains ───────────────────────────────────────────────────────────────────

export async function getAllDomains(): Promise<AdminDomain[]> {
  const usersSnap = await adminDb.collection("users").get();
  const domains: AdminDomain[] = [];

  await Promise.all(
    usersSnap.docs.map(async (userDoc) => {
      const domSnap = await userDoc.ref.collection("domains").get();
      domSnap.docs.forEach((d) => {
        domains.push({ id: d.id, uid: userDoc.id, ...d.data() } as AdminDomain);
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
