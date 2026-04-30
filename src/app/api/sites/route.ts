// src/app/api/sites/route.ts
// POST /api/sites — create a new site
// Auth + plan limit enforced server-side.

import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import { serverCreateSite } from "@/server/firestore";
import { getTemplateByType } from "@/lib/templates";
import type { Plan } from "@/lib/plans";

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, type, defaultMessage, whatsappNumber } = body;

    if (!name || !slug || !type) {
      return NextResponse.json(
        { error: "name, slug, and type are required." },
        { status: 400 },
      );
    }

    const normalizedName = (name as string).trim();
    const normalizedSlug = (slug as string).trim();

    const templateEntry = getTemplateByType(type);
    if (!templateEntry) {
      return NextResponse.json(
        { error: "Invalid template type." },
        { status: 400 },
      );
    }

    const content = templateEntry.starterContent({
      selectedTitle: normalizedName,
      defaultMessage,
      whatsappNumber,
    });

    const siteId = await serverCreateSite(
      user.uid,
      (user.plan ?? "free") as Plan,
      {
        slug: normalizedSlug,
        type,
        name: normalizedName,
        theme: templateEntry.config.theme,
        status: "draft",
        content,
      },
    );

    return NextResponse.json({ success: true, id: siteId, slug: normalizedSlug });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error.";
    const isPlanError = message.includes("Plan limit");
    return NextResponse.json(
      { error: message },
      { status: isPlanError ? 403 : 500 },
    );
  }
}