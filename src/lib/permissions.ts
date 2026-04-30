// /src/lib/permissions.ts

import { PLAN_LIMITS, Plan } from "./plans";

export function canUseFeature(
  plan: Plan,
  feature: keyof (typeof PLAN_LIMITS)["free"],
) {
  return PLAN_LIMITS[plan][feature] === true;
}

export function canCreateSite(plan: Plan, currentSites: number) {
  return currentSites < PLAN_LIMITS[plan].sites;
}
