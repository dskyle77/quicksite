/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { getCurrentUser } from "@/lib/firebase";

type TemplateImageProps = {
  source?: string;
  /** Cloudinary publicId of the current image — used to delete it on replace */
  publicId?: string;
  onImageChange?: (url: string, publicId: string) => void;
  isEditor: boolean;
  alt?: string;
};

export default function TemplateImage({
  source,
  publicId,
  isEditor,
  onImageChange,
  alt,
}: TemplateImageProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Incrementing this forces React to remount <img>, busting the browser cache
  const [imgKey, setImgKey] = useState(0);
  // Local preview for the uploaded image in the editor
  const [preview, setPreview] = useState<string | null>(null);

  const handleUploadClick = () => {
    if (!isEditor || uploading) return;
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use FileReader to show preview immediately
    if (isEditor) {
      const reader = new FileReader();
      reader.onload = function (event) {
        if (typeof event.target?.result === "string") {
          setPreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }

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
      setPreview(null);
      onImageChange?.(secureUrl, newPublicId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      console.error("Image upload error:", err);
      setError(message);
      // Keep preview on failure until dismissed by new upload/success.
    } finally {
      setUploading(false);
    }
  };

  // Show the preview (if exists in the editor and uploading), else show the source, else show placeholder (always clickable in editor)
  let showImage: React.ReactNode = null;
  if (isEditor && preview) {
    showImage = (
      <img
        key={`preview-${imgKey}`}
        alt={alt}
        src={preview}
        className={[
          "object-cover w-full h-full rounded-2xl",
          "hover:brightness-75",
          "opacity-70 grayscale",
        ].filter(Boolean).join(" ")}
        loading="eager"
        style={{ display: "block" }}
      />
    );
  } else if (source) {
    showImage = (
      <img
        key={imgKey}
        alt={alt}
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
    );
  } else if (isEditor) {
    // No image source or preview, but in editor mode: show a clickable placeholder
    showImage = (
      <div
        className={[
          "flex flex-col items-center justify-center w-full h-full rounded-2xl",
          "transition border-2 border-dashed border-(--qs-border)",
          "hover:bg-(--qs-bg) hover:border-(--qs-primary)",
        ].join(" ")}
        style={{ minHeight: 80, color: "var(--qs-text-muted)" }}
      >
        <span className="text-sm" aria-label="Add image">
          +
        </span>
        <span className="text-xs mt-1 opacity-70">Add image</span>
      </div>
    );
  }

  return (
    <div
      className="relative flex items-center justify-center min-h-[120px] rounded-2xl overflow-hidden bg-(--qs-bg-alt) cursor-pointer"
      onClick={handleUploadClick}
      tabIndex={isEditor ? 0 : -1}
      style={{
        pointerEvents: isEditor && !uploading ? "auto" : "none",
        opacity: uploading ? 0.7 : 1,
      }}
    >
      {showImage}

      {isEditor && (
        <>
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
