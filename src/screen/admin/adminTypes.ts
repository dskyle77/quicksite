export type PlanType = "free" | "basic" | "growth" | "pro";

export type StatusType =
  | "active"
  | "published"
  | "suspended"
  | "pending"
  | "draft"
  | "ACTIVE"
  | "PENDING_VERIFICATION";

export interface AdminUser {
  uid: string;
  displayName: string;
  email: string;
  plan: PlanType;
  siteCount: number;
  createdAt: string;
  updatedAt?: string;
  status: string;
  isAdmin?: boolean;
}

export interface AdminSite {
  id: string;
  name: string;
  slug: string;
  uid: string;
  status: "published" | "draft";
  visits: number;
  plan: PlanType;
  createdAt: string;
  customDomain: string | null;
}

export interface AdminDomain {
  id: string;
  domain: string;
  uid: string;
  siteId: string;
  siteName: string;
  linkedAt: string;
  status: "active" | "pending";
  vercelStatus: "ACTIVE" | "PENDING_VERIFICATION";
  dnsOk: boolean;
}

export interface PricingPlan {
  name: string;
  price: number;
  nairaLabel: string;
  sites: number;
  customDomain: boolean;
  analytics: boolean;
  payments: boolean;
  description: string;
  buttonText: string;
}

export type PricingConfig = Record<PlanType, PricingPlan>;

export const PLAN_COLORS: Record<PlanType, string> = {
  free: "bg-slate-100 text-slate-500",
  basic: "bg-blue-50 text-blue-600",
  growth: "bg-emerald-50 text-emerald-600",
  pro: "bg-violet-50 text-violet-600",
};

export const STATUS_COLORS: Record<string, string> = {
  active: "text-emerald-600",
  published: "text-emerald-600",
  suspended: "text-red-500",
  pending: "text-amber-500",
  draft: "text-slate-400",
  ACTIVE: "text-emerald-600",
  PENDING_VERIFICATION: "text-amber-500",
};

export const DEFAULT_PRICING: PricingConfig = {
  free: {
    name: "Free",
    price: 0,
    nairaLabel: "₦0",
    sites: 1,
    customDomain: false,
    analytics: false,
    payments: false,
    description: "Start building your mini-site",
    buttonText: "Get Started Free",
  },
  basic: {
    name: "Basic",
    price: 1500,
    nairaLabel: "₦1,500",
    sites: 3,
    customDomain: true,
    analytics: false,
    payments: false,
    description: "Look professional online",
    buttonText: "Upgrade to Basic",
  },
  growth: {
    name: "Growth",
    price: 4000,
    nairaLabel: "₦4,000",
    sites: 10,
    customDomain: true,
    analytics: true,
    payments: false,
    description: "Grow your business",
    buttonText: "Upgrade to Growth",
  },
  pro: {
    name: "Pro",
    price: 10000,
    nairaLabel: "₦10,000",
    sites: 50,
    customDomain: true,
    analytics: true,
    payments: true,
    description: "Run your business online",
    buttonText: "Go Pro",
  },
};
