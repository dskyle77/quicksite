/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
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
  step: number;
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
  errors?: Record<string, string>;
  setTouchedFields: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export function NewSiteForm({
  step,
  formData,
  setFormData,
  loading,
  onSlugChange,
  errors = {},
  setTouchedFields,
}: NewSiteFormProps) {
  const { getUserPlan } = useProfileStore();
  const plan = getUserPlan();
  const canUseAI = plan ? canUseFeature(plan, "ai") : false;

  const [showImageModal, setShowImageModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setTouchedFields((prev) => ({ ...prev, name: true }));
    
    setFormData((prev: any) => {
      const slug = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      
      const prevAutoSlug = prev.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const shouldUpdateSlug = !prev.slug || prev.slug === prevAutoSlug;

      if (shouldUpdateSlug) {
        setTouchedFields((t) => ({ ...t, slug: true }));
      }

      return {
        ...prev,
        name,
        slug: shouldUpdateSlug ? slug : prev.slug,
      };
    });
  };

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WebP, GIF)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }
    setFormData((prev: any) => ({ ...prev, image: file }));
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowImageModal(false);
  };

  const removeImage = () => {
    setFormData((prev: any) => ({ ...prev, image: null }));
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  };

  if (step === 1) {
    return (
      <div className="space-y-5">
        {/* Site Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold ml-1 text-slate-700">Site Name</label>
          <input
            required
            type="text"
            className={`w-full px-4 py-3.5 rounded-2xl border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-primary'} focus:ring-2 outline-none transition-all shadow-sm`}
            placeholder="e.g. Blossom Bakery"
            value={formData.name}
            onChange={handleNameChange}
            onBlur={() => setTouchedFields((prev) => ({ ...prev, name: true }))}
          />
          {errors.name && <p className="text-red-500 text-xs ml-1 font-medium">{errors.name}</p>}
        </div>

        {/* URL Slug */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold ml-1 text-slate-700">Desired URL</label>
          <div className="flex group">
            <span className={`inline-flex items-center px-3 sm:px-4 rounded-l-2xl border border-r-0 ${errors.slug ? 'border-red-500 bg-red-50 text-red-400' : 'border-slate-200 bg-slate-50 text-slate-400'} text-[10px] sm:text-xs font-medium transition-colors group-focus-within:border-primary group-focus-within:bg-primary/5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] sm:max-w-none`}>
              {SITE_SHORT_NAME}{DOMAIN_NAME}/
            </span>
            <input
              required
              type="text"
              className={`flex-1 min-w-0 px-3 sm:px-4 py-3 sm:py-3.5 rounded-r-2xl border ${errors.slug ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-primary'} focus:ring-2 outline-none transition-all text-sm shadow-sm`}
              placeholder="blossom-bakery"
              value={formData.slug}
              onChange={onSlugChange}
              onBlur={() => setTouchedFields((prev) => ({ ...prev, slug: true }))}
            />
          </div>
          {errors.slug ? (
            <p className="text-red-500 text-xs ml-1 font-medium">{errors.slug}</p>
          ) : (
            <p className="text-[10px] text-slate-400 ml-1 italic">You can&apos;t change this URL later.</p>
          )}
        </div>

        {/* Whatsapp Number */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold ml-1 text-slate-700">WhatsApp Number</label>
          <div className="flex group">
            <span className={`inline-flex items-center px-4 rounded-l-2xl border border-r-0 ${errors.whatsappNumber ? 'border-red-500 bg-red-50 text-red-400' : 'border-slate-200 bg-slate-50 text-slate-400'} text-xs font-medium transition-colors group-focus-within:border-primary group-focus-within:bg-primary/5`}>
              +234
            </span>
            <input
              required
              type="tel"
              className={`flex-1 min-w-0 px-3 sm:px-4 py-3 sm:py-3.5 rounded-r-2xl border ${errors.whatsappNumber ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-primary'} focus:ring-2 outline-none transition-all text-sm shadow-sm`}
              placeholder="8012345678"
              value={formData.whatsappNumber}
              onChange={(e) => {
                setTouchedFields((prev) => ({ ...prev, whatsappNumber: true }));
                setFormData((prev: any) => ({
                  ...prev,
                  whatsappNumber: e.target.value,
                }));
              }}
              onBlur={() => setTouchedFields((prev) => ({ ...prev, whatsappNumber: true }))}
            />
          </div>
          {errors.whatsappNumber && <p className="text-red-500 text-xs ml-1 font-medium">{errors.whatsappNumber}</p>}
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold ml-1 text-slate-700">Site Logo / Main Image</label>
          <div
            onClick={() => setShowImageModal(true)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-1 border-2 border-dashed rounded-2xl sm:rounded-3xl aspect-video flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative
              ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-slate-200 hover:border-primary hover:bg-primary/5 bg-slate-50/50"
              }`}
          >
            {previewUrl ? (
              <div className="w-full h-full relative group">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full">Change Image</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 hover:bg-red-500 hover:text-white text-slate-600 p-1.5 sm:p-2 rounded-full transition-all shadow-md z-10"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="text-center p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-slate-100">
                  <Upload className="text-primary" size={24} />
                </div>
                <p className="font-bold text-sm sm:text-base text-slate-700">Upload Site Image</p>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
                  Drag & drop or click to browse
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description Field */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold ml-1 text-slate-700">Business Description</label>
          <textarea
            className={`w-full px-4 py-3 rounded-2xl border ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 focus:ring-primary'} focus:ring-2 outline-none transition-all resize-none shadow-sm text-sm sm:text-base`}
            placeholder="Briefly describe what your business does..."
            rows={4}
            value={formData.description}
            onChange={(e) => {
              setTouchedFields((prev) => ({ ...prev, description: true }));
              setFormData((prev: any) => ({
                ...prev,
                description: e.target.value,
              }));
            }}
            onBlur={() => setTouchedFields((prev) => ({ ...prev, description: true }))}
          />
          {errors.description && <p className="text-red-500 text-xs ml-1 font-medium">{errors.description}</p>}
        </div>

        {/* AI Toggle */}
        {canUseAI && (
          <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-primary/5 border border-primary/10 shadow-sm">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-primary rounded-xl sm:rounded-2xl shadow-sm">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-slate-800">Generate with AI</p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium leading-tight">
                  We&apos;ll auto-fill content based on the description
                  {plan && ` (${AI_DAILY_LIMITS[plan]}/day)`}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.generateWithAI}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    generateWithAI: e.target.checked,
                  }))
                }
              />
              <div className="w-10 h-5 sm:w-11 sm:h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        )}

        {/* Image Upload Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-60 p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-t-3xl sm:rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300 sm:duration-200">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6 sm:mb-8">
                  <h3 className="font-black text-xl sm:text-2xl text-slate-800">Upload Image</h3>
                  <button 
                    onClick={() => setShowImageModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl sm:rounded-[24px] h-60 sm:h-72 flex flex-col items-center justify-center cursor-pointer transition-all
                    ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 hover:border-primary bg-slate-50/50"
                    }`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl shadow-sm flex items-center justify-center mb-4 sm:mb-5 border border-slate-100">
                    <ImageIcon size={32} className="text-slate-300" />
                  </div>
                  <p className="font-bold text-base sm:text-lg text-slate-700 text-center px-4">
                    {isDragging ? "Drop it here!" : "Drag & drop image"}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2">or</p>
                  <label className="mt-4 sm:mt-5 px-6 sm:px-8 py-3 sm:py-3.5 bg-primary text-white rounded-xl sm:rounded-2xl font-bold cursor-pointer hover:bg-primary/90 transition-all shadow-md active:scale-95 text-sm">
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

              <div className="p-5 sm:p-6 bg-slate-50/50 border-t border-slate-100">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="w-full py-3 sm:py-4 text-slate-500 font-bold hover:text-slate-700 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  return null;
}