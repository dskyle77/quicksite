import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { Plan } from "@/lib/plans";
import { AI_DAILY_LIMITS } from "@/lib/plans";

const redis = Redis.fromEnv();

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

// rateLimit.ts
export async function withRateLimit(limiter: Ratelimit, identifier: string) {
  try {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      response: result,
      reset: result.reset,
    };
  } catch (err) {
    console.error("[rateLimit] Redis unreachable, failing open:", err);
    // Fail open — allow the request through rather than returning 500
    return { success: true, response: null, reset: null };
  }
}

/* -------------------------------------------------------------------------- */
/*                                   AI                                        */
/* -------------------------------------------------------------------------- */

export const AI_HOURLY_LIMITS: Record<Plan, number> = {
  free: 1,
  growth: 3,
  pro: 5,
};

const aiDaily = {
  free: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(AI_DAILY_LIMITS.free, "1 d"),
    analytics: true,
    prefix: "ai_daily_free",
  }),
  growth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(AI_DAILY_LIMITS.growth, "1 d"),
    analytics: true,
    prefix: "ai_daily_growth",
  }),
  pro: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(AI_DAILY_LIMITS.pro, "1 d"),
    analytics: true,
    prefix: "ai_daily_pro",
  }),
};

const aiHourly = {
  free: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(AI_HOURLY_LIMITS.free, "1 h"),
    analytics: true,
    prefix: "ai_hourly_free",
  }),
  growth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(AI_HOURLY_LIMITS.growth, "1 h"),
    analytics: true,
    prefix: "ai_hourly_growth",
  }),
  pro: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(AI_HOURLY_LIMITS.pro, "1 h"),
    analytics: true,
    prefix: "ai_hourly_pro",
  }),
};

export const aiRateLimits = {
  daily: aiDaily,
  hourly: aiHourly,
};

/* -------------------------------------------------------------------------- */
/*                                  API                                        */
/* -------------------------------------------------------------------------- */

export const apiRateLimits = {
  strict: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 m"),
    analytics: true,
    prefix: "api_strict",
  }),

  general: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "60 s"),
    analytics: true,
    prefix: "api_general",
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 DOMAIN                                      */
/* -------------------------------------------------------------------------- */

export const domainRateLimits = {
  connect: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 m"),
    analytics: true,
    prefix: "domain_connect",
  }),
  relink: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 m"),
    analytics: true,
    prefix: "domain_relink",
  }),
  delete: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 m"),
    analytics: true,
    prefix: "domain_delete",
  }),

  hourly: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    analytics: true,
    prefix: "domain_hourly",
  }),
};

/* -------------------------------------------------------------------------- */
/*                                   AUTH                                      */
/* -------------------------------------------------------------------------- */

export const authRateLimits = {
  login: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    analytics: true,
    prefix: "auth_login",
  }),

  signup: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    analytics: true,
    prefix: "auth_signup",
  }),

  passwordReset: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    analytics: true,
    prefix: "auth_password_reset",
  }),

  emailVerification: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: true,
    prefix: "auth_email_verify",
  }),
};

/* -------------------------------------------------------------------------- */
/*                                 FEATURES                                    */
/* -------------------------------------------------------------------------- */

export const featureRateLimits = {
  contactForm: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "contact_form",
  }),
  messages: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "messages",
  }),

  analytics: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(120, "1 m"),
    analytics: true,
    prefix: "analytics",
  }),

  search: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 m"),
    analytics: true,
    prefix: "search",
  }),
};

/* -------------------------------------------------------------------------- */
/*                                  SITES                                     */
/* -------------------------------------------------------------------------- */

export const sitesRateLimits = {
  create: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),
    analytics: true,
    prefix: "sites_create",
  }),

  edit: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 h"), // More lenient for edits
    analytics: true,
    prefix: "sites_edit",
  }),

  delete: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 h"), // Allow reasonable deletions
    analytics: true,
    prefix: "sites_delete",
  }),
  status: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 h"),
    analytics: true,
    prefix: "sites_status",
  }),

  // Optional: list/view rate limit (good for API endpoints)
  list: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"), // Quite high, as listing is common
    analytics: true,
    prefix: "sites_list",
  }),
};
/* -------------------------------------------------------------------------- */
/*                              SINGLE EXPORT                                 */
/* -------------------------------------------------------------------------- */

export const rateLimits = {
  ai: aiRateLimits,
  api: apiRateLimits,
  domains: domainRateLimits,
  auth: authRateLimits,
  sites: sitesRateLimits,
  features: featureRateLimits,
};
