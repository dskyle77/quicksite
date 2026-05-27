/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/business/[slug]/route.ts
// GET   /api/business/[slug] — public profile data
// PATCH /api/business/[slug] — update (owner only)

import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import {
  getBusinessProfile,
  updateBusinessProfile,
  trackBusinessProfileView,
  trackBusinessWhatsAppClick,
} from "@/server/businessFirestore";
import { uploadBuffer } from "@/server/cloudinary";
import type { BusinessCategory } from "@/lib/business";
import { generateBusinessSeo } from "@/server/ai/generateBusinessSeo";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

interface RouteContext {
  params: Promise<{ slug: string }>;
}

async function uploadBusinessImage(
  file: File,
  uid: string,
  slug: string,
  type: "logo" | "cover",
): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const transformation =
    type === "logo"
      ? [{ width: 400, height: 400, crop: "fill" as const, gravity: "auto" }]
      : [{ width: 1200, height: 630, crop: "fill" as const, gravity: "auto" }];

  const result = await uploadBuffer(buffer, {
    folder: `quicksite/businesses/${uid}/${slug}`,
    publicId: type,
    allowedFormats: ["jpg", "png", "webp", "jpeg"],
    maxBytes: MAX_IMAGE_BYTES,
    transformation,
  });

  return result.secureUrl;
}

export async function GET(_req: Request, { params }: RouteContext) {
  const { slug } = await params;
  try {
    const profile = await getBusinessProfile(slug);
    if (!profile) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ profile });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const user = await getUserFromSession();
  if (!user?.uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const contentType = req.headers.get("content-type") ?? "";

  try {
    let updateData: any = {};

    // Load current profile if we're going to regenerate SEO
    let profile: any = null;

    if (contentType.includes("multipart/form-data")) {
      const fd = await req.formData();

      // Scalar fields
      for (const key of [
        "name",
        "tagline",
        "description",
        "category",
        "whatsappNumber",
        "email",
        "website",
        "city",
        "state",
        "address",
        "primarySiteSlug",
      ]) {
        const val = fd.get(key);
        if (typeof val === "string") updateData[key] = val;
      }

      // Handle tags (if passed as JSON string or multiple fields)
      const tagsRaw = fd.get("tags");
      if (typeof tagsRaw === "string") {
        try { updateData.tags = JSON.parse(tagsRaw); } catch { /* ignore */ }
      }

      // Images
      const logoFile = fd.get("logo");
      const coverFile = fd.get("cover");

      const [logoUrl, coverUrl] = await Promise.all([
        logoFile instanceof File && logoFile.size > 0
          ? uploadBusinessImage(logoFile, user.uid, slug, "logo")
          : Promise.resolve(undefined),
        coverFile instanceof File && coverFile.size > 0
          ? uploadBusinessImage(coverFile, user.uid, slug, "cover")
          : Promise.resolve(undefined),
      ]);

      if (logoUrl) updateData.logoUrl = logoUrl;
      if (coverUrl) updateData.coverUrl = coverUrl;

    } else {
      // JSON
      const body = await req.json();

      // Handle special tracking actions
      if (body._action === "track_view") {
        await trackBusinessProfileView(slug);
        return NextResponse.json({ success: true });
      }
      if (body._action === "track_whatsapp") {
        await trackBusinessWhatsAppClick(slug);
        return NextResponse.json({ success: true });
      }

      updateData = body;
    }

    // Always try to get what fields would be updated (general rules: name, category, description, city, state might be updated)
    // We need these for regen SEO—either from incoming data or fallback to current
    // So get current profile from DB (to fill blanks)
    profile = await getBusinessProfile(slug);

    if (!profile) {
      return NextResponse.json({ error: "Business profile not found." }, { status: 404 });
    }

    // For PATCH, maintain fallbacks old->new for SEO
    const name = updateData.name ?? profile.name ?? "";
    const category = updateData.category ?? profile.category ?? "";
    const description = updateData.description ?? profile.description ?? "";
    const city = updateData.city ?? profile.city ?? "";
    const state = updateData.state ?? profile.state ?? "";

    // Regenerate SEO fields if name/category/desc/city/state present in updateData
    // or just always for consistency
    if (name && category) {
      const seoData = await generateBusinessSeo({
        name: name.trim(),
        category,
        description,
        city,
        state,
      });
      updateData.seoTitle = seoData.title;
      updateData.seoDescription = seoData.description;
      if (seoData.keywords) {
        updateData.tags = Array.isArray(updateData.tags) && updateData.tags.length > 0
          ? updateData.tags
          : seoData.keywords;
      }
    }

    await updateBusinessProfile(slug, user.uid, updateData);
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = (err as Error).message;
    const status =
      msg === "Permission denied."
        ? 403
        : msg === "Business profile not found."
          ? 404
          : msg.includes("again in") 
            ? 429 // Rate limit error
            : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
