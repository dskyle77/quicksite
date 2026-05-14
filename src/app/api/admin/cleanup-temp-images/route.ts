// app/api/admin/cleanup-temp-images/route.ts

import { NextResponse } from "next/server";
import { validateCleanupRequest } from "@/server/auth/cleanupGuard";
import { serverDeleteAllOldTempImages } from "@/server/firestore";

export async function POST(req: Request) {
  try {
    const auth = await validateCleanupRequest(req);

    if (!auth.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await serverDeleteAllOldTempImages();

    return NextResponse.json({
      success: true,
      triggeredBy: auth.source,
    });
  } catch (err) {
    console.error("[cleanup-temp-images]", err);

    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
