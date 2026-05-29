/* eslint-disable @next/next/no-img-element */
"use client";

// src/screen/dashboard/sites/DashboardSiteScreen.tsx

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  Plus,
  ExternalLink,
  Search,
  Trash2,
  Loader2,
  X,
  Zap
} from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

import type { Site } from "@/lib/types";

const SITE_SHORT_NAME = process.env.NEXT_PUBLIC_SITE_SHORT_NAME;
const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN_NAME;

// ── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteModal({ site, onClose }: { site: Site; onClose: () => void }) {
  const { user } = useAuth();
  const { removeSite } = useDashboardStore();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user) {
      toast.error("You must be logged in to delete a site.");
      onClose();
      return;
    }
    setLoading(true);
    try {
      const token = await user.getIdToken();
      await removeSite(site.id, token);
      toast.success("Site deleted.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete site.",
      );
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="h-10 w-10 rounded-xl bg-destructive/10 grid place-items-center">
            <Trash2 className="h-5 w-5 text-destructive" />
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <h3 className="font-bold text-lg mb-1">Delete site?</h3>
        <p className="text-sm text-muted-foreground mb-6">
          <span className="font-semibold text-foreground">{site.name}</span>{" "}
          will be permanently deleted. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-full border border-border text-sm font-medium hover:bg-muted transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 h-10 rounded-full bg-destructive text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Site Card ─────────────────────────────────────────────────────────────────

function SiteCard({ site }: { site: Site }) {
  // Get first letter for the avatar-style icon
  const initial = site.name.charAt(0).toUpperCase();

  return (
    <div className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-500 flex flex-col h-full">
      
      {/* ── Top Decorative Header ── */}
      <div className="h-32 bg-muted/30 flex items-center px-6 relative overflow-hidden shrink-0">
        {/* Subtle background pattern (CSS-only) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
        
        {site?.ogImage ? (
          <img
            src={site.ogImage}
            alt={site.name + " cover"}
            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
            style={{ zIndex: 0 }}
          />
        ) : null}

        <div className="w-12 h-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500 relative z-10">
          <Globe className="h-6 w-6 text-primary" />
        </div>

        <div className="absolute top-4 right-4 z-10">
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
            site.status === "published"
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-orange-500/10 text-orange-600 border-orange-500/20"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${site.status === "published" ? "bg-emerald-500 animate-pulse" : "bg-orange-500"}`} />
            {site.status}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* ── Title & URL ── */}
        <div className="mb-6">
          <h3 className="font-black text-xl text-foreground truncate group-hover:text-primary transition-colors tracking-tight">
            {site.name}
          </h3>
          
          <div className="flex flex-col gap-1.5 mt-2">
            <a
              href={`https://${SITE_SHORT_NAME}${DOMAIN_NAME}/${site.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] font-bold text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors w-fit"
            >
              <span className="opacity-50 italic">{SITE_SHORT_NAME}{DOMAIN_NAME}/</span>
              <span className="text-primary/80">{site.slug}</span>
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>

            {site.customDomain && (
              <a
                href={`https://${site.customDomain}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-600 font-black hover:underline flex items-center gap-1.5 w-fit uppercase tracking-tighter"
              >
                {site.customDomain} <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50 mb-6">
          <div className="space-y-0.5">
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">Total Visits</p>
            <p className="text-xl font-black text-foreground tabular-nums tracking-tighter">{site.visits?.toLocaleString()}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">WA Clicks</p>
            <p className="text-xl font-black text-foreground tabular-nums tracking-tighter">{site.whatsappClicks?.toLocaleString()}</p>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-3 mt-auto">
          <Link href={`/editor/${site.id}`} className="flex-1">
            <button className="w-full py-2.5 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-all text-xs font-bold border border-transparent hover:border-border/50 cursor-pointer">
              Edit
            </button>
          </Link>
          <Link href={`/dashboard/sites/${site.id}`} className="flex-1">
            <button className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all text-xs font-bold cursor-pointer">
              Manage
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────

export default function DashboardSiteScreen() {
  const { sites, sitesLoading, ui, fetchSites, setDeleteConfirm } =
    useDashboardStore();
  const { profile: user } = useProfileStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user?.uid) {
      fetchSites(user.uid);
    }
  }, [user?.uid, fetchSites]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="h-20 w-20 rounded-3xl bg-muted grid place-items-center mb-6">
          <Globe className="h-10 w-10 text-muted-foreground/20" />
        </div>
        <h2 className="font-black text-2xl mb-3 tracking-tight">
          Please log in to manage sites
        </h2>
        <p className="text-muted-foreground max-w-sm text-center text-sm font-medium">
          You need to be signed in to create, manage, publish, or delete your
          sites.
        </p>
      </div>
    );
  }

  const siteToDelete = ui.deleteConfirmId
    ? (sites.find((s) => s.id === ui.deleteConfirmId) ?? null)
    : null;

  const filtered = sites.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      {siteToDelete && (
        <DeleteModal
          site={siteToDelete}
          onClose={() => setDeleteConfirm(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search your sites..."
            className="w-full bg-card border border-border/50 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            inputMode="search"
            aria-label="Search sites"
          />
        </div>
        
        <Link
          href="/dashboard/new"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-2xl h-12 px-6 text-sm font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          Create New Site
        </Link>
      </div>

      {sitesLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
           <div className="relative">
              <div className="h-14 w-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary animate-pulse" />
              </div>
            </div>
          <p className="text-sm font-bold text-muted-foreground animate-pulse">Loading your sites...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filtered.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border/50 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center gap-8 shadow-inner relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 bg-primary/5 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="h-24 w-24 rounded-3xl bg-muted/50 flex items-center justify-center relative">
             <Globe className="h-10 w-10 text-muted-foreground/30" />
          </div>
          
          <div className="space-y-3 max-w-sm">
            <h2 className="font-black text-2xl tracking-tight">
              {searchQuery ? "No sites found" : "Your digital empire starts here"}
            </h2>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              {searchQuery
                ? `We couldn't find any sites matching "${searchQuery}". Try a different term or clear the search.`
                : "You haven't created any sites yet. Build your first one in less than 2 minutes."}
            </p>
          </div>
          
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-2 bg-muted text-foreground rounded-2xl h-12 px-8 text-sm font-black hover:bg-muted/80 transition-all cursor-pointer border border-border/50 shadow-sm"
            >
              Clear Search
            </button>
          ) : (
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-2xl h-12 px-10 text-sm font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer"
            >
              <Plus className="h-5 w-5" /> Get Started Now
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
