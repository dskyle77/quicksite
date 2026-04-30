/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/useUserStore";

import { isValidTemplate, templatesRegistry } from "@/lib/templates";
import { Layout, ArrowRight, CheckCircle2, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";

const SITE_DOMAIN_NAME = process.env.NEXT_PUBLIC_SITE_DOMAIN_NAME;
const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN_NAME;

// ---- Site Name and Slug Form ----
function SiteFormInputs({
  formData,
  setFormData,
  loading,
  onSlugChange,
}: {
  formData: { name: string; slug: string; type: string };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  onSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <div className="space-y-4">
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

        <label className="block">
          <span className="text-sm font-bold ml-1">Desired URL</span>
          <div className="flex mt-1">
            <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 bg-slate-50 text-slate-400 text-xs shrink-0">
              {SITE_DOMAIN_NAME}
              {DOMAIN_NAME}/s/
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

// ---- Template Picker ----
function TemplatePicker({
  selectedType,
  onTemplateChange,
  slugForPreview,
  nameForPreview,
}: {
  selectedType: string;
  onTemplateChange: (type: string) => void;
  slugForPreview: string;
  nameForPreview: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold ml-1">Template</span>
        <Link href={`/templates?name=${nameForPreview}&slug=${slugForPreview}`}>
          <button className="text-primary text-sm font-semibold rounded-full px-3 py-1 transition-all border border-primary cursor-pointer">
            View all
          </button>
        </Link>
      </div>
      <div className="grid gap-3">
        {templatesRegistry.slice(0, 3).map((t) => {
          const selected = selectedType === t.type;
          return (
            <div
              className={[
                "relative p-3 rounded-2xl border-2 transition-all cursor-pointer",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-transparent bg-muted/40",
              ].join(" ")}
              key={t.type}
              onClick={() => onTemplateChange(t.type)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={[
                    "p-2 rounded-lg border shadow-sm transition-all shrink-0",
                    selected
                      ? "bg-white border-primary"
                      : "bg-slate-50 border-slate-200",
                  ].join(" ")}
                >
                  <Layout
                    size={16}
                    className={selected ? "text-primary" : "text-slate-400"}
                  />
                </div>
                <div className="min-w-0">
                  <h3
                    className={[
                      "font-bold text-sm truncate transition-colors",
                      selected ? "text-primary" : "text-foreground",
                    ].join(" ")}
                  >
                    {t.meta?.title ?? "Production Template"}
                  </h3>
                  <p
                    className={[
                      "text-[10px] line-clamp-3 transition-colors",
                      selected ? "text-primary/80" : "text-slate-500",
                    ].join(" ")}
                  >
                    {t.meta?.description ??
                      "Ready-to-ship layout for catalogue sites."}
                  </p>
                </div>
              </div>
              {selected && (
                <CheckCircle2
                  className="absolute top-2 right-2 text-primary drop-shadow"
                  size={16}
                />
              )}
            </div>
          );
        })}
        <Link
          href={`/templates/${selectedType}?from=/dashboard/new&name=${nameForPreview}&slug=${slugForPreview}`}
          className="h-10 inline-flex items-center justify-center gap-2 rounded-full border bg-primary text-sm font-semibold text-primary-foreground transition"
        >
          <Eye size={16} />
          Preview Template
        </Link>
      </div>
    </div>
  );
}

// ---- Main Page ----
export default function CreateSitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const templateTypeFromQuery = searchParams.get("template") || "";

  const selectedTemplateType = isValidTemplate(templateTypeFromQuery)
    ? templateTypeFromQuery
    : "template-1";

  const paramsName = searchParams.get("name");
  const paramsSlug = searchParams.get("slug");

  // get profile data
  const userProfile = useUserStore().profile;
  const defaultMessage = userProfile?.defaultMessage;
  const whatsappNumber = userProfile?.whatsappNumber;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: paramsName || "",
    slug: paramsSlug || "",
    type: selectedTemplateType,
  });

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setFormData((prev) => ({ ...prev, slug: val }));
  };

  const handleTemplateChange = (newTemplateType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("template", newTemplateType);
    router.replace(`?${params.toString()}`);
    setFormData((prev) => ({ ...prev, type: newTemplateType }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login first");

    const normalizedName = formData.name.trim();
    const normalizedSlug = formData.slug.trim();

    // Basic validation (UI only)
    if (!normalizedName || !normalizedSlug) {
      return toast.error("Please add both site name and URL slug.");
    }

    setLoading(true);

    try {
      const token = await user.getIdToken();

      const res = await fetch("/api/create-site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 important
        },
        body: JSON.stringify({
          name: normalizedName,
          slug: normalizedSlug,
          type: formData.type,
          defaultMessage,
          whatsappNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create site");
      }

      toast.success("Site initialized!");
      router.push(`/editor/${data.slug}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-1 sm:py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Launch Your Site
        </h1>
        <p className="text-slate-500 mt-2 text-base sm:text-lg">
          Start with a production-ready online catalogue template.
        </p>
      </div>
      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-8"
      >
        {/* Template Picker — top on mobile, right on desktop */}
        <div className="order-1 md:order-2">
          <TemplatePicker
            selectedType={formData.type}
            onTemplateChange={handleTemplateChange}
            slugForPreview={formData.slug}
            nameForPreview={formData.name}
          />
        </div>

        {/* Inputs — bottom on mobile, left on desktop */}
        <div className="order-2 md:order-1 md:col-span-2 space-y-6 bg-card p-4 sm:p-8 rounded-3xl border shadow-sm">
          <SiteFormInputs
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            onSlugChange={handleSlugChange}
          />
        </div>
      </form>
    </div>
  );
}
