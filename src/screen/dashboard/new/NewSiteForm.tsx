/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  ArrowRight,
  Loader2,
  Sparkles,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";

import { useProfileStore } from "@/store/useProfileStore";
import { canUseFeature } from "@/lib/plans";
import { AI_DAILY_LIMITS } from "@/lib/plans";

const SITE_SHORT_NAME = process.env.NEXT_PUBLIC_SITE_SHORT_NAME;
const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN_NAME;

interface NewSiteFormProps {
  formData: {
    name: string;
    slug: string;
    description: string;
    type: string;
    whatsappNumber: string;
    generateWithAI: boolean;
    image?: File | null;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  onSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function NewSiteForm({
  formData,
  setFormData,
  loading,
  onSlugChange,
}: NewSiteFormProps) {
  const { getUserPlan } = useProfileStore();
  const plan = getUserPlan();
  const canUseAI = plan ? canUseFeature(plan, "ai") : false;

  const [showImageModal, setShowImageModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle image selection (used by both click and drop)
  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WebP, GIF)");
      return;
    }

    // Optional: Add file size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setFormData((prev: any) => ({ ...prev, image: file }));

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowImageModal(false);
  };

  // Remove selected image
  const removeImage = () => {
    setFormData((prev: any) => ({ ...prev, image: null }));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Image Upload with Drag & Drop */}
        <div className="block">
          <span className="text-sm font-bold ml-1">Site Image / Logo</span>

          <div
            onClick={() => setShowImageModal(true)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-1 border-2 border-dashed rounded-2xl aspect-video flex flex-col items-center justify-center cursor-pointer transition-all
              ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-slate-300 hover:border-primary hover:bg-primary/5"
              }`}
          >
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-2xl"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute top-3 right-3 bg-black/70 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto text-slate-400 mb-3" size={36} />
                <p className="font-medium text-sm">Upload Site Image</p>
                <p className="text-xs text-slate-500 mt-1">
                  PNG, JPG, WebP, GIF • Max 5MB
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Drag & drop or click to upload
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Rest of the form remains the same */}
        {/* Site Name */}
        <label className="block">
          <span className="text-sm font-bold ml-1">Site Name</span>
          <input
            required
            type="text"
            className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all"
            placeholder="My Business Page"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, name: e.target.value }))
            }
          />
        </label>

        {/* URL Slug */}
        <label className="block">
          <span className="text-sm font-bold ml-1">Desired URL</span>
          <div className="flex mt-1">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 bg-slate-50 text-slate-400 text-xs shrink-0">
              {SITE_SHORT_NAME}
              {DOMAIN_NAME}/
            </span>
            <input
              required
              type="text"
              className="flex-1 min-w-0 px-3 py-3 rounded-r-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              placeholder="my-site"
              value={formData.slug}
              onChange={onSlugChange}
            />
          </div>
        </label>

        {/* Whatsapp Number */}
        <label className="block">
          <span className="text-sm font-bold ml-1">Whatsapp Number</span>
          <div className="flex mt-1">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 bg-slate-50 text-slate-400 text-xs shrink-0">
              +234
            </span>
            <input
              required
              type="number"
              className="flex-1 min-w-0 px-3 py-3 rounded-r-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              placeholder="8012345678"
              value={formData.whatsappNumber}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  whatsappNumber: e.target.value,
                }))
              }
            />
          </div>
        </label>

        {/* Description Field */}
        <label className="block">
          <span className="text-sm font-bold ml-1">Short Description</span>
          <textarea
            className="w-full mt-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
            placeholder="Tell us a bit about your business..."
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />
        </label>

        {/* AI Toggle */}
        {canUseAI && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">Generate with AI</p>
                <p className="text-[10px] text-slate-500">
                  Auto-fill content based on your description
                  {plan && ` (${AI_DAILY_LIMITS[plan]}/day)`}
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              className="w-5 h-5 accent-primary cursor-pointer"
              checked={formData.generateWithAI}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  generateWithAI: e.target.checked,
                }))
              }
            />
          </div>
        )}
      </div>

      {/* Image Upload Modal (with Drag & Drop) */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl">Upload Image</h3>
                <button onClick={() => setShowImageModal(false)}>
                  <X size={24} />
                </button>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all
                  ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-slate-300 hover:border-primary"
                  }`}
              >
                <ImageIcon size={48} className="text-slate-400 mb-4" />
                <p className="font-medium text-lg">
                  {isDragging ? "Drop image here" : "Drag & drop image"}
                </p>
                <p className="text-sm text-slate-500 mt-1">or</p>
                <label className="mt-3 px-6 py-2.5 bg-primary text-white rounded-2xl cursor-pointer hover:bg-primary/90 transition-all">
                  Browse Files
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageSelect(file);
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="border-t p-4">
              <button
                onClick={() => setShowImageModal(false)}
                className="w-full py-3 border border-slate-300 rounded-2xl font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              Create Site <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>
    </>
  );
}
