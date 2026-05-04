// src/lib/plans.ts

export type Plan = "free" | "basic" | "growth" | "pro";

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
    description: "Start building your mini-site",
    features: [
      "1 mini-site",
      "Quicksite subdomain",
      "Basic templates",
      "Powered by Quicksite branding",
    ],
    buttonText: "Get Started Free",
  },
  {
    name: "Basic",
    plan: "basic",
    price: 1500,
    description: "Look professional online",
    isPopular: true,
    features: [
      "Custom domain",
      "Remove Quicksite branding",
      "Better templates",
      "Social links",
      "Basic customization",
    ],
    buttonText: "Upgrade to Basic",
  },
  {
    name: "Growth",
    plan: "growth",
    price: 4000,
    description: "Grow your business",
    features: [
      "Everything in Basic",
      "Analytics (views & clicks)",
      "Contact forms",
      "More sections",
      "Image gallery",
    ],
    buttonText: "Upgrade to Growth",
  },
  {
    name: "Pro",
    plan: "pro",
    price: 10000,
    description: "Run your business online",
    features: [
      "Everything in Growth",
      "Accept payments",
      "Sell products",
      "Advanced customization",
      "Priority performance",
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
