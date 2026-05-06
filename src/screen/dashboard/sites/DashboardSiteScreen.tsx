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
} from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useUserStore } from "@/store/useUserStore";
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
    <div className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300">
      
      {/* ── Top Decorative Header ── */}
      <div className="h-20 bg-linear-to-br from-muted/50 to-muted flex items-center px-5 relative overflow-hidden">
        {/* Subtle background pattern (CSS-only) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
        
        <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
          <span className="text-lg font-bold text-primary">{initial}</span>
        </div>

        <div className="absolute top-4 right-4">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            site.status === "published"
              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
              : "bg-orange-50 text-orange-600 border-orange-200"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${site.status === "published" ? "bg-emerald-500" : "bg-orange-500"}`} />
            {site.status}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* ── Title & URL ── */}
        <div className="mb-4">
          <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
            {site.name}
          </h3>
          
          <div className="flex flex-col gap-1 mt-1">
            <a
              href={`https://${SITE_SHORT_NAME}${DOMAIN_NAME}/${site.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors w-fit"
            >
              {SITE_SHORT_NAME}{DOMAIN_NAME}/{site.slug} 
              <ExternalLink className="h-3 w-3 opacity-50" />
            </a>

            {site.customDomain && (
              <a
                href={`https://${site.customDomain}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-600 font-medium hover:underline flex items-center gap-1 w-fit"
              >
                {site.customDomain} <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-border/60">
          <div>
            <p className="text-[10px] uppercase tracking-tight text-muted-foreground font-semibold">Total Visits</p>
            <p className="text-lg font-bold text-foreground">{site.visits?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-tight text-muted-foreground font-semibold">WA Clicks</p>
            <p className="text-lg font-bold text-foreground">{site.whatsappClicks?.toLocaleString()}</p>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center gap-2 pt-2">
          <Link href={`/editor/${site.slug}`} className="flex-1">
            <button className="w-full py-2 rounded-xl bg-secondary/50 text-secondary-foreground hover:bg-secondary transition-colors text-sm font-semibold">
              Edit
            </button>
          </Link>
          <Link href={`/dashboard/sites/${site.slug}`} className="flex-1">
            <button className="w-full py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all text-sm font-semibold">
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
  const { profile: user } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user?.uid) {
      fetchSites(user.uid);
    }
  }, [user?.uid, fetchSites]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Globe className="h-10 w-10 text-muted-foreground/20 mb-4" />
        <h2 className="font-bold text-xl mb-2">
          Please log in to manage sites
        </h2>
        <p className="text-muted-foreground max-w-sm text-center">
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
    <div className="space-y-6">
      {siteToDelete && (
        <DeleteModal
          site={siteToDelete}
          onClose={() => setDeleteConfirm(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sites..."
            className="w-full bg-card border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            inputMode="search"
            aria-label="Search sites"
          />
        </div>
      </div>

      {sitesLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-20 flex flex-col items-center justify-center text-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-muted grid place-items-center mb-2">
            <Globe className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <div>
            <h2 className="font-bold text-xl">
              {searchQuery ? "No sites found" : "No sites yet"}
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
              {searchQuery
                ? `No sites match "${searchQuery}"`
                : "Create your first site and go live in minutes."}
            </p>
          </div>
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full h-11 px-8 text-sm font-semibold hover:opacity-90 transition mt-2 cursor-pointer"
            >
              Clear Search
            </button>
          ) : (
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full h-11 px-8 text-sm font-semibold hover:opacity-90 transition mt-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Create Your First Site
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
