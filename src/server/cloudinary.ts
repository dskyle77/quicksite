/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only"

import { v2 as cloudinary } from "cloudinary";

// ─── Configuration ────────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ─── Types ────────────────────────────────────────────────────────────────────
export interface UploadOptions {
  /** Destination folder in your Cloudinary media library */
  folder: string;
  /** Optional public ID (filename without extension). Auto-generated if omitted. */
  publicId?: string;
  /** Allowed formats e.g. ["jpg", "png", "webp"]. No restriction if omitted. */
  allowedFormats?: string[];
  /** Max file size in bytes. No restriction if omitted. */
  maxBytes?: number;
  /** Transformation to apply on upload e.g. { width: 800, crop: "limit" } */
  transformation?: object;
  /** Any additional Cloudinary upload options */
  [key: string]: unknown;
}

export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  folder: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
  assetId: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Upload an image from a local file path or a remote URL.
 *
 * @example
 * const result = await uploadImage("./photo.jpg", { folder: "products" });
 * const result = await uploadImage("https://example.com/img.png", { folder: "avatars" });
 */
export async function uploadImage(
  source: string,
  options: UploadOptions,
): Promise<UploadResult> {
  const {
    folder,
    publicId,
    allowedFormats,
    maxBytes,
    transformation,
    ...rest
  } = options;

  const response = await cloudinary.uploader.upload(source, {
    folder,
    ...(publicId && { public_id: publicId }),
    ...(allowedFormats && { allowed_formats: allowedFormats }),
    ...(maxBytes && { max_bytes: maxBytes }),
    ...(transformation && { transformation }),
    resource_type: "image",
    ...rest,
  });

  return mapResponse(response);
}

export async function uploadSiteImages(
  slug: string,
  uid: string,
  images: Record<string, File>,
): Promise<Record<string, string>> {
  if (!images || typeof images !== "object") return {};

  const folderBase = `quicksite/users/${uid}/${slug}/images`;
  const MAX_BYTES = 5 * 1024 * 1024;
  const allowedFormats = ["jpg", "jpeg", "png", "webp"];

  const results: Record<string, string> = {};

  await Promise.all(
    Object.entries(images).map(async ([path, file]) => {
      if (!file) return;

      // Convert File → Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const publicId = `${folderBase}/${path}`;

      const uploadResult = await uploadBuffer(buffer, {
        folder: folderBase,
        publicId,
        tags: ["quicksite", uid, slug, path],
        allowedFormats,
        maxBytes: MAX_BYTES,
        overwrite: true,
      });

      results[path] = uploadResult.secureUrl;
    }),
  );

  return results;
}
/**
 * Upload an image from a Base64-encoded data URI.
 *
 * @example
 * const result = await uploadBase64Image(
 *   "data:image/png;base64,iVBORw0KGgo...",
 *   { folder: "thumbnails" }
 * );
 */
export async function uploadBase64Image(
  dataUri: string,
  options: UploadOptions,
): Promise<UploadResult> {
  return uploadImage(dataUri, options);
}

/**
 * Upload a raw Buffer (e.g. from a multipart form or Node stream).
 *
 * @example
 * const result = await uploadBuffer(req.file.buffer, { folder: "uploads" });
 */
export async function uploadBuffer(
  buffer: Buffer,
  options: UploadOptions,
): Promise<UploadResult> {
  const {
    folder,
    publicId,
    allowedFormats,
    maxBytes,
    transformation,
    ...rest
  } = options;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        ...(publicId && { public_id: publicId }),
        ...(allowedFormats && { allowed_formats: allowedFormats }),
        ...(maxBytes && { max_bytes: maxBytes }),
        ...(transformation && { transformation }),
        resource_type: "image",
        ...rest,
      },
      (error: any, result: any) => {
        if (error || !result)
          return reject(error ?? new Error("Upload failed"));
        resolve(mapResponse(result));
      },
    );

    stream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by its public ID.
 *
 * @example
 * await deleteImage("products/my-photo");
 */
export async function deleteImage(publicId: string): Promise<void> {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Failed to delete image "${publicId}": ${result.result}`);
  }
}
/**
 * Force delete folder + all contents (handles large folders better)
 */
export async function deleteFolderForce(folderPath: string): Promise<void> {
  try {
    const cleanPath = folderPath.trim().replace(/^\/+|\/+$/g, "");

    // Delete all resources by prefix
    await cloudinary.api.delete_resources_by_prefix(cleanPath, {
      resource_type: "image",
    });

    // Also delete other resource types if needed
    await cloudinary.api.delete_resources_by_prefix(cleanPath, {
      resource_type: "video",
    });

    // Delete the folder
    await cloudinary.api.delete_folder(cleanPath);

    console.log(`✅ Force deleted folder: ${cleanPath}`);
  } catch (error: any) {
    console.error("Force delete failed:", error);
    throw error;
  }
}
/**
 * Generate a signed URL for a private image that expires after `expiresInSeconds`.
 *
 * @example
 * const url = getSignedUrl("private-folder/secret.jpg", 3600);
 */
export function getSignedUrl(
  publicId: string,
  expiresInSeconds: number = 3600,
): string {
  return cloudinary.url(publicId, {
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
    secure: true,
  });
}

// ─── Internal ─────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapResponse(r: any): UploadResult {
  return {
    publicId: r.public_id,
    url: r.url,
    secureUrl: r.secure_url,
    folder: r.folder ?? "",
    format: r.format,
    width: r.width,
    height: r.height,
    bytes: r.bytes,
    createdAt: r.created_at,
    assetId: r.asset_id,
  };
}

export default cloudinary;
