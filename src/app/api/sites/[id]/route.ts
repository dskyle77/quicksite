// src/app/api/sites/[id]/route.ts
// PATCH /api/sites/[id] — update site content / theme / name
// DELETE /api/sites/[id] — delete a site
// Auth (ownership) enforced. No plan re-check needed post-creation.

import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import { serverUpdateSite, serverDeleteSite } from "@/server/firestore";
import { uploadSiteImages } from "@/server/cloudinary";
import { batchUpdateByPath } from "@/lib/helpers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// Helper function to check serialized data size (excluding images)
function isTooLarge(obj: unknown, maxBytes = 450_000): boolean {
  // About 450KB, safely under the 512KB Firestore/RTDB/most field limits
  try {
    const json = JSON.stringify(obj);
    return new TextEncoder().encode(json).length > maxBytes;
  } catch {
    return true;
  }
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

    // Parse multipart form data instead of JSON body
    const formData = await req.formData();

    // Required fields: name (string), theme (stringified JSON), content (stringified JSON)
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
      // Swallow theme parsing errors; continue
    }
    try {
      if (contentRaw && typeof contentRaw === "string") {
        content = JSON.parse(contentRaw);
      }
    } catch (err) {
      return NextResponse.json({ error: "Invalid content." }, { status: 400 });
    }

    // Collect images in the form fields: keys like images[foo] etc.
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
    // Defensive: Only attempt patch if content is present
    let newContent = content;
    if (content !== undefined && imagesWithUrl && Object.keys(imagesWithUrl).length > 0) {
      const contentClone = JSON.parse(JSON.stringify(content));
      newContent = batchUpdateByPath(contentClone, imagesWithUrl);
    }

    // Build refined body, but first check data size, excluding images
    // Images are not included in the serialized body
    // We trim fields to prevent accidental excess
    const toSerialize = {
      name: typeof name === "string" ? name : "",
      content: newContent,
      theme,
    };

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
    console.error("[PATCH] ERROR:", message, "status:", status, "Detail:", err);
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
    console.error("[DELETE] ERROR:", message, "status:", status, "Detail:", err);
    return NextResponse.json({ error: message }, { status });
  }
}
