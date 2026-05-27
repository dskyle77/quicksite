// src/app/api/business/route.ts
// POST /api/business — create a business profile (one per user, called from onboarding)
// GET  /api/business — get current user's business profile

import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import {
  createBusinessProfile,
  getBusinessProfileByUid,
} from "@/server/businessFirestore";
import { withRateLimit, rateLimits } from "@/server/rateLimit";
import { uploadBuffer } from "@/server/cloudinary";
import type { BusinessCategory } from "@/lib/business";
import { generateBusinessSeo } from "@/server/ai/generateBusinessSeo";

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

// ── Image upload ──────────────────────────────────────────────────────────────

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

// ── GET /api/business ─────────────────────────────────────────────────────────

export async function GET() {
  const user = await getUserFromSession();
  if (!user?.uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await getBusinessProfileByUid(user.uid);
    return NextResponse.json({ profile });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

// ── POST /api/business ────────────────────────────────────────────────────────

export async function POST(req: Request) {
  console.log("[POST] /api/business: Handler called");

  const user = await getUserFromSession();
  if (!user?.uid) {
    console.log("[POST] /api/business: Unauthorized");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success, reset } = await withRateLimit(
    rateLimits.sites.create,
    user.uid,
  );
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "X-RateLimit-Reset": String(reset) } },
    );
  }

  // One profile per user
  const existing = await getBusinessProfileByUid(user.uid);
  if (existing) {
    console.log(
      "[POST] /api/business: User already has a business profile",
      existing.slug,
    );
    return NextResponse.json(
      { error: "You already have a business profile.", slug: existing.slug },
      { status: 409 },
    );
  }

  try {
    const contentType = req.headers.get("content-type") ?? "";
    console.log("[POST] /api/business: Content-Type", contentType);
    let fields: Record<string, string> = {};
    let logoFile: File | null = null;
    let coverFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const fd = await req.formData();
      // Scalar fields
      for (const key of [
        "name",
        "slug",
        "category",
        "whatsappNumber",
        "tagline",
        "description",
        "city",
        "state",
        "email",
        "website",
        "address",
        "primarySiteSlug",
      ]) {
        const val = fd.get(key);
        if (typeof val === "string") fields[key] = val;
      }
      const logo = fd.get("logo");
      const cover = fd.get("cover");
      if (logo instanceof File && logo.size > 0) logoFile = logo;
      if (cover instanceof File && cover.size > 0) coverFile = cover;
      console.log(
        "[POST] /api/business: Form fields",
        fields,
        "logoFile?",
        !!logoFile,
        "coverFile?",
        !!coverFile,
      );
    } else {
      // JSON fallback
      const body = await req.json();
      fields = Object.fromEntries(
        Object.entries(body).map(([k, v]) => [k, String(v ?? "")]),
      );
      console.log("[POST] /api/business: JSON body fields", fields);
    }

    const { name, slug, category, whatsappNumber } = fields;

    if (!name?.trim() || !slug?.trim() || !category) {
      console.warn("[POST] /api/business: Missing required fields", {
        name,
        slug,
        category,
      });
      return NextResponse.json(
        { error: "name, slug, and category are required." },
        { status: 400 },
      );
    }

    const slugStr = slug.toLowerCase().trim();
    if (!SLUG_REGEX.test(slugStr)) {
      console.warn("[POST] /api/business: Invalid slug", slugStr);
      return NextResponse.json(
        { error: "Slug must be 3–50 lowercase letters, numbers, or hyphens." },
        { status: 400 },
      );
    }

    if (!whatsappNumber) {
      console.warn("[POST] /api/business: Missing WhatsApp number");
      return NextResponse.json(
        { error: "WhatsApp number is required." },
        { status: 400 },
      );
    }

    // Upload images in parallel
    // Inside your POST handler in src/app/api/business/route.ts ...
    console.log("[POST] /api/business: Uploading images (logo, cover)");
    const [logoUrl, coverUrl] = await Promise.all([
      logoFile
        ? uploadBusinessImage(logoFile, user.uid, slugStr, "logo")
        : Promise.resolve(undefined),
      coverFile
        ? uploadBusinessImage(coverFile, user.uid, slugStr, "cover")
        : Promise.resolve(undefined),
    ]);
    console.log("[POST] /api/business: Upload results", { logoUrl, coverUrl });

    // 1. Generate the AI SEO object
    console.log("[POST] /api/business: Generating business SEO");
    const seoData = await generateBusinessSeo({
      name: name.trim(),
      category,
      description: fields.description,
      city: fields.city,
      state: fields.state,
    });
    console.log("[POST] /api/business: SEO data", seoData);

    // 2. Spread the generated properties to match root-level fields
    console.log("[POST] /api/business: Creating business profile in Firestore");

    const normalize = (s?: string) =>
      s
        ?.trim()
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ") || "";

    const profileSlug = await createBusinessProfile(user.uid, {
      name: name.trim(),
      slug: slugStr,
      tagline: fields.tagline?.trim() || "",
      description: fields.description?.trim() || "",
      category: category as BusinessCategory,
      whatsappNumber: whatsappNumber.trim(),
      email: fields.email?.trim() || "",
      website: fields.website?.trim() || "",
      city: normalize(fields.city),
      state: normalize(fields.state),
      country: "Nigeria",
      address: fields.address?.trim() || "",
      tags: seoData.keywords || [], // Optional: Pre-populate tags from AI keywords
      logoUrl,
      coverUrl,
      primarySiteSlug: fields.primarySiteSlug?.trim() || "",
      status: "active",
      seoTitle: seoData.title, // Saved to root
      seoDescription: seoData.description, // Saved to root
    });
    console.log(
      "[POST] /api/business: Successfully created business profile",
      profileSlug,
    );

    return NextResponse.json({ success: true, slug: profileSlug });
  } catch (err) {
    const msg = (err as Error).message;
    const status = msg.includes("already taken") ? 409 : 500;
    console.error("[POST] /api/business: Error occurred", { msg, err });
    return NextResponse.json({ error: msg }, { status });
  }
}
