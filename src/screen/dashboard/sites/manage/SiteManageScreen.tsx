/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  Edit3,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Loader2,
  ArrowLeft,
  Link as LinkIcon,
  Save,
  X,
  Plus,
  Hash,
} from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";
import authFetch from "@/lib/authFetch"; // Imported direct authFetch tracking pattern

const SITE_SHORT_NAME = process.env.NEXT_PUBLIC_SITE_SHORT_NAME;
const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN_NAME;

export default function SiteManageScreen() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { sites, toggleSiteStatus, removeSite } = useDashboardStore(); // Removed updateSite network call reference

  const site = sites.find((s) => s.slug === slug);

  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const imageRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [form, setForm] = useState({
    description: "",
    whatsappNumber: "",
    ogImage: "",
    tags: [] as string[],
  });

  useEffect(() => {
    if (!site) return;

    setForm({
      description: site.description ?? "",
      whatsappNumber: site.whatsappNumber ?? "",
      ogImage: site.ogImage ?? "",
      tags: site.tags ?? [],
    });

    setImageFile(null);
    setImagePreview(site.ogImage ?? "");
  }, [site]);

  const siteUrl = useMemo(() => {
    if (!site || !SITE_SHORT_NAME || !DOMAIN_NAME) return "";
    return `https://${SITE_SHORT_NAME}${DOMAIN_NAME}/${site.slug}`;
  }, [site]);

  if (!site) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Globe className="h-10 w-10 text-muted-foreground/20 mb-4" />
        <h2 className="font-bold text-xl mb-2">Site not found</h2>
        <Link
          href="/dashboard/sites"
          className="text-sm text-primary hover:underline mt-2"
        >
          ← Back to Sites
        </Link>
      </div>
    );
  }

  const isDirty =
    form.description !== (site.description ?? "") ||
    form.whatsappNumber !== (site.whatsappNumber ?? "") ||
    JSON.stringify(form.tags) !== JSON.stringify(site.tags ?? []) ||
    imageFile !== null;

  const handleToggle = async () => {
    if (!user) return;
    setToggling(true);

    try {
      const token = await user.getIdToken();
      await toggleSiteStatus(site.id, token);

      toast.success(
        site.status === "published" ? "Site unpublished." : "Site published!",
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update status.",
      );
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setDeleting(true);

    try {
      const token = await user.getIdToken();
      await removeSite(site.id, token);
      toast.success("Site deleted.");
      router.push("/dashboard/sites");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete site.",
      );
      setDeleting(false);
    }
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (!t || form.tags.includes(t)) return;
    setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

  const handleImageClick = () => {
    imageRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Rewritten saving handler utilizing FormData directly over the direct API connection wrapper
  const handleSave = async () => {
    if (!user || !isDirty) return;

    setSaving(true);
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("description", form.description.trim());
      formDataToSend.append("whatsappNumber", form.whatsappNumber.trim());

      // Send tags as a JSON stringified array (per API contract)
      if (Array.isArray(form.tags)) {
        formDataToSend.append("tags", JSON.stringify(form.tags));
      }

      if (imageFile) {
        formDataToSend.append("ogImage", imageFile);
      }

      const res = await authFetch(`/api/sites/${site.id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings.");
      }

      toast.success("Settings saved successfully.");
      setImageFile(null);

      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <Link
        href="/dashboard/sites"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Sites
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black">{site.name}</h1>

          {siteUrl && (
            <a
              href={siteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
            >
              {siteUrl} <ExternalLink className="h-3 w-3" />
            </a>
          )}

          {site.customDomain && (
            <a
              href={`https://${site.customDomain}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-600 hover:underline flex items-center gap-1 mt-0.5"
            >
              {site.customDomain} <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            site.status === "published"
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-orange-500/10 text-orange-500"
          }`}
        >
          {site.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-xs text-muted-foreground mb-1">Total Visits</p>
          <p className="text-3xl font-black">{site.visits ?? 0}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <p className="text-xs text-muted-foreground mb-1">WhatsApp Clicks</p>
          <p className="text-3xl font-black">{site.whatsappClicks ?? 0}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
        <Link
          href={`/editor/${site.slug}`}
          className="flex items-center justify-between px-5 py-4 hover:bg-muted transition"
        >
          <div className="flex items-center gap-3">
            <Edit3 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">Edit Site</p>
              <p className="text-xs text-muted-foreground">
                Open the site editor
              </p>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </Link>

        <Link
          href={`/dashboard/domains?site=${site.slug || site.id}`}
          className="flex items-center justify-between px-5 py-4 hover:bg-muted transition"
        >
          <div className="flex items-center gap-3">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">Custom Domain</p>
              <p className="text-xs text-muted-foreground">
                {site.customDomain
                  ? site.customDomain
                  : "Connect a custom domain"}
              </p>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </Link>

        <button
          onClick={handleToggle}
          disabled={toggling}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted transition disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            {site.status === "published" ? (
              <ToggleLeft className="h-4 w-4 text-orange-500" />
            ) : (
              <ToggleRight className="h-4 w-4 text-emerald-500" />
            )}
            <div className="text-left">
              <p className="text-sm font-semibold">
                {site.status === "published"
                  ? "Unpublish Site"
                  : "Publish Site"}
              </p>
              <p className="text-xs text-muted-foreground">
                {site.status === "published"
                  ? "Take this site offline"
                  : "Make this site publicly visible"}
              </p>
            </div>
          </div>
          {toggling && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black">Site Settings</h2>
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition disabled:opacity-40"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
          <label className="text-sm font-semibold">SEO Description</label>
          <p className="text-xs text-muted-foreground">
            Shown in search results. Keep it under 160 characters.
          </p>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={3}
            maxLength={160}
            placeholder="A short benefit-led description of your business…"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p className="text-xs text-muted-foreground text-right">
            {form.description.length}/160
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
          <label className="text-sm font-semibold">WhatsApp Number</label>
          <p className="text-xs text-muted-foreground">
            Digits only, no + or country code prefix needed (e.g. 8161592059).
          </p>
          <input
            type="tel"
            value={form.whatsappNumber}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                whatsappNumber: e.target.value.replace(/\D/g, ""),
              }))
            }
            placeholder="8161592059"
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
          <label className="text-sm font-semibold">
            Social Preview Image (OG)
          </label>
          <p className="text-xs text-muted-foreground">
            Upload the image shown when your site is shared on WhatsApp or
            social media.
          </p>
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div
            className="mt-2 rounded-lg w-full aspect-video object-cover border border-border bg-muted flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={handleImageClick}
            tabIndex={0}
            role="button"
            aria-label="Upload social preview image"
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") handleImageClick();
            }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="OG preview"
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full py-8 select-none text-muted-foreground">
                <svg
                  className="w-12 h-12 mb-2 text-muted-foreground/40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="4"
                    stroke="currentColor"
                  />
                  <path
                    d="M16 14l-2.5-2.5a2 2 0 0 0-2.8 0L8 15"
                    stroke="currentColor"
                  />
                  <circle cx="9.5" cy="9.5" r="1.25" fill="currentColor" />
                </svg>
                <span className="text-xs">Click to upload image</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <label className="text-sm font-semibold">Tags</label>
          <p className="text-xs text-muted-foreground">
            Keywords that describe your business. Used for search and discovery.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addTag())
              }
              placeholder="e.g. lagos, food, delivery"
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={addTag}
              className="px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                >
                  <Hash className="h-3 w-3" />
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border border-destructive/20 rounded-2xl p-5 space-y-3">
        <p className="text-sm font-bold text-destructive">Danger Zone</p>
        <p className="text-xs text-muted-foreground">
          Permanently delete{" "}
          <span className="font-semibold text-foreground">{site.name}</span>.
          This cannot be undone.
        </p>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive hover:text-white transition"
          >
            <Trash2 className="h-4 w-4" /> Delete Site
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              disabled={deleting}
              onClick={() => setConfirmDelete(false)}
              className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 h-10 rounded-lg bg-destructive text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm Delete"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
