/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import authFetch from "@/lib/authFetch";
import { useSiteEditorStore } from "@/store/useSiteEditorStore";

type TemplateImageBackgroundProps = {
  source?: string;
  publicId?: string;
  onImageChange?: (url: string, publicId: string) => void;
  isEditor: boolean;
  children: React.ReactNode;
};

export default function TemplateImageBackground({
  source,
  publicId,
  isEditor,
  onImageChange,
  children,
}: TemplateImageBackgroundProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  // Use site slug for auth fetch, like TemplateImage
  const site = useSiteEditorStore((state) => state.site);
  const slug = site?.slug || "";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      // ── 1. Delete the old image (using slug) ───────────────────────────────
      if (publicId) {
        try {
          const deleteRes = await authFetch("/api/imageDelete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ publicId, slug }),
          });
          if (!deleteRes.ok) {
            console.warn("Old image deletion failed — continuing with upload");
          }
        } catch (err) {
          console.warn("Delete request failed — continuing with upload:", err);
        }
      }

      // ── 2. Upload the new image (with slug and optional folder) ────────────
      const formData = new FormData();
      formData.append("image", file);
      formData.append("slug", slug);

      const res = await authFetch("/api/imageUpload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const { error: msg } = await res.json().catch(() => ({}));
        throw new Error(msg ?? `Upload failed with status ${res.status}`);
      }

      const { secureUrl, publicId: newId } = await res.json();
      if (!secureUrl) throw new Error("No URL returned from upload API");

      onImageChange?.(secureUrl, newId);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden min-h-[600px] flex items-center">
      {/* Background Image with Overlay */}
      {source && (
        <div className="absolute inset-0 z-0">
          <img src={source} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 w-full">{children}</div>

      {/* Editor Upload Trigger */}
      {isEditor && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-white/20 transition cursor-pointer"
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
    </div>
  );
}
