/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { deleteDomainForUser } from "@/server/domains";
import { getUserFromSession } from "@/server/auth";
import { withRateLimit, rateLimits } from "@/server/rateLimit";

export async function DELETE(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResult = await withRateLimit(
      rateLimits.domains.delete,
      user.uid,
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many delete requests. Please wait and try again later.",
          reset: rateLimitResult.reset,
        },
        { status: 429 },
      );
    }

    const { domain, siteId } = await req.json();
    if (!domain || !siteId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 },
      );
    }

    const result = await deleteDomainForUser({
      uid: user.uid,
      domain,
      siteId,
    });
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status || 500 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
