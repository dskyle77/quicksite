// src/lib/plans.ts

export type Plan = "free" | "basic" | "growth" | "pro";

export const PLAN_LIMITS = {
  free: {
    sites: 1,
    customDomain: false,
    analytics: false,
    payments: false,
  },
  basic: {
    sites: 3,
    customDomain: true,
    analytics: false,
    payments: false,
  },
  growth: {
    sites: 10,
    customDomain: true,
    analytics: true,
    payments: false,
  },
  pro: {
    sites: 50,
    customDomain: true,
    analytics: true,
    payments: true,
  },
} as const;

export function getSiteLimit(plan: Plan): number {
  return PLAN_LIMITS[plan].sites;
}

export function canUseFeature(
  plan: Plan,
  feature: keyof (typeof PLAN_LIMITS)["free"],
): boolean {
  return PLAN_LIMITS[plan][feature] === true;
}

export function canCreateSite(plan: Plan, currentSites: number): boolean {
  return currentSites < PLAN_LIMITS[plan].sites;
}