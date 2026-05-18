// src/lib/plans.ts

export type Plan = "free" | "growth" | "pro";

/** Fully dynamic custom template builder */
export const CUSTOM_TEMPLATE_TYPE = "template-builder";

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
      "AI starter content (1/day)",
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
      "Up to 10 mini-sites",
      "Custom domain",
      "More templates",
      "AI starter content (10/day)",
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
      "Up to 25 mini-sites",
      "Premium templates",
      "Analytics",
      "Sell products",
      "AI starter content (25/day)",
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
    customTemplate: false,
    analytics: false,
    payments: false,
    ai: true,
    messages: false,
    removeBranding: false,
  },

  growth: {
    sites: 10,
    customDomain: true,
    customTemplate: true,
    analytics: false,
    payments: false,
    ai: true,
    messages: true,
    removeBranding: true,
  },

  pro: {
    sites: 25,
    customDomain: true,
    customTemplate: true,
    analytics: true,
    payments: false,
    ai: true,
    messages: true,
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
