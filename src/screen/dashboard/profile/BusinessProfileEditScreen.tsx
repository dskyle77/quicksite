/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Loader2,
  Upload,
  Sparkles,
  Image as ImageIcon,
  Building2,
  Save,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProfileStore } from "@/store/useProfileStore";
import { toast } from "sonner";
import authFetch from "@/lib/authFetch";
import { BUSINESS_CATEGORIES, type BusinessCategory } from "@/lib/business";

// ── Constants ─────────────────────────────────────────────────────────────────

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  category: BusinessCategory;
  whatsappNumber: string;
  tagline: string;
  description: string;
  city: string;
  state: string;
  email: string;
  website: string;
  logoFile: File | null;
  coverFile: File | null;
  logoPreview: string;
  coverPreview: string;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BusinessProfileEditScreen() {
  const { user } = useAuth();
  const { profile } = useProfileStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [bizProfile, setBizProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    category: "services",
    whatsappNumber: "",
    tagline: "",
    description: "",
    city: "",
    state: "",
    email: "",
    website: "",
    logoFile: null,
    coverFile: null,
    logoPreview: "",
    coverPreview: "",
  });

  // Load business profile
  useEffect(() => {
    async function load() {
      if (!profile?.businessSlug) {
        setInitialLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/business/${profile.businessSlug}`);
        const data = await res.json();
        if (data.profile) {
          setBizProfile(data.profile);
          setForm({
            name: data.profile.name || "",
            category: data.profile.category || "services",
            whatsappNumber: (data.profile.whatsappNumber || "").replace(
              /^234/,
              "",
            ),
            tagline: data.profile.tagline || "",
            description: data.profile.description || "",
            city: data.profile.city || "",
            state: data.profile.state || "",
            email: data.profile.email || "",
            website: data.profile.website || "",
            logoFile: null,
            coverFile: null,
            logoPreview: data.profile.logoUrl || "",
            coverPreview: data.profile.coverUrl || "",
          });
        }
      } catch (err) {
        console.error("Failed to load business profile:", err);
      } finally {
        setInitialLoading(false);
      }
    }
    load();
  }, [profile?.businessSlug]);

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validated = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
    setForm((p) => ({ ...p, whatsappNumber: validated }));
  };

  const set =
    (field: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleImageChange =
    (type: "logo" | "cover") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5MB.");
        return;
      }
      const preview = URL.createObjectURL(file);
      if (type === "logo") {
        setForm((p) => ({ ...p, logoFile: file, logoPreview: preview }));
      } else {
        setForm((p) => ({ ...p, coverFile: file, coverPreview: preview }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.businessSlug) return;

    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("category", form.category);
      const digits = form.whatsappNumber.replace(/\D/g, "");
      fd.append(
        "whatsappNumber",
        digits.startsWith("234") ? digits : `234${digits.replace(/^0/, "")}`,
      );

      fd.append("tagline", form.tagline.trim());
      fd.append("description", form.description.trim());
      fd.append("city", form.city.trim());
      fd.append("state", form.state);
      fd.append("email", form.email.trim());
      fd.append("website", form.website.trim());

      if (form.logoFile) fd.append("logo", form.logoFile);
      if (form.coverFile) fd.append("cover", form.coverFile);

      const res = await authFetch(`/api/business/${profile.businessSlug}`, {
        method: "PATCH",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update business profile.");
      }

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile?.hasBusinessProfile) {
    return (
      <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-4">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
        <h2 className="text-xl font-bold">No Business Profile Found</h2>
        <p className="text-muted-foreground max-w-xs mx-auto">
          You haven&apos;t created a business profile yet. Complete onboarding
          to get started.
        </p>
        <button
          onClick={() => router.push("/onboarding")}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition"
        >
          Create Profile
        </button>
      </div>
    );
  }

  const isPaid = profile.plan === "growth" || profile.plan === "pro";

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Business Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your public brand and contact details.
          </p>
        </div>
        <a
          href={`/biz/${profile.businessSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          View Public Page <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3 text-destructive text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 pb-20">
        {/* ── Basics ── */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Basic Information
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold">Business Name</label>
              <input
                type="text"
                value={form.name}
                onChange={set("name")}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold">Category</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    category: e.target.value as BusinessCategory,
                  }))
                }
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
              >
                {BUSINESS_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold">WhatsApp Number</label>
            <div className="flex items-stretch rounded-xl border border-border overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
              <span className="flex items-center px-4 bg-muted border-r border-border text-sm font-bold text-muted-foreground">
                +234
              </span>
              <input
                type="tel"
                value={form.whatsappNumber}
                onChange={handleWhatsappChange}
                placeholder="8012345678"
                className="flex-1 bg-background px-4 py-2.5 text-sm outline-none"
                required
              />
            </div>
          </div>
        </section>

        {/* ── Story ── */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Profile Content
          </h2>

          <div className="space-y-2">
            <label className="text-xs font-bold">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={set("tagline")}
              placeholder="A short catchphrase..."
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold">Description</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              placeholder="Tell your customers about your business..."
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 min-h-32 resize-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold">City</label>
              <input
                type="text"
                value={form.city}
                onChange={set("city")}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold">State</label>
              <select
                value={form.state}
                onChange={set("state")}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
              >
                <option value="">Select State...</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ── Brand ── */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ImageIcon className="h-4 w-4" /> Media & Brand
          </h2>

          <div className="space-y-4">
            <label className="text-xs font-bold">Logo / Profile Photo</label>
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-2 border-border group bg-muted flex items-center justify-center">
                {form.logoPreview ? (
                  <img
                    src={form.logoPreview}
                    alt="Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-2xl font-black text-muted-foreground/30">
                    {form.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1"
                >
                  <Upload className="h-4 w-4" /> Change
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold">Business Logo</p>
                <p className="text-xs text-muted-foreground">
                  Square image, max 5MB.
                </p>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Upload New
                </button>
              </div>
              <input
                ref={logoInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange("logo")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold">Cover Banner</label>
            <div className="relative h-40 w-full rounded-2xl overflow-hidden border-2 border-border group bg-muted">
              {form.coverPreview ? (
                <img
                  src={form.coverPreview}
                  alt="Cover"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground/20 italic text-sm">
                  No cover image uploaded
                </div>
              )}
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-bold gap-2"
              >
                <Upload className="h-6 w-6" /> Change Cover Banner
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground italic text-right">
              Landscape recommended, max 5MB.
            </p>
            <input
              ref={coverInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange("cover")}
            />
          </div>
        </section>

        {/* ── Fixed Bottom Save Bar ── */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-40">
          <div className="bg-card/80 backdrop-blur-md border border-border shadow-2xl rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-foreground">
                Plan:{" "}
                <span className="text-primary capitalize">{profile.plan}</span>
              </p>
              <p className="text-[10px] text-muted-foreground">
                {isPaid ? "Update once a day" : "Update once a week"}
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 sm:flex-none h-10 px-6 rounded-xl border border-border text-sm font-bold hover:bg-muted transition"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-2 sm:flex-none h-10 px-8 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
