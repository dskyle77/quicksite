/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { canCreateSite } from "@/lib/permissions";
import { getUserFromSession } from "@/server/auth";
import { getUserSites, createSite, isSlugTaken } from "@/lib/firestore";
import { getTemplateByType } from "@/lib/templates";

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, slug, type, defaultMessage, whatsappNumber } = body;

    // ✅ Validate
    if (!name || !slug || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const normalizedName = name.trim();
    const normalizedSlug = slug.trim();

    // ✅ Check slug
    const taken = await isSlugTaken(normalizedSlug);
    if (taken) {
      return NextResponse.json(
        { error: "Slug already taken" },
        { status: 400 },
      );
    }

    // ✅ Get user plan + sites
    const userSites = await getUserSites(user.uid);
    const plan = user.plan || "free";

    if (!canCreateSite(plan, userSites.length)) {
      return NextResponse.json(
        { error: "Site limit reached. Upgrade your plan." },
        { status: 403 },
      );
    }

    // ✅ Template
    const templateEntry = getTemplateByType(type);
    if (!templateEntry) {
      return NextResponse.json({ error: "Invalid template" }, { status: 400 });
    }

    const content = templateEntry.starterContent({
      selectedTitle: normalizedName,
      defaultMessage,
      whatsappNumber,
    });

    const sitePayload = {
      slug: normalizedSlug,
      type,
      name: normalizedName,
      theme: templateEntry.config.theme,
      status: "draft" as const,
      content,
    };

    // ✅ Create site
    await createSite(user.uid, sitePayload);

    return NextResponse.json({
      success: true,
      slug: normalizedSlug,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
