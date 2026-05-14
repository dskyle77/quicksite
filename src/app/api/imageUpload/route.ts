import { uploadBuffer } from "@/server/cloudinary";
import { getUserFromSession } from "@/server/auth";

import { serverStoreTempImage } from "@/server/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getUserFromSession();
  if (!user?.uid || !user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error("[upload] Missing Cloudinary environment variables");
    return Response.json(
      { error: "Server misconfiguration: Cloudinary credentials are not set" },
      { status: 500 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    const slug = formData.get("slug") as string | null;

    if (!file || typeof file === "string") {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }
    if (!slug || slug === "") {
      return Response.json(
        { error: "Site slug not provided" },
        { status: 400 },
      );
    }

    const folder = `quicksite/users/${user.uid}/${slug}`;

    // Validate file size (5 MB limit)
    const MAX_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return Response.json(
        { error: "File too large. Maximum size is 5 MB." },
        { status: 413 },
      );
    }

    // Convert File → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadBuffer(buffer, {
      folder,
      allowedFormats: ["jpg", "jpeg", "png", "webp"],
      maxBytes: MAX_BYTES,
    });

    const secureUrl = result.secureUrl;
    const publicId = result.publicId;

    await serverStoreTempImage(user.uid, slug, publicId, secureUrl);

    return Response.json({
      secureUrl,
      publicId,
    });
  } catch (err) {
    console.error("[upload] Cloudinary upload failed:", err);

    const message =
      err instanceof Error ? err.message : "Unexpected error during upload";

    return Response.json({ error: message }, { status: 500 });
  }
}
