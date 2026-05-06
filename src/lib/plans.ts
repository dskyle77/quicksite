// src/lib/plans.ts

export type Plan = "free" | "growth" | "pro";

export const PLANS: {
  name: string;
  plan: Plan;
  price: number;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
}[] = [
  {
    name: "Free",
    plan: "free",
    price: 0,
    description: "Get online quickly with a clean mini-site",
    features: [
      "1 mini-site",
      "Quicksite subdomain",
      "Basic templates",
      "Powered by QuickSite branding",
    ],
    buttonText: "Get Started Free",
  },
  {
    name: "Growth",
    plan: "growth",
    price: 2000,
    description: "Build your presence and attract visitors",
    features: [
      "Up to 5 mini-sites",
      "Custom domain",
      "More templates",
      "Basic SEO",
      "Contact forms",
    ],
    isPopular: true,
    buttonText: "Upgrade to Growth",
  },
  {
    name: "Pro",
    plan: "pro",
    price: 8000,
    description: "Run and scale your online business",
    features: [
      "Up to 50 mini-sites",
      "Premium templates",
      "Analytics",
      "Accept payments",
      "Sell products",
    ],
    buttonText: "Go Pro",
  },
];
export const PLAN_LIMITS = {
  free: {
    sites: 1,
    customDomain: false,
    analytics: false,
    payments: false,
  },
  growth: {
    sites: 5,
    customDomain: true,
    analytics: false,
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
