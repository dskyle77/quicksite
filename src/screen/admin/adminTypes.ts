// src/screen/admin/adminTypes.ts

export type PlanType = "free" | "basic" | "growth" | "pro";

export interface AdminUser {
  uid: string;
  displayName: string;
  email: string;
  plan: PlanType;
  siteCount: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  isAdmin: boolean;
}

export interface AdminSite {
  id: string;
  name: string;
  slug: string;
  uid: string;
  status: string;
  visits: number;
  plan: string;
  createdAt: string;
  customDomain: string | null;
}

export interface AdminDomain {
  id: string;
  uid: string;
  domain: string;
  siteId: string;
  siteName: string;
  /** Site slug — migrated from the site doc so domains are self-contained */
  slug: string;
  linkedAt: string;
  status: string;
  vercelStatus: string;
  dnsOk: boolean;
}

export interface PricingConfig {
  [key: string]: unknown;
}

/** Server-computed aggregates for the Overview page — no full collection fetches */
export interface OverviewStats {
  totalUsers: number;
  activeUsers: number;
  totalSites: number;
  publishedSites: number;
  totalDomains: number;
  verifiedDomains: number;
  /** Estimated MRR in NGN */
  mrr: number;
  planDist: Record<string, number>;
}

export const PLAN_COLORS: Record<PlanType, string> = {
  free: "bg-slate-100 text-slate-600",
  basic: "bg-blue-100 text-blue-700",
  growth: "bg-emerald-100 text-emerald-700",
  pro: "bg-violet-100 text-violet-700",
};

export const STATUS_COLORS: Record<string, string> = {
  active: "text-emerald-600",
  draft: "text-slate-400",
  published: "text-emerald-600",
  suspended: "text-red-500",
  ACTIVE: "text-emerald-600",
  PENDING_VERIFICATION: "text-amber-500",
  ERROR: "text-red-500",
};
