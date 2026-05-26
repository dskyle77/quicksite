"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import authFetch from "@/lib/authFetch";
import { useAuth } from "@/hooks/useAuth";
import { useProfileStore } from "@/store/useProfileStore";
import { isValidTemplate, premiumTemplates } from "@/lib/templates";
import { CUSTOM_TEMPLATE_TYPE, canUseFeature, type Plan } from "@/lib/plans";

import { NewSiteForm } from "./NewSiteForm";
import { TemplatePicker } from "./TemplatesPicker";

export default function CreateSitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const userProfile = useProfileStore().profile;
  const userPlan = (userProfile?.plan ?? "free") as Plan;
  const canUsePremiumTemplate = canUseFeature(userPlan, "premiumTemplate");

  const templateTypeFromQuery = searchParams.get("template") || "";
  let selectedTemplateType = isValidTemplate(templateTypeFromQuery)
    ? templateTypeFromQuery
    : "";
  if (selectedTemplateType === CUSTOM_TEMPLATE_TYPE && !canUsePremiumTemplate) {
    selectedTemplateType = "";
  }

  const paramsName = searchParams.get("name");
  const paramsSlug = searchParams.get("slug");
  const whatsappNumber = userProfile?.whatsappNumber;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: paramsName || "",
    slug: paramsSlug || "",
    description: "",
    type: selectedTemplateType,
    whatsappNumber: whatsappNumber || "",
    generateWithAI: false,
    image: null as File | null, // ← Added
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
    if (!formData.description && formData.generateWithAI) {
      return toast.error("Please provide a description to use AI generation.");
    }
    if (formData.type === "") {
      return toast.error("Please select a site template.");
    }
    if (formData.type === CUSTOM_TEMPLATE_TYPE && !canUsePremiumTemplate) {
      return toast.error(
        "Custom template requires Growth or Pro. Please upgrade your plan.",
      );
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", normalizedName);
      formDataToSend.append("slug", normalizedSlug);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("generateWithAI", String(formData.generateWithAI));
      formDataToSend.append("whatsappNumber", formData.whatsappNumber);

      // Append image if exists
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const res = await authFetch("/api/sites", {
        method: "POST",
        body: formDataToSend,
        // Do NOT set Content-Type header → browser will set multipart/form-data automatically
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create site.");
      }

      toast.success("Site created successfully!");
      router.push(`/editor/${data.slug}`);
    } catch (error: unknown) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
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
            canUsePremiumTemplate={canUsePremiumTemplate}
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
