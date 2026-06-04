/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2, Rocket, X } from "lucide-react";

import authFetch from "@/lib/authFetch";
import { useAuth } from "@/hooks/useAuth";
import { useProfileStore } from "@/store/useProfileStore";
import {
  isPremiumTemplate,
  isValidTemplate,
  templatesCategories,
} from "@/lib/templates";
import { canUseFeature, type Plan } from "@/lib/plans";

import { NewSiteForm } from "./NewSiteForm";
import { TemplatePicker } from "./TemplatesPicker";
import { toCapitalize } from "@/lib/utils/helpers";

export default function CreateSitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const userProfile = useProfileStore().profile;
  const userPlan = (userProfile?.plan ?? "free") as Plan;
  const canUsePremiumTemplate = canUseFeature(userPlan, "premiumTemplate");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Track which fields the user has interacted with to prevent premature error messages
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {},
  );

  // Get the template type from the query string, considering allowed templates
  const templateTypeFromQuery = searchParams.get("template") || "";
  let initialSelectedTemplateType = isValidTemplate(templateTypeFromQuery)
    ? templateTypeFromQuery
    : "";
  if (
    !canUsePremiumTemplate &&
    isPremiumTemplate(initialSelectedTemplateType)
  ) {
    initialSelectedTemplateType = "";
  }

  const paramsName = searchParams.get("name");
  const paramsSlug = searchParams.get("slug");
  const whatsappNumber = userProfile?.whatsappNumber;

  const [formData, setFormData] = useState({
    name: paramsName || "",
    slug: paramsSlug || "",
    description: "",
    type: initialSelectedTemplateType,
    whatsappNumber: whatsappNumber || "",
    category: "",
    generateWithAI: true,
    image: null as File | null,
  });

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    setTouchedFields((prev) => ({ ...prev, slug: true }));
    setFormData((prev) => ({ ...prev, slug: val }));
  };

  const handleTemplateChange = (newTemplateType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("template", newTemplateType);
    router.replace(`?${params.toString()}`);
    setFormData((prev) => ({ ...prev, type: newTemplateType }));
    if (errors.type) setErrors((prev) => ({ ...prev, type: "" }));
  };

  const validateFields = useCallback(
    (currentStep: number, isLive = false) => {
      const newErrors: Record<string, string> = {};

      if (currentStep === 1) {
        // Name validation
        if (!isLive || touchedFields.name) {
          if (!formData.name.trim())
            newErrors.name = "Business name is required.";
        }

        // WhatsApp validation
        if (!isLive || touchedFields.whatsappNumber) {
          if (!formData.whatsappNumber.trim()) {
            newErrors.whatsappNumber = "WhatsApp number is required.";
          } else if (
            !/^\d{7,15}$/.test(formData.whatsappNumber.replace(/\D/g, ""))
          ) {
            newErrors.whatsappNumber = "Please enter a valid phone number.";
          }
        }
      } else if (currentStep === 2) {
        if (!formData.category) {
          newErrors.category = "Please select a category.";
        }
      } else if (currentStep === 3) {
        if (!formData.type) {
          newErrors.type = "Please select a style to continue.";
        }
      } else if (currentStep === 4) {
        if (!formData.description.trim()) {
          newErrors.description =
            "A short description helps us build your site.";
        }
      }

      return newErrors;
    },
    [
      formData.category,
      formData.description,
      formData.name,
      formData.type,
      formData.whatsappNumber,
      touchedFields.name,
      touchedFields.whatsappNumber,
    ],
  );

  // Run live validation as user types
  useEffect(() => {
    const liveErrors = validateFields(step, true);
    setErrors(liveErrors);
  }, [formData, step, touchedFields, validateFields]);

  const nextStep = async () => {
    // Mark current step fields as touched/dirty on submission attempt
    if (step === 1) {
      setTouchedFields({ name: true, whatsappNumber: true });
    }

    const stepErrors = validateFields(step, false);
    if (Object.keys(stepErrors).length === 0) {
      if (step === 1) {
        setLoading(true);
        try {
          // Auto-generate slug if not set or empty
          let slugToUse = formData.slug;
          if (!slugToUse) {
            slugToUse = formData.name
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "");
            setFormData((prev) => ({ ...prev, slug: slugToUse }));
          }

          const res = await authFetch(`/api/sites?slug=${slugToUse}`, {
            method: "GET",
          });
          const data = await res.json();
          if (!data.available) {
            setErrors((prev) => ({
              ...prev,
              name: "A site with a similar name already exists. Try adding your city or a unique word.",
            }));
            return;
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
      setStep((prev) => prev + 1);
      setTouchedFields({});
      setErrors({});
      window.scrollTo(0, 0);
    } else {
      setErrors(stepErrors);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    setTouchedFields({});
    setErrors({});
    window.scrollTo(0, 0);
  };

  const handleCreate = async () => {
    if (!user) return toast.error("Please login first.");

    const stepErrors = validateFields(4, false);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("slug", formData.slug.trim());
      formDataToSend.append("type", formData.type);
      formDataToSend.append(
        "description",
        `Category: ${formData.category}. ${formData.description}`,
      );
      formDataToSend.append("generateWithAI", String(formData.generateWithAI));
      formDataToSend.append("whatsappNumber", formData.whatsappNumber);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const res = await authFetch("/api/sites", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error?.toLowerCase().includes("slug")) {
          setErrors({
            name: "Something went wrong with the URL. Please try a different name.",
          });
          setStep(1);
          return;
        }
        throw new Error(data.error || "Failed to create site.");
      }

      toast.success("Your site is ready!");
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

  const steps = [
    { id: 1, label: "Identity" },
    { id: 2, label: "Magic" },
    { id: 3, label: "Style" },
    { id: 4, label: "Launch" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Launch Your Site
        </h1>
        <p className="text-slate-500 mt-2 text-base sm:text-lg">
          Complete these simple steps to go live.
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-8 sm:mb-12 relative px-2">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 hidden sm:block" />
        <div className="relative flex justify-between items-center max-w-2xl mx-auto">
          {steps.map((s) => (
            <div
              key={s.id}
              className="flex flex-col items-center relative z-10 bg-white px-2 sm:px-4"
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-300 border-2 ${
                  step === s.id
                    ? "bg-primary border-primary text-white scale-110 shadow-lg"
                    : step > s.id
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {step > s.id ? <Check size={18} /> : s.id}
              </div>
              <span
                className={`mt-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                  step === s.id ? "text-primary" : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl sm:rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-5 sm:p-10">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  Tell us about your business
                </h2>
                <p className="text-foreground/70 text-xs sm:text-sm">
                  We&apos;ll use this to build your digital presence.
                </p>
              </div>
              <NewSiteForm
                step={1}
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                onSlugChange={handleSlugChange}
                errors={errors}
                setTouchedFields={setTouchedFields}
              />
              <div className="pt-4">
                <button
                  disabled={loading}
                  onClick={nextStep}
                  className="w-full h-12 sm:h-14 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Next: The Magic <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-bg-foreground">
                  What do you do?
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Select your business category so we can pick the best tools
                  for you.
                </p>
              </div>
              {errors.category && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl sm:rounded-2xl text-sm font-bold flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-2">
                  <X size={18} /> {errors.category}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* We'll use a simplified category picker here */}
                {templatesCategories.map((cat: string) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, category: cat }));
                      if (errors.category)
                        setErrors((prev) => ({ ...prev, category: "" }));
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all text-center ${
                      formData.category === cat
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-sm"
                        : "border-slate-100 hover:border-slate-200 text-slate-600 font-medium"
                    }`}
                  >
                    {toCapitalize(cat, {
                      titleCase: true,
                      ignoreSmallWords: true,
                    })}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={prevStep}
                  className="order-2 sm:order-1 flex-1 h-12 sm:h-14 bg-slate-100 text-slate-600 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all text-sm sm:text-base py-2"
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  onClick={nextStep}
                  className="order-1 sm:order-2 flex-2 h-12 sm:h-14 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm sm:text-base py-2"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Pick a style
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Choose the visual vibe that fits your brand.
                </p>
              </div>
              {errors.type && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl sm:rounded-2xl text-sm font-bold flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-2">
                  <X size={18} /> {errors.type}
                </div>
              )}
              <TemplatePicker
                selectedType={formData.type}
                onTemplateChange={handleTemplateChange}
                category={formData.category}
                slugForPreview={formData.slug}
                nameForPreview={formData.name}
                canUsePremiumTemplate={canUsePremiumTemplate}
              />
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={prevStep}
                  className="order-2 sm:order-1 flex-1 h-12 sm:h-14 bg-slate-100 text-slate-600 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all text-sm sm:text-base py-2"
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  onClick={nextStep}
                  className="order-1 sm:order-2 flex-2 h-12 sm:h-14 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm sm:text-base py-2"
                >
                  Looking Good <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Ready to launch?
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Add a short description. We&apos;ll use AI to fill in the
                  rest.
                </p>
              </div>
              <NewSiteForm
                step={3} // We'll keep step 3 for the form logic as it matches description/image
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                onSlugChange={handleSlugChange}
                errors={errors}
                setTouchedFields={setTouchedFields}
              />
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <button
                  onClick={prevStep}
                  disabled={loading}
                  className="order-2 sm:order-1 flex-1 h-12 py-2 sm:h-14 bg-slate-100 text-slate-600 rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-50 text-sm sm:text-base"
                >
                  <ArrowLeft size={18} /> Back
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="order-1 sm:order-2 flex-2 h-12 py-2 sm:h-14 bg-primary text-primary-foreground rounded-xl sm:rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 text-sm sm:text-base"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Build My Website <Rocket size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
