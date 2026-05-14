import { deleteImage } from "@/server/cloudinary";
import { getUserFromSession } from "@/server/auth";
import { NextResponse } from "next/server";
import { serverDeleteTempImage } from "@/server/firestore";

export async function DELETE(req: Request) {
  const user = await getUserFromSession();
  if (!user?.uid || !user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return Response.json(
      { error: "Server misconfiguration: Cloudinary credentials are not set" },
      { status: 500 }
    );
  }

  try {
    const { publicId, slug } = await req.json();

    if (!publicId || typeof publicId !== "string") {
      return Response.json({ error: "publicId is required" }, { status: 400 });
    }
    if (!slug || typeof slug !== "string") {
      return Response.json({ error: "slug is required" }, { status: 400 });
    }

    await deleteImage(publicId);

    await serverDeleteTempImage(user.uid, slug, publicId)

    return Response.json({ success: true });
  } catch (err) {
    console.error("[imageDelete] Failed:", err);
    const message = err instanceof Error ? err.message : "Unexpected error";
    return Response.json({ error: message }, { status: 500 });
  }
}