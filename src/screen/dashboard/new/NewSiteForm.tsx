/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";

import { useProfileStore } from "@/store/useProfileStore";
import { canUseFeature } from "@/lib/plans";
import { AI_DAILY_LIMITS } from "@/lib/rateLimit";

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

  return (
    <>
      <div className="space-y-4">
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

        {/* AI Toggle (shown only if can use AI) */}
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
