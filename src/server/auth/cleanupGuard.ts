// /src/server/auth/cleanupGuard.ts

import { verifyCronRequest } from "./cron";
import { requireAdmin } from "./admin";

export async function validateCleanupRequest(req: Request) {
  // 1. Cron path
  if (verifyCronRequest(req)) {
    return { ok: true, source: "cron" as const };
  }

  // 2. Admin path
  const admin = await requireAdmin();

  if (admin) {
    return { ok: true, source: "admin" as const, user: admin };
  }

  return { ok: false };
}
