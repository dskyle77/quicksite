/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/sites/[id]/route.ts
// PATCH /api/sites/[id] — update site content / theme / name / ogImage
// PUT /api/sites/[id] — update outerdata fields (description, tags, whatsappNumber, ogImage)
// DELETE /api/sites/[id] — delete a site
// Auth (ownership) enforced. No plan re-check needed post-creation.

import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import { serverUpdateSite, serverDeleteSite } from "@/server/serverFirestore";
import { uploadSiteImages, uploadOgImage } from "@/server/cloudinary";
import { batchUpdateByPath } from "@/lib/helpers";
import { withRateLimit, rateLimits } from "@/server/rateLimit";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// Helper function to check serialized data size (excluding images)
function isTooLarge(obj: unknown, maxBytes = 450_000): boolean {
  try {
    const json = JSON.stringify(obj);
    return new TextEncoder().encode(json).length > maxBytes;
  } catch {
    return true;
  }
}

export async function PUT(req: Request, { params }: RouteContext) {
  // OUTERDATA update mode: description, whatsappNumber, tags, ogImage (PUT)

  try {
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Rate limit check (use edit rate limit for update)
    const rateLimitResult = await withRateLimit(
      rateLimits.sites.edit,
      user.uid,
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many edit attempts. Please wait before trying again.",
          reset: rateLimitResult.reset,
        },
        { status: 429 },
      );
    }

    const { id: slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { error: "Site ID is required." },
        { status: 400 },
      );
    }

    // Parse multipart form data
    const formData = await req.formData();

    const description = formData.get("description");
    const whatsappNumber = formData.get("whatsappNumber");
    const tagsRaw = formData.get("tags");
    const ogImageRaw = formData.get("ogImage");

    // Handle ogImage: file upload or string URL
    let ogImage: string | undefined;
    if (ogImageRaw instanceof File && ogImageRaw.size > 0) {
      try {
        ogImage = await uploadOgImage(ogImageRaw, user.uid, slug);
      } catch (ogUploadErr) {
        return NextResponse.json(
          { error: "Failed to upload social preview image (ogImage)." },
          { status: 400 },
        );
      }
    } else if (typeof ogImageRaw === "string" && ogImageRaw.length > 0) {
      // Basic url validation (not strict)
      ogImage = ogImageRaw;
    }

    let tags: string[] | undefined = undefined;
    if (typeof tagsRaw === "string" && tagsRaw.length > 0) {
      try {
        if (tagsRaw.startsWith("[") && tagsRaw.endsWith("]")) {
          tags = JSON.parse(tagsRaw);
        } else {
          tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
        }
        if (!Array.isArray(tags)) tags = undefined;
      } catch (err) {
        tags = undefined;
      }
    }

    const toSerialize: Record<string, any> = {};
    if (typeof description === "string") {
      toSerialize.description = description;
    }
    if (typeof whatsappNumber === "string") {
      toSerialize.whatsappNumber = whatsappNumber;
    }
    if (typeof ogImage === "string" && ogImage.length > 0) {
      toSerialize.ogImage = ogImage;
    }
    if (Array.isArray(tags) && tags.length > 0) {
      toSerialize.tags = tags;
    }

    if (isTooLarge(toSerialize)) {
      return NextResponse.json(
        { error: "Payload too large. Reduce text or data." },
        { status: 413 },
      );
    }

    await serverUpdateSite(slug, user.uid, toSerialize);

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

export async function PATCH(req: Request, { params }: RouteContext) {
  // PATCH for content, theme, name, ogImage (NOT outerdata)

  try {
    const user = await getUserFromSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Rate limit check
    const rateLimitResult = await withRateLimit(
      rateLimits.sites.edit,
      user.uid,
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many edit attempts. Please wait before trying again.",
          reset: rateLimitResult.reset,
        },
        { status: 429 },
      );
    }

    const { id: slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { error: "Site ID is required." },
        { status: 400 },
      );
    }

    // (No more updateType branch; PATCH always means content update now.)
    // Parse multipart form data
    const formData = await req.formData();

    // Common fields
    const ogImageRaw = formData.get("ogImage"); // Can be URL or File

    // Content update: name (optional), themeRaw, contentRaw
    const name = formData.get("name");
    const themeRaw = formData.get("theme");
    const contentRaw = formData.get("content");

    // Parse theme and content if present
    let theme = undefined;
    let content = undefined;
    try {
      if (themeRaw && typeof themeRaw === "string" && themeRaw !== "") {
        theme = JSON.parse(themeRaw);
      }
    } catch (themeErr) {
      // parsing theme failed, skip
    }
    try {
      if (contentRaw && typeof contentRaw === "string") {
        content = JSON.parse(contentRaw);
      }
    } catch (err) {
      return NextResponse.json({ error: "Invalid content." }, { status: 400 });
    }

    // Handle ogImage (again, if present in this mode)
    let ogImage: string | undefined;
    if (ogImageRaw instanceof File && ogImageRaw.size > 0) {
      try {
        ogImage = await uploadOgImage(ogImageRaw, user.uid, slug);
      } catch (ogUploadErr) {
        return NextResponse.json(
          { error: "Failed to upload social preview image (ogImage)." },
          { status: 400 },
        );
      }
    } else if (typeof ogImageRaw === "string" && ogImageRaw.length > 0) {
      ogImage = ogImageRaw;
    }

    // Collect images in the form fields: keys like images[foo]
    const images: Record<string, File> = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("images[") && key.endsWith("]")) {
        const path = key.slice(7, -1);
        if (value instanceof File && value.size > 0) {
          images[path] = value;
        }
      }
    }

    // Upload images and get mapping: path -> image URL
    const imagesWithUrl = await uploadSiteImages(slug, user.uid, images);

    // Patch content with new image URLs at those paths
    let newContent = content;
    if (
      content !== undefined &&
      imagesWithUrl &&
      Object.keys(imagesWithUrl).length > 0
    ) {
      const contentClone = JSON.parse(JSON.stringify(content));
      newContent = batchUpdateByPath(contentClone, imagesWithUrl);
    }

    // Build refined body and check size (excluding images)
    // Only update fields if they've been provided in the form
    const toSerialize: Record<string, any> = {};
    if (typeof name === "string") {
      toSerialize.name = name;
    }
    if (theme !== undefined) {
      toSerialize.theme = theme;
    }
    if (newContent !== undefined) {
      toSerialize.content = newContent;
    }
    if (typeof ogImage === "string" && ogImage.length > 0) {
      toSerialize.ogImage = ogImage;
    }

    if (isTooLarge(toSerialize)) {
      return NextResponse.json(
        { error: "Site content is too large. Reduce text or data." },
        { status: 413 },
      );
    }

    await serverUpdateSite(slug, user.uid, toSerialize);

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

    // Rate limit check
    const rateLimitResult = await withRateLimit(
      rateLimits.sites.delete,
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
