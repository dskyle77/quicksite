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
      "Quicksite branding",
    ],
    buttonText: "Get Started Free",
  },
  {
    name: "Growth",
    plan: "growth",
    price: 2000,
    description: "Build your brand and grow your online presence",
    features: [
      "Up to 5 mini-sites",
      "Custom domain",
      "More templates",
      "AI starter content",
      "Basic SEO",
      "Contact forms",
      "Remove Quicksite branding",
    ],
    isPopular: true,
    buttonText: "Upgrade to Growth",
  },
  {
    name: "Pro",
    plan: "pro",
    price: 5000,
    description: "Advanced tools for creators and businesses",
    features: [
      "Up to 15 mini-sites",
      "Premium templates",
      "Analytics",
      "Sell products",
      "Advanced SEO",
      "Priority support",
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
    ai: false,
    removeBranding: false,
  },

  growth: {
    sites: 5,
    customDomain: true,
    analytics: false,
    payments: false,
    ai: true,
    removeBranding: true,
  },

  pro: {
    sites: 15,
    customDomain: true,
    analytics: true,
    payments: false,
    ai: true,
    removeBranding: true,
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
