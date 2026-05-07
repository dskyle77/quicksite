/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import authFetch from "@/lib/authFetch";
import { useAuth } from "@/hooks/useAuth";
import { useProfileStore } from "@/store/useProfileStore";
import { isValidTemplate } from "@/lib/templates";

import { NewSiteForm } from "./NewSiteForm";
import { TemplatePicker } from "./TemplatesPicker";

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

  const userProfile = useProfileStore().profile;
  const defaultMessage = userProfile?.defaultMessage;
  const whatsappNumber = userProfile?.whatsappNumber;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: paramsName || "",
    slug: paramsSlug || "",
    description: "", // New field
    type: selectedTemplateType,
    whatsappNumber: whatsappNumber || "",
    generateWithAI: false, // New toggle
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
    if (!user) return toast.error("Please login first.");

    const normalizedName = formData.name.trim();
    const normalizedSlug = formData.slug.trim();

    if (!normalizedName || !normalizedSlug) {
      return toast.error("Please add both site name and URL slug.");
    }

    setLoading(true);

    try {
      const res = await authFetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: normalizedName,
          slug: normalizedSlug,
          type: formData.type,
          description: formData.description, 
          generateWithAI: formData.generateWithAI,
          defaultMessage,
          whatsappNumber: formData.whatsappNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create site.");
      }

      toast.success("Site created!");
      router.push(`/editor/${data.slug}`);
    } catch (error: any) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-1 sm:py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Launch Your Site
        </h1>
        <p className="text-slate-500 mt-2 text-base sm:text-lg">
          Start with a production-ready template.
        </p>
      </div>
      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-8"
      >
        <div className="order-1 md:order-2">
          <TemplatePicker
            selectedType={formData.type}
            onTemplateChange={handleTemplateChange}
            slugForPreview={formData.slug}
            nameForPreview={formData.name}
          />
        </div>

        <div className="order-2 md:order-1 md:col-span-2 space-y-6 bg-card p-4 sm:p-8 rounded-3xl border shadow-sm">
          <NewSiteForm
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
