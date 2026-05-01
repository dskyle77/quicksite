"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Globe, Edit3, ExternalLink, ToggleLeft, ToggleRight,
  Trash2, Loader2, ArrowLeft, Link as LinkIcon,
} from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";

const SITE_DOMAIN_NAME = process.env.NEXT_PUBLIC_SITE_DOMAIN_NAME;
const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN_NAME;

export default function SiteManageScreen() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { sites, toggleSiteStatus, removeSite } = useDashboardStore();
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const site = sites.find((s) => s.slug === slug);

  if (!site) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Globe className="h-10 w-10 text-muted-foreground/20 mb-4" />
        <h2 className="font-bold text-xl mb-2">Site not found</h2>
        <Link href="/dashboard/sites" className="text-sm text-primary hover:underline mt-2">
          ← Back to Sites
        </Link>
      </div>
    );
  }

  const handleToggle = async () => {
    if (!user) return;
    setToggling(true);
    try {
      const token = await user.getIdToken();
      await toggleSiteStatus(site.id, token);
      toast.success(site.status === "published" ? "Site unpublished." : "Site published!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status.");
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
      toast.error(err instanceof Error ? err.message : "Failed to delete site.");
      setDeleting(false);
    }
  };

  const siteUrl = `https://${SITE_DOMAIN_NAME}${DOMAIN_NAME}/s/${site.slug}`;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/sites"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Sites
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black">{site.name}</h1>
          <a
            href={siteUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
          >
            {siteUrl} <ExternalLink className="h-3 w-3" />
          </a>
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

      {/* Stats */}
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

      {/* Actions */}
      <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
        {/* Edit */}
        <Link
          href={`/editor/${site.slug}`}
          className="flex items-center justify-between px-5 py-4 hover:bg-muted transition"
        >
          <div className="flex items-center gap-3">
            <Edit3 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">Edit Site</p>
              <p className="text-xs text-muted-foreground">Open the site editor</p>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </Link>

        {/* Custom Domain */}
        <Link
          href={`/dashboard/domains?site=${site.slug || site.id}`}
          className="flex items-center justify-between px-5 py-4 hover:bg-muted transition"
        >
          <div className="flex items-center gap-3">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">Custom Domain</p>
              <p className="text-xs text-muted-foreground">
                {site.customDomain ? site.customDomain : "Connect a custom domain"}
              </p>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </Link>

        {/* Publish / Unpublish */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted transition disabled:opacity-60"
        >
          <div className="flex items-center gap-3">
            {site.status === "published"
              ? <ToggleLeft className="h-4 w-4 text-orange-500" />
              : <ToggleRight className="h-4 w-4 text-emerald-500" />}
            <div className="text-left">
              <p className="text-sm font-semibold">
                {site.status === "published" ? "Unpublish Site" : "Publish Site"}
              </p>
              <p className="text-xs text-muted-foreground">
                {site.status === "published"
                  ? "Take this site offline"
                  : "Make this site publicly visible"}
              </p>
            </div>
          </div>
          {toggling && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-card border border-destructive/20 rounded-2xl p-5 space-y-3">
        <p className="text-sm font-bold text-destructive">Danger Zone</p>
        <p className="text-xs text-muted-foreground">
          Permanently delete <span className="font-semibold text-foreground">{site.name}</span>. This cannot be undone.
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
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}