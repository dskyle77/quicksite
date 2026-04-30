// /src/lib/plans.ts

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
};
