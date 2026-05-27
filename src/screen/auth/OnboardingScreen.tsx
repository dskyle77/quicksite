/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Zap,
  ArrowRight,
  Loader2,
  Check,
  Globe,
  Layout,
  Smartphone,
  ChevronLeft,
  Upload,
  X,
  MapPin,
  Phone,
  Mail,
  Tag,
  Sparkles,
  Image as ImageIcon,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useProfileStore } from "@/store/useProfileStore";
import { toast } from "sonner";
import authFetch from "@/lib/authFetch";
import { BUSINESS_CATEGORIES, type BusinessCategory } from "@/lib/business";

// ── Constants ─────────────────────────────────────────────────────────────────

const SITE_STANDARD_NAME =
  process.env.NEXT_PUBLIC_SITE_STANDARD_NAME || "Quicksite";

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

const STEPS = [
  { n: 1, label: "Welcome" },
  { n: 2, label: "Basics" },
  { n: 3, label: "Details" },
  { n: 4, label: "Brand" },
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  slug: string;
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

// ── Main component ────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const { user } = useAuth();
  const { profile, refreshProfile } = useProfileStore();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const slugTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
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

  useEffect(() => {
    if (profile?.hasBusinessProfile) router.replace("/dashboard");
  }, [profile, router]);

  // ── Slug check ──────────────────────────────────────────────────────────────

  const checkSlug = (slug: string) => {
    if (slugTimer.current) clearTimeout(slugTimer.current);
    if (slug.length < 3) {
      setSlugAvailable(null);
      return;
    }
    setSlugChecking(true);
    slugTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/business/${slug}`);
        setSlugAvailable(res.status === 404);
      } catch {
        setSlugAvailable(null);
      } finally {
        setSlugChecking(false);
      }
    }, 600);
  };

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = slugEdited ? form.slug : toSlug(name);
    setForm((p) => ({ ...p, name, slug }));
    if (!slugEdited) checkSlug(slug);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = toSlug(e.target.value);
    setSlugEdited(true);
    setForm((p) => ({ ...p, slug }));
    checkSlug(slug);
  };

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

  // ── Validation ──────────────────────────────────────────────────────────────

  const validateStep2 = () => {
    if (!form.name.trim()) return "Business name is required.";
    if (form.slug.length < 3)
      return "URL handle must be at least 3 characters.";
    if (slugAvailable === false) return "That URL is already taken.";
    if (!form.category) return "Please select a category.";
    if (form.whatsappNumber.replace(/\D/g, "").length < 10)
      return "Enter a valid WhatsApp number.";
    return null;
  };

  const handleNext = () => {
    if (step === 2) {
      const err = validateStep2();
      if (err) {
        toast.error(err);
        return;
      }
    }
    setStep((s) => s + 1);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("slug", form.slug);
      fd.append("category", form.category);
      const digits = form.whatsappNumber.replace(/\D/g, "");
      fd.append(
        "whatsappNumber",
        digits.startsWith("234") ? digits : `234${digits.replace(/^0/, "")}`,
      );
      if (form.tagline) fd.append("tagline", form.tagline.trim());
      if (form.description) fd.append("description", form.description.trim());
      if (form.city) fd.append("city", form.city.trim());
      if (form.state) fd.append("state", form.state);
      if (form.email) fd.append("email", form.email.trim());
      if (form.website) fd.append("website", form.website.trim());
      if (form.logoFile) fd.append("logo", form.logoFile);
      if (form.coverFile) fd.append("cover", form.coverFile);

      const res = await authFetch("/api/business", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to create business profile.");
      toast.success("Business profile created!");
      if (user) await refreshProfile(user.uid);
      router.push(`/biz/${data.slug}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (profile?.hasBusinessProfile) return null;

  return (
    <div className="ob-root">
      {/* ── Ambient background ── */}
      <div className="ob-bg" aria-hidden>
        <div className="ob-blob ob-blob-1" />
        <div className="ob-blob ob-blob-2" />
        <div className="ob-grid" />
      </div>

      <div className="ob-shell">
        {/* ── Logo mark ── */}
        <div className="ob-logomark">
          <div className="ob-logomark-icon">
            <Zap className="ob-zap" />
          </div>
          <span className="ob-logomark-name">{SITE_STANDARD_NAME}</span>
        </div>

        {/* ── Step tracker ── */}
        <div className="ob-steps">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.n}>
              <button
                className={`ob-step ${step === s.n ? "ob-step-active" : ""} ${step > s.n ? "ob-step-done" : ""}`}
                onClick={() => step > s.n && setStep(s.n)}
                type="button"
              >
                <span className="ob-step-num">
                  {step > s.n ? <Check className="h-3 w-3" /> : s.n}
                </span>
                <span className="ob-step-label">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`ob-step-line ${step > s.n ? "ob-step-line-done" : ""}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Card ── */}
        <div className="ob-card">
          {/* STEP 1 — Welcome */}
          {step === 1 && (
            <div className="ob-panel" key="s1">
              <div className="ob-welcome-badge">
                <Zap className="h-5 w-5 fill-current" />
                <span>Free to get started</span>
              </div>
              <h1 className="ob-h1">
                Your business,
                <br />
                <em>on the web today.</em>
              </h1>
              <p className="ob-welcome-sub">
                Create your professional business page in minutes — complete
                with a custom URL, WhatsApp contact button, and a beautiful
                public profile.
              </p>

              <div className="ob-features">
                {[
                  {
                    icon: Globe,
                    title: "Custom URL",
                    desc: "Your own quicksite.ng address",
                  },
                  {
                    icon: Layout,
                    title: "Profile Page",
                    desc: "Beautiful public business page",
                  },
                  {
                    icon: Smartphone,
                    title: "WhatsApp Ready",
                    desc: "Customers contact you directly",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="ob-feature">
                    <div className="ob-feature-icon">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="ob-feature-title">{title}</p>
                      <p className="ob-feature-desc">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setStep(2)} className="ob-btn-primary">
                Get Started <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* STEP 2 — Business Basics */}
          {step === 2 && (
            <div className="ob-panel" key="s2">
              <div className="ob-step-eyebrow">
                <Building2 className="h-4 w-4" /> Step 2 of 4
              </div>
              <h2 className="ob-h2">Business Basics</h2>
              <p className="ob-step-sub">
                The essentials for your public profile.
              </p>

              <div className="ob-fields">
                {/* Name */}
                <OBField label="Business Name" required>
                  <input
                    type="text"
                    placeholder="e.g. Sunny's Bakery"
                    value={form.name}
                    onChange={handleNameChange}
                    className="ob-input"
                    autoFocus
                    maxLength={80}
                  />
                </OBField>

                {/* Slug */}
                <OBField
                  label="Your Web Address"
                  required
                  hint={
                    form.slug.length >= 3 ? (
                      slugChecking ? (
                        <span className="ob-hint-neutral">
                          <Loader2 className="h-3 w-3 animate-spin" /> Checking…
                        </span>
                      ) : slugAvailable === true ? (
                        <span className="ob-hint-ok">
                          <Check className="h-3 w-3" /> Available
                        </span>
                      ) : slugAvailable === false ? (
                        <span className="ob-hint-err">
                          <X className="h-3 w-3" /> Already taken
                        </span>
                      ) : null
                    ) : null
                  }
                >
                  <div className="ob-input-group">
                    <span className="ob-input-prefix">quicksite.biz/biz/</span>
                    <input
                      type="text"
                      placeholder="your-business"
                      value={form.slug}
                      onChange={handleSlugChange}
                      className="ob-input-inner"
                      maxLength={50}
                    />
                  </div>
                  <p className="ob-micro">
                    Lowercase letters, numbers and hyphens only.
                  </p>
                </OBField>

                {/* Category */}
                <OBField
                  label="Category"
                  required
                  icon={<Tag className="h-3.5 w-3.5" />}
                >
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        category: e.target.value as BusinessCategory,
                      }))
                    }
                    className="ob-input ob-select"
                  >
                    {BUSINESS_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.emoji} {cat.label}
                      </option>
                    ))}
                  </select>
                </OBField>

                {/* WhatsApp */}
                <OBField
                  label="WhatsApp Number"
                  required
                  icon={<Phone className="h-3.5 w-3.5" />}
                >
                  <div className="ob-input-group">
                    <span className="ob-input-prefix ob-input-prefix-dark">
                      +234
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      placeholder="8012345678"
                      value={form.whatsappNumber}
                      onChange={handleWhatsappChange}
                      className="ob-input-inner"
                    />
                  </div>
                  <p className="ob-micro">Your active WhatsApp number.</p>
                </OBField>
              </div>

              <OBNav onBack={() => setStep(1)} onNext={handleNext} />
            </div>
          )}

          {/* STEP 3 — Tell Your Story */}
          {step === 3 && (
            <div className="ob-panel" key="s3">
              <div className="ob-step-eyebrow">
                <Sparkles className="h-4 w-4" /> Step 3 of 4
              </div>
              <h2 className="ob-h2">Tell Your Story</h2>
              <p className="ob-step-sub">
                Help customers understand what you offer.{" "}
                <span className="ob-optional">
                  All optional — you can edit later.
                </span>
              </p>

              <div className="ob-fields">
                <OBField label="Tagline">
                  <input
                    type="text"
                    placeholder="e.g. Fresh baked goods, daily delivery"
                    value={form.tagline}
                    onChange={set("tagline")}
                    className="ob-input"
                    maxLength={100}
                  />
                </OBField>

                <OBField label="Description">
                  <textarea
                    placeholder="What do you offer? What makes you special? Opening hours?"
                    value={form.description}
                    onChange={set("description")}
                    className="ob-input ob-textarea"
                    rows={4}
                    maxLength={1000}
                  />
                  <p className="ob-micro ob-micro-right">
                    {form.description.length}/1000
                  </p>
                </OBField>

                <div className="ob-grid-2">
                  <OBField
                    label="City"
                    icon={<MapPin className="h-3.5 w-3.5" />}
                  >
                    <input
                      type="text"
                      placeholder="Lagos"
                      value={form.city}
                      onChange={set("city")}
                      className="ob-input"
                    />
                  </OBField>
                  <OBField label="State">
                    <select
                      value={form.state}
                      onChange={set("state")}
                      className="ob-input ob-select"
                    >
                      <option value="">Select…</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </OBField>
                </div>

                <OBField label="Email" icon={<Mail className="h-3.5 w-3.5" />}>
                  <input
                    type="email"
                    placeholder="hello@yourbusiness.com"
                    value={form.email}
                    onChange={set("email")}
                    className="ob-input"
                  />
                </OBField>

                <OBField
                  label="Website"
                  icon={<Globe className="h-3.5 w-3.5" />}
                >
                  <input
                    type="url"
                    placeholder="https://yourbusiness.com"
                    value={form.website}
                    onChange={set("website")}
                    className="ob-input"
                  />
                </OBField>
              </div>

              <OBNav onBack={() => setStep(2)} onNext={handleNext} />
            </div>
          )}

          {/* STEP 4 — Brand / Media */}
          {step === 4 && (
            <form className="ob-panel" key="s4" onSubmit={handleSubmit}>
              <div className="ob-step-eyebrow">
                <ImageIcon className="h-4 w-4" /> Step 4 of 4
              </div>
              <h2 className="ob-h2">Add Your Brand</h2>
              <p className="ob-step-sub">
                A logo and cover image make your profile stand out.{" "}
                <span className="ob-optional">
                  Optional — you can add these later.
                </span>
              </p>

              <div className="ob-fields">
                {/* Logo */}
                <OBField label="Logo / Profile Photo">
                  {form.logoPreview ? (
                    <div className="ob-image-preview">
                      <img
                        src={form.logoPreview}
                        alt="logo"
                        className="ob-logo-thumb"
                      />
                      <div className="ob-image-meta">
                        <p className="ob-filename">{form.logoFile?.name}</p>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((p) => ({
                              ...p,
                              logoFile: null,
                              logoPreview: "",
                            }))
                          }
                          className="ob-remove-btn"
                        >
                          <X className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <DropZone
                      onClick={() => logoInputRef.current?.click()}
                      hint="Square · PNG, JPG, WebP · max 5MB"
                      aspect="1:1"
                    />
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange("logo")}
                    className="sr-only"
                  />
                </OBField>

                {/* Cover */}
                <OBField label="Cover Image">
                  {form.coverPreview ? (
                    <div className="ob-cover-preview">
                      <img
                        src={form.coverPreview}
                        alt="cover"
                        className="ob-cover-thumb"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            coverFile: null,
                            coverPreview: "",
                          }))
                        }
                        className="ob-cover-remove"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <DropZone
                      onClick={() => coverInputRef.current?.click()}
                      hint="Landscape banner · PNG, JPG, WebP · max 5MB"
                      aspect="16:9"
                      wide
                    />
                  )}
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange("cover")}
                    className="sr-only"
                  />
                </OBField>

                {/* Profile preview card */}
                <div className="ob-preview-card">
                  <p className="ob-preview-label">Preview</p>
                  <div className="ob-preview-inner">
                    {form.logoPreview ? (
                      <img
                        src={form.logoPreview}
                        alt=""
                        className="ob-preview-avatar"
                      />
                    ) : (
                      <div className="ob-preview-avatar ob-preview-avatar-fallback">
                        {form.name.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                    <div className="ob-preview-text">
                      <p className="ob-preview-name">
                        {form.name || "Your Business Name"}
                      </p>
                      <p className="ob-preview-tagline">
                        {form.tagline || "Your tagline will appear here…"}
                      </p>
                      {form.city && (
                        <p className="ob-preview-city">
                          <MapPin className="h-3 w-3" />
                          {form.city}
                          {form.state ? `, ${form.state}` : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="ob-submit-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="ob-btn-primary ob-btn-submit"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Creating
                      profile…
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5" /> Finish &amp; View Profile
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={loading}
                  className="ob-btn-ghost"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="ob-footer">
          Need help?{" "}
          <a href="mailto:support@quicksite.com" className="ob-footer-link">
            Contact support
          </a>
        </p>
      </div>

      {/* ── All scoped styles ── */}
      <style jsx global>{`
        /* ── Fonts ── */
        .ob-h1,
        .ob-h2,
        .ob-step-num,
        .ob-welcome-badge,
        .ob-logomark-name {
          font-family: "Syne", sans-serif;
        }
        .ob-root {
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        /* ── Root & layout ── */
        .ob-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1rem;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        .ob-shell {
          position: relative;
          width: 100%;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          z-index: 1;
        }

        /* ── Ambient background ── */
        .ob-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .ob-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.45;
        }
        .ob-blob-1 {
          width: 480px;
          height: 480px;
          top: -120px;
          left: -160px;
          background: radial-gradient(
            circle,
            color-mix(in srgb, var(--primary) 30%, transparent),
            transparent 70%
          );
        }
        .ob-blob-2 {
          width: 400px;
          height: 400px;
          bottom: -100px;
          right: -120px;
          background: radial-gradient(
            circle,
            color-mix(in srgb, var(--secondary) 20%, transparent),
            transparent 70%
          );
        }
        .ob-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(
              color-mix(in srgb, var(--border) 60%, transparent) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              color-mix(in srgb, var(--border) 60%, transparent) 1px,
              transparent 1px
            );
          background-size: 40px 40px;
          opacity: 0.3;
        }

        /* ── Logo mark ── */
        .ob-logomark {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .ob-logomark-icon {
          width: 2rem;
          height: 2rem;
          background: var(--primary);
          border-radius: 0.5rem;
          display: grid;
          place-items: center;
        }
        .ob-zap {
          width: 1rem;
          height: 1rem;
          color: var(--primary-foreground);
          fill: currentColor;
        }
        .ob-logomark-name {
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--foreground);
        }

        /* ── Step tracker ── */
        .ob-steps {
          display: flex;
          align-items: center;
          gap: 0;
          width: 100%;
          padding: 0 0.25rem;
        }
        .ob-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          cursor: default;
          flex-shrink: 0;
        }
        .ob-step-done {
          cursor: pointer;
        }
        .ob-step-num {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: 2px solid var(--border);
          background: var(--card);
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--muted-foreground);
          display: grid;
          place-items: center;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .ob-step-active .ob-step-num {
          border-color: var(--primary);
          background: var(--primary);
          color: var(--primary-foreground);
          box-shadow: 0 0 0 4px
            color-mix(in srgb, var(--primary) 20%, transparent);
          transform: scale(1.1);
        }
        .ob-step-done .ob-step-num {
          border-color: var(--primary);
          background: color-mix(in srgb, var(--primary) 15%, transparent);
          color: var(--primary);
        }
        .ob-step-label {
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--muted-foreground);
          transition: color 0.2s;
        }
        .ob-step-active .ob-step-label {
          color: var(--primary);
        }
        .ob-step-done .ob-step-label {
          color: var(--primary);
        }
        .ob-step-line {
          flex: 1;
          height: 2px;
          margin-bottom: 1.25rem;
          background: var(--border);
          transition: background 0.4s;
        }
        .ob-step-line-done {
          background: var(--primary);
        }

        /* ── Card ── */
        .ob-card {
          width: 100%;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 1.5rem;
          box-shadow:
            0 4px 6px -1px color-mix(in srgb, var(--foreground) 4%, transparent),
            0 20px 40px -12px
              color-mix(in srgb, var(--primary) 12%, transparent);
          overflow: hidden;
        }

        /* ── Panel ── */
        .ob-panel {
          padding: 2.25rem;
          animation: ob-slide-in 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        @keyframes ob-slide-in {
          from {
            opacity: 0;
            transform: translateX(16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* ── Welcome step ── */
        .ob-welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.75rem;
          background: color-mix(in srgb, var(--primary) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--primary) 25%, transparent);
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: var(--primary);
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }
        .ob-h1 {
          font-size: clamp(1.75rem, 5vw, 2.25rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: var(--foreground);
          margin-bottom: 0.875rem;
        }
        .ob-h1 em {
          font-style: italic;
          color: var(--primary);
          font-family: "Fraunces", serif;
          font-weight: 600;
        }
        .ob-welcome-sub {
          font-size: 0.9rem;
          color: var(--muted-foreground);
          line-height: 1.65;
          margin-bottom: 1.75rem;
        }
        .ob-features {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        .ob-feature {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.875rem 1rem;
          background: var(--muted);
          border-radius: 0.875rem;
          border: 1px solid var(--border);
          transition: border-color 0.2s;
        }
        .ob-feature:hover {
          border-color: color-mix(in srgb, var(--primary) 40%, transparent);
        }
        .ob-feature-icon {
          width: 2.25rem;
          height: 2.25rem;
          flex-shrink: 0;
          background: color-mix(in srgb, var(--primary) 12%, transparent);
          border-radius: 0.6rem;
          display: grid;
          place-items: center;
          color: var(--primary);
        }
        .ob-feature-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--foreground);
        }
        .ob-feature-desc {
          font-size: 0.7rem;
          color: var(--muted-foreground);
          margin-top: 0.1rem;
        }

        /* ── Step header elements ── */
        .ob-step-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 0.5rem;
        }
        .ob-h2 {
          font-size: 1.65rem;
          font-weight: 800;
          letter-spacing: -0.025em;
          color: var(--foreground);
          margin-bottom: 0.25rem;
        }
        .ob-step-sub {
          font-size: 0.82rem;
          color: var(--muted-foreground);
          line-height: 1.5;
          margin-bottom: 0;
        }
        .ob-optional {
          font-size: 0.75rem;
          color: color-mix(in srgb, var(--muted-foreground) 70%, transparent);
          font-style: italic;
        }

        /* ── Fields ── */
        .ob-fields {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          margin-top: 1.5rem;
        }
        .ob-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .ob-field-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .ob-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--foreground);
        }
        .ob-label-icon {
          color: var(--muted-foreground);
        }
        .ob-required {
          color: var(--secondary);
          margin-left: 0.1rem;
        }

        /* ── Inputs ── */
        .ob-input {
          width: 100%;
          height: 2.75rem;
          padding: 0 0.9rem;
          border-radius: 0.75rem;
          border: 1.5px solid var(--input);
          background: var(--background);
          font-size: 0.875rem;
          color: var(--foreground);
          font-family: "Plus Jakarta Sans", sans-serif;
          outline: none;
          transition:
            border-color 0.15s,
            box-shadow 0.15s,
            background 0.15s;
        }
        .ob-input::placeholder {
          color: var(--muted-foreground);
        }
        .ob-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px
            color-mix(in srgb, var(--primary) 18%, transparent);
          background: color-mix(in srgb, var(--primary) 3%, var(--background));
        }
        .ob-textarea {
          height: auto !important;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          resize: none;
          line-height: 1.55;
        }
        .ob-select {
          appearance: none;
          cursor: pointer;
        }

        /* ── Input group (slug, whatsapp) ── */
        .ob-input-group {
          display: flex;
          align-items: stretch;
          border: 1.5px solid var(--input);
          border-radius: 0.75rem;
          overflow: hidden;
          background: var(--background);
          transition:
            border-color 0.15s,
            box-shadow 0.15s;
        }
        .ob-input-group:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px
            color-mix(in srgb, var(--primary) 18%, transparent);
        }
        .ob-input-prefix {
          display: flex;
          align-items: center;
          padding: 0 0.75rem;
          background: var(--muted);
          border-right: 1.5px solid var(--input);
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--muted-foreground);
          white-space: nowrap;
          flex-shrink: 0;
          font-family: "JetBrains Mono", monospace;
        }
        .ob-input-prefix-dark {
          background: color-mix(in srgb, var(--primary) 10%, var(--muted));
          color: var(--primary);
          font-size: 0.85rem;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-weight: 700;
        }
        .ob-input-inner {
          flex: 1;
          background: transparent;
          padding: 0 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--foreground);
          font-family: "Plus Jakarta Sans", sans-serif;
          outline: none;
          border: none;
          min-width: 0;
        }
        .ob-input-inner::placeholder {
          color: var(--muted-foreground);
          font-weight: 400;
        }

        /* ── Hint rows ── */
        .ob-hint-neutral,
        .ob-hint-ok,
        .ob-hint-err {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.72rem;
          font-weight: 600;
        }
        .ob-hint-neutral {
          color: var(--muted-foreground);
        }
        .ob-hint-ok {
          color: #16a34a;
        }
        .ob-hint-err {
          color: var(--destructive);
        }
        .ob-micro {
          font-size: 0.7rem;
          color: var(--muted-foreground);
          margin-top: 0.15rem;
        }
        .ob-micro-right {
          text-align: right;
        }

        /* ── Buttons ── */
        .ob-btn-primary {
          width: 100%;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: var(--primary);
          color: var(--primary-foreground);
          border: none;
          border-radius: 0.875rem;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          font-family: "Syne", sans-serif;
          cursor: pointer;
          transition:
            opacity 0.15s,
            transform 0.15s,
            box-shadow 0.15s;
          box-shadow: 0 4px 14px
            color-mix(in srgb, var(--primary) 35%, transparent);
        }
        .ob-btn-primary:hover {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px
            color-mix(in srgb, var(--primary) 40%, transparent);
        }
        .ob-btn-primary:active {
          transform: translateY(0);
        }
        .ob-btn-primary:disabled {
          opacity: 0.55;
          pointer-events: none;
        }

        .ob-btn-ghost {
          width: 100%;
          padding: 0.6rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          background: transparent;
          border: none;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--muted-foreground);
          cursor: pointer;
          border-radius: 0.75rem;
          transition:
            color 0.15s,
            background 0.15s;
          font-family: "Plus Jakarta Sans", sans-serif;
        }
        .ob-btn-ghost:hover {
          color: var(--foreground);
          background: var(--muted);
        }
        .ob-btn-ghost:disabled {
          opacity: 0.4;
          pointer-events: none;
        }

        .ob-nav {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.75rem;
        }
        .ob-nav-back {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0 1rem;
          height: 2.75rem;
          flex-shrink: 0;
          border: 1.5px solid var(--border);
          border-radius: 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--muted-foreground);
          background: transparent;
          cursor: pointer;
          transition:
            color 0.15s,
            border-color 0.15s,
            background 0.15s;
          font-family: "Plus Jakarta Sans", sans-serif;
        }
        .ob-nav-back:hover {
          color: var(--foreground);
          border-color: var(--foreground);
          background: var(--muted);
        }
        .ob-nav-next {
          flex: 1;
          height: 2.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          background: var(--primary);
          color: var(--primary-foreground);
          border: none;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          font-family: "Syne", sans-serif;
          cursor: pointer;
          transition:
            opacity 0.15s,
            transform 0.15s,
            box-shadow 0.15s;
          box-shadow: 0 4px 12px
            color-mix(in srgb, var(--primary) 30%, transparent);
        }
        .ob-nav-next:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        /* ── Image upload ── */
        .ob-image-preview {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .ob-logo-thumb {
          width: 4.5rem;
          height: 4.5rem;
          border-radius: 0.875rem;
          object-fit: cover;
          border: 2px solid var(--border);
          flex-shrink: 0;
        }
        .ob-image-meta {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          min-width: 0;
        }
        .ob-filename {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--foreground);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }
        .ob-remove-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--destructive);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: opacity 0.15s;
        }
        .ob-remove-btn:hover {
          opacity: 0.75;
        }
        .ob-cover-preview {
          position: relative;
        }
        .ob-cover-thumb {
          width: 100%;
          height: 7rem;
          object-fit: cover;
          border-radius: 0.875rem;
          border: 2px solid var(--border);
          display: block;
        }
        .ob-cover-remove {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.65);
          color: white;
          border: none;
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: background 0.15s;
        }
        .ob-cover-remove:hover {
          background: rgba(0, 0, 0, 0.85);
        }

        /* ── Profile preview card ── */
        .ob-preview-card {
          border: 1.5px solid var(--border);
          border-radius: 1rem;
          background: color-mix(in srgb, var(--primary) 4%, var(--muted));
          overflow: hidden;
        }
        .ob-preview-label {
          padding: 0.5rem 1rem 0;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--primary);
          font-family: "Syne", sans-serif;
        }
        .ob-preview-inner {
          padding: 0.75rem 1rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }
        .ob-preview-avatar {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 0.625rem;
          object-fit: cover;
          border: 2px solid var(--border);
          flex-shrink: 0;
        }
        .ob-preview-avatar-fallback {
          background: var(--primary);
          color: var(--primary-foreground);
          font-size: 1.1rem;
          font-weight: 900;
          font-family: "Syne", sans-serif;
          display: grid;
          place-items: center;
        }
        .ob-preview-text {
          min-width: 0;
        }
        .ob-preview-name {
          font-size: 0.875rem;
          font-weight: 800;
          color: var(--foreground);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: "Syne", sans-serif;
        }
        .ob-preview-tagline {
          font-size: 0.73rem;
          color: var(--muted-foreground);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 0.1rem;
        }
        .ob-preview-city {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.68rem;
          color: var(--muted-foreground);
          margin-top: 0.25rem;
        }

        /* ── Submit row ── */
        .ob-submit-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1.75rem;
        }
        .ob-btn-submit {
          font-size: 0.95rem;
          height: 3.25rem;
        }

        /* ── Drop zone ── */
        .ob-dropzone {
          width: 100%;
          border: 2px dashed var(--border);
          border-radius: 0.875rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition:
            border-color 0.2s,
            background 0.2s;
          background: transparent;
        }
        .ob-dropzone:hover {
          border-color: color-mix(in srgb, var(--primary) 60%, transparent);
          background: color-mix(in srgb, var(--primary) 4%, transparent);
        }
        .ob-dropzone-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: var(--muted);
          border-radius: 0.625rem;
          display: grid;
          place-items: center;
          color: var(--muted-foreground);
          transition:
            background 0.2s,
            color 0.2s;
        }
        .ob-dropzone:hover .ob-dropzone-icon {
          background: color-mix(in srgb, var(--primary) 12%, transparent);
          color: var(--primary);
        }
        .ob-dropzone-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--foreground);
          transition: color 0.2s;
        }
        .ob-dropzone:hover .ob-dropzone-title {
          color: var(--primary);
        }
        .ob-dropzone-hint {
          font-size: 0.68rem;
          color: var(--muted-foreground);
        }
        .ob-dropzone-badge {
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: var(--muted-foreground);
          background: var(--muted);
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
          font-family: "JetBrains Mono", monospace;
        }
        .ob-dropzone-sm {
          height: 5.5rem;
        }
        .ob-dropzone-lg {
          height: 7rem;
        }

        /* ── Footer ── */
        .ob-footer {
          font-size: 0.72rem;
          color: var(--muted-foreground);
          text-align: center;
        }
        .ob-footer-link {
          color: var(--muted-foreground);
          text-decoration: underline;
          transition: color 0.15s;
        }
        .ob-footer-link:hover {
          color: var(--foreground);
        }
      `}</style>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function OBField({
  label,
  required,
  icon,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="ob-field-wrap">
      <label className="ob-label">
        {icon && <span className="ob-label-icon">{icon}</span>}
        {label}
        {required && <span className="ob-required">*</span>}
      </label>
      {children}
      {hint && <div>{hint}</div>}
    </div>
  );
}

function OBNav({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div className="ob-nav">
      <button type="button" onClick={onBack} className="ob-nav-back">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <button type="button" onClick={onNext} className="ob-nav-next">
        Continue <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function DropZone({
  onClick,
  hint,
  aspect,
  wide,
}: {
  onClick: () => void;
  hint: string;
  aspect: string;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ob-dropzone ${wide ? "ob-dropzone-lg" : "ob-dropzone-sm"}`}
    >
      <div className="ob-dropzone-icon">
        <Upload className="h-4 w-4" />
      </div>
      <div style={{ textAlign: "center" }}>
        <p className="ob-dropzone-title">Click to upload</p>
        <p className="ob-dropzone-hint">{hint}</p>
      </div>
      <span className="ob-dropzone-badge">{aspect}</span>
    </button>
  );
}
