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

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    console.log("[PATCH] — Begin processing PATCH /api/sites/[id]");
    const user = await getUserFromSession();
    console.log("[PATCH] User retrieved:", !!user, user?.uid);

    if (!user) {
      console.log("[PATCH] No user. Unauthorized.");
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id: slug } = await params;
    console.log("[PATCH] Got site slug:", slug);
    if (!slug) {
      console.log("[PATCH] No slug provided.");
      return NextResponse.json(
        { error: "Site ID is required." },
        { status: 400 },
      );
    }

    // Parse multipart form data instead of JSON body
    const formData = await req.formData();
    console.log("[PATCH] formData received:", formData);

    // Required fields: name (string), theme (stringified JSON), content (stringified JSON)
    const name = formData.get("name");
    const themeRaw = formData.get("theme");
    const contentRaw = formData.get("content");

    console.log("[PATCH] form values — name:", name, "themeRaw:", themeRaw, "contentRaw:", contentRaw);

    // Parse theme and content if present
    let theme = undefined;
    let content = undefined;
    try {
      if (themeRaw && typeof themeRaw === "string" && themeRaw !== "") {
        theme = JSON.parse(themeRaw);
        console.log("[PATCH] theme parsed:", theme);
      }
    } catch (themeErr) {
      console.log("[PATCH] Theme parsing failed:", themeErr);
    }
    try {
      if (contentRaw && typeof contentRaw === "string") {
        content = JSON.parse(contentRaw);
        console.log("[PATCH] content parsed", content);
      }
    } catch (err) {
      console.log("[PATCH] Content JSON parse error:", err);
      return NextResponse.json({ error: "Invalid content." }, { status: 400 });
    }

    // Collect images in the form fields: keys like images[foo] etc.
    const images: Record<string, File> = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("images[") && key.endsWith("]")) {
        const path = key.slice(7, -1);
        if (value instanceof File && value.size > 0) {
          images[path] = value;
          console.log(`[PATCH] Image file found — path: ${path}, size: ${value.size}B`);
        }
      }
    }
    console.log("[PATCH] images collected:", Object.keys(images));

    // Upload images and get mapping: path -> image URL
    const imagesWithUrl = await uploadSiteImages(slug, user.uid, images);
    console.log("[PATCH] imagesWithUrl:", imagesWithUrl);

    // Patch content with new image URLs at those paths
    // Defensive: Only attempt patch if content is present
    let newContent = content;
    if (content !== undefined && imagesWithUrl && Object.keys(imagesWithUrl).length > 0) {
      const contentClone = JSON.parse(JSON.stringify(content));
      newContent = batchUpdateByPath(contentClone, imagesWithUrl);
      console.log("[PATCH] Content patched with image URLs.");
    }

    // Build refined body
    const refinedBody = {
      name: typeof name === "string" ? name : "",
      content: newContent,
      theme,
    };

    console.log("[PATCH] Refined site body to update:", refinedBody);

    await serverUpdateSite(slug, user.uid, refinedBody);

    console.log("[PATCH] Site update success!");
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
    console.log("[DELETE] — Begin processing DELETE /api/sites/[id]");
    const user = await getUserFromSession();
    console.log("[DELETE] User retrieved:", !!user, user?.uid);

    if (!user) {
      console.log("[DELETE] No user. Unauthorized.");
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id: slug } = await params;
    console.log("[DELETE] Got site slug:", slug);
    if (!slug) {
      console.log("[DELETE] No slug provided.");
      return NextResponse.json(
        { error: "Site ID is required." },
        { status: 400 },
      );
    }

    await serverDeleteSite(slug, user.uid);

    console.log("[DELETE] Site deletion success!");
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
