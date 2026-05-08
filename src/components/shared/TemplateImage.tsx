/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { getCurrentUser } from "@/lib/firebase";

type TemplateImageProps = {
  source?: string;
  /** Cloudinary publicId of the current image — used to delete it on replace */
  publicId?: string;
  onImageChange?: (url: string, publicId: string) => void;
  isEditor: boolean;
};

export default function TemplateImage({
  source,
  publicId,
  isEditor,
  onImageChange,
}: TemplateImageProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Incrementing this forces React to remount <img>, busting the browser cache
  const [imgKey, setImgKey] = useState(0);

  const handleUploadClick = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      let folder: string | undefined;
      try {
        const user = await getCurrentUser();
        folder = user?.uid;
      } catch (err) {
        console.warn(
          "Could not get Firebase user — uploading without folder:",
          err,
        );
      }

      // ── 1. Delete the old image ────────────────────────────────────────────
      if (publicId) {
        try {
          const deleteRes = await fetch("/api/imageDelete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicId }),
          });
          if (!deleteRes.ok) {
            console.warn("Old image deletion failed — continuing with upload");
          }
        } catch (err) {
          console.warn("Delete request failed — continuing with upload:", err);
        }
      }

      // ── 2. Upload the new image ────────────────────────────────────────────
      const formData = new FormData();
      formData.append("image", file);
      if (folder) formData.append("folder", folder);

      const res = await fetch("/api/imageUpload", {
        method: "POST",
        body: formData, 
      });

      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({}));
        throw new Error(msg ?? `Upload failed with status ${res.status}`);
      }

      const { secureUrl, publicId: newPublicId } = await res.json();
      if (!secureUrl) throw new Error("No URL returned from upload API");

      // Force <img> remount so the browser doesn't show the cached old image
      setImgKey((k) => k + 1);
      onImageChange?.(secureUrl, newPublicId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      console.error("Image upload error:", err);
      setError(message);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="relative flex items-center justify-center min-h-[120px] rounded-2xl overflow-hidden bg-(--qs-bg-alt)">
      {source ? (
        <img
          key={imgKey}
          alt="hero"
          src={source}
          className={[
            "object-cover w-full h-full rounded-2xl",
            isEditor ? "hover:brightness-75" : "",
            uploading ? "opacity-50 grayscale" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          loading="eager"
          style={{ display: "block" }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[120px] bg-(--qs-bg-alt) rounded-2xl border border-dashed border-(--qs-border) p-8 text-center">
          <Upload className="mb-2" />
          <span className="text-sm text-(--qs-text-muted)">No image</span>
        </div>
      )}

      {isEditor && (
        <>
          <button
            type="button"
            title="Upload image"
            onClick={handleUploadClick}
            disabled={uploading}
            className="absolute bottom-2 right-2 bg-(--qs-bg-alt) rounded-full p-2 border border-(--qs-border) hover:bg-(--qs-bg) transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={24} />
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            tabIndex={-1}
            disabled={uploading}
          />

          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
              <span className="text-xs text-white font-medium">Uploading…</span>
            </div>
          )}

          {error && !uploading && (
            <div className="absolute bottom-2 left-2 right-10 bg-red-500/90 text-white text-xs rounded-lg px-2 py-1 truncate">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}
