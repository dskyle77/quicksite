/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
import { useRef, useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { useSiteEditorStore } from "@/store/useSiteEditorStore";

type TemplateImageProps = {
  source?: string;
  isEditor: boolean;
  alt?: string;
  path: string;
  variant?: "default" | "background";
  children?: React.ReactNode;
};

export default function TemplateImage({
  source,
  isEditor,
  alt,
  variant = "default",
  children,
  path,
}: TemplateImageProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setImage = useSiteEditorStore((state) => state.setImage);
  const images = useSiteEditorStore((state) => state.images);

  // imageFile is always a File, or undefined if not set
  const imageFile: File | undefined = images?.[path];

  // Generate a local preview URL if imageFile is present
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile instanceof File) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    if (isEditor) {
      setImage(path, file); // images[path] = file
      setUploading(false);
    }
  };

  // ───────────── Helper Logic for Image Source ─────────────
  let effectiveSource: string | undefined;
  if (isEditor) {
    if (imageFile instanceof File && previewUrl) {
      effectiveSource = previewUrl;
    } else {
      // If imageFile is undefined, fall back to source
      effectiveSource = source;
    }
  } else {
    // Not in editor mode: always use source
    effectiveSource = source;
  }

  // ───────────── BACKGROUND VARIANT ─────────────
  if (variant === "background") {
    return (
      <div className="relative w-full overflow-hidden min-h-[600px] flex items-center">
        {effectiveSource && (
          <div className="absolute inset-0 z-0">
            <img
              src={effectiveSource}
              alt={alt || ""}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          </div>
        )}
        <div className="relative z-10 w-full">{children}</div>
        {isEditor && (
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={() => inputRef.current?.click()}
              className={[
                !uploading && "cursor-pointer",
                "flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/20 transition",
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={uploading}
            >
              <Upload size={18} />
              <span className="text-sm">
                {uploading ? "Uploading..." : "Change Background"}
              </span>
            </button>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
              disabled={uploading}
            />
          </div>
        )}
        {isEditor && error && !uploading && (
          <div className="absolute bottom-2 left-2 right-10 bg-red-500/90 text-white text-xs rounded-lg px-2 py-1 truncate z-30">
            {error}
          </div>
        )}
        {isEditor && uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-30">
            <span className="text-xs text-white font-medium">Uploading…</span>
          </div>
        )}
      </div>
    );
  }

  // ───────────── DEFAULT VARIANT ─────────────
  const handleUploadClick = () => {
    if (!isEditor || uploading) return;
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  let showImage: React.ReactNode = null;

  if (effectiveSource) {
    showImage = (
      <img
        alt={alt}
        src={effectiveSource}
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
    showImage = (
      <div
        className="flex flex-col items-center justify-center w-full h-full rounded-2xl transition border-2 border-dashed border-(--qs-border) hover:bg-(--qs-bg) hover:border-(--qs-primary)"
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
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/bmp,image/svg+xml"
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
