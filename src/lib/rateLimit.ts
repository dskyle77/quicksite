import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { Plan } from "@/lib/plans";

const redis = Redis.fromEnv();

/** Daily AI generation caps per plan */
export const AI_DAILY_LIMITS: Record<Plan, number> = {
  free: 1,
  growth: 10,
  pro: 25,
};

const aiRateLimiters: Record<Plan, Ratelimit> = {
  free: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(AI_DAILY_LIMITS.free, "1 d"),
    analytics: true,
    prefix: "ratelimit_ai_free",
  }),
  growth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(AI_DAILY_LIMITS.growth, "1 d"),
    analytics: true,
    prefix: "ratelimit_ai_growth",
  }),
  pro: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(AI_DAILY_LIMITS.pro, "1 d"),
    analytics: true,
    prefix: "ratelimit_ai_pro",
  }),
};

export function getAiRateLimiter(plan: Plan): Ratelimit {
  return aiRateLimiters[plan];
}

export const generalApiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "60 s"),
  analytics: true,
  prefix: "ratelimit_general",
});
