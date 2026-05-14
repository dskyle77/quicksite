// src/app/api/sites/[id]/route.ts
// PATCH /api/sites/[id] — update site content / theme / name
// DELETE /api/sites/[id] — delete a site
// Auth (ownership) enforced. No plan re-check needed post-creation.

import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import { serverUpdateSite, serverDeleteSite, serverPromoteTempImages } from "@/server/firestore";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id: slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { error: "Site ID is required." },
        { status: 400 },
      );
    }

    const body = await req.json();

    await serverUpdateSite(slug, user.uid, body);

    await serverPromoteTempImages(user.uid, slug)

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

export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id: slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { error: "Site ID is required." },
        { status: 400 },
      );
    }

    await serverDeleteSite(slug, user.uid);

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
