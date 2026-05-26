// src/app/api/sites/[id]/status/route.ts
// PATCH /api/sites/[id]/status — toggle between "published" and "draft"
// Auth (ownership) enforced only.

import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import { serverToggleSiteStatus } from "@/server/serverFirestore";
import { withRateLimit, rateLimits } from "@/server/rateLimit";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(_req: Request, { params }: RouteContext) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Rate-limit status toggling for this user and site
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Site ID is required." },
        { status: 400 },
      );
    }

    const rateLimitResult = await withRateLimit(
      rateLimits.sites.status,
      `${user.uid}:${id}`,
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many status changes. Please wait and try again later.",
          reset: rateLimitResult.reset,
        },
        { status: 429 },
      );
    }

    const nextStatus = await serverToggleSiteStatus(id, user.uid);

    return NextResponse.json({ success: true, status: nextStatus });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error.";
    const status =
      message === "Permission denied."
        ? 403
        : message === "Site not found."
          ? 404
          : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
