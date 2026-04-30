// src/app/api/sites/[id]/content/route.ts
// PATCH /api/sites/[id]/content — save full site content from editor
// Auth (ownership) enforced. No plan re-check.

import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import { serverUpdateSite } from "@/server/firestore";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Site ID is required." },
        { status: 400 },
      );
    }

    const body = await req.json();

    // Only allow safe fields from the editor
    const { content, theme, name } = body;

    if (!content && !theme && !name) {
      return NextResponse.json(
        { error: "Nothing to update." },
        { status: 400 },
      );
    }

    const updates: Record<string, unknown> = {};
    if (content !== undefined) updates.content = content;
    if (theme !== undefined) updates.theme = theme;
    if (name !== undefined) updates.name = name;

    await serverUpdateSite(id, user.uid, updates);

    return NextResponse.json({ success: true });
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
