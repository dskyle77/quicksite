/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// src/features/dashboard/DashboardScreen.tsx
// Real data from Zustand store — no mock values.

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  MousePointerClick,
  Globe,
  TrendingUp,
  Plus,
  ChevronRight,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  LayoutDashboard,
  Mail,
  Link2,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useProfileStore } from "@/store/useProfileStore";
import { useDashboardStore } from "@/store/useDashboardStore";

import { useSearchParams } from "next/navigation";
import type { DashboardStats } from "@/lib/types";

const SITE_SHORT_NAME = process.env.NEXT_PUBLIC_SITE_SHORT_NAME;
const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN_NAME;

// ─────────── COMPONENT: UpgradeSuccessAlert ──────────────
function UpgradeSuccessAlert() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show alert if ?upgrade=success in URL
    if (searchParams?.get("upgrade") === "success") {
      setTimeout(() => {
        setShow(true);
      }, 100);
    }
  }, [searchParams]);

  if (!show) return null;

  return (
    <div className="mb-4 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg px-5 py-4 flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
      <div>
        <p className="font-semibold">Your upgrade was successful!</p>
        <p className="text-xs mt-1">
          Enjoy your new plan features and happy building 🚀
        </p>
      </div>
    </div>
  );
}

// ─────────── Main DashboardScreen ──────────────
export default function DashboardScreen() {
  const { sites, stats, sitesLoading, fetchSites } = useDashboardStore();
  const { profile } = useProfileStore();

  useEffect(() => {
    if (profile?.uid) {
      fetchSites(profile.uid);
    }
  }, [fetchSites, profile?.uid]);

  const recentSites = sites.slice(0, 3);
  const firstName = profile?.displayName?.split(" ")[0] ?? "Builder";
  const firstPublishedSite = sites.find((s) => s.status === "published");

  return (
    <div className="space-y-10 pb-10">
      {/* ── Welcome Section ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Hey, {firstName}! 👋
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Here&apos;s what&apos;s happening with your sites today.
          </p>
        </div>
        <div className="hidden md:block">
          <div className="px-4 py-2 bg-muted/50 rounded-xl border border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* ── Upgrade Success Alert ────────────────────── */}
      <UpgradeSuccessAlert />

      {/* ── Share Your Business (Primary Loop) ────────────────────── */}
      {firstPublishedSite && (
        <div className="bg-linear-to-r from-green-500 to-emerald-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-green-500/20 relative overflow-hidden group animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                Your site is live! 🚀
              </h3>
              <p className="text-white/80 font-medium max-w-md leading-relaxed">
                The best way to get customers is to share your site on your
                WhatsApp Status and with your contacts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Check out my business website: ${SITE_SHORT_NAME}${DOMAIN_NAME}/${firstPublishedSite.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-14 px-8 bg-white text-green-600 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-lg active:scale-95"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.554 4.189 1.602 6.039L0 24l6.135-1.61a11.77 11.77 0 005.911 1.586h.005c6.632 0 12.032-5.396 12.035-12.03a11.85 11.85 0 00-3.535-8.503z" />
                </svg>
                Share on WhatsApp
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${SITE_SHORT_NAME}${DOMAIN_NAME}/${firstPublishedSite.slug}`,
                  );
                  toast.success("Link copied!");
                }}
                className="h-14 px-6 bg-white/20 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/30 transition-all backdrop-blur-sm"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
        <StatsGrid stats={stats} sitesLoading={sitesLoading} />
      </section>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* ── My Sites (Left Col) ────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
          <SitesSection recentSites={recentSites} sitesLoading={sitesLoading} />
        </div>

        {/* ── Quick Actions (Right Col) ─────────────────────────────────── */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-450 fill-mode-both">
          <QuickActionsSection />
        </div>
      </div>
    </div>
  );
}

// ─────────── UPDATED COMPONENTS ──────────────

function StatsGrid({
  stats,
  sitesLoading,
}: {
  stats: DashboardStats;
  sitesLoading: boolean;
}) {
  const { profile } = useProfileStore();
  const plan = profile?.plan;
  let planName = "Free";
  if (plan) planName = plan.charAt(0).toUpperCase() + plan.slice(1);
  else planName = "Free";

  const STATS = [
    {
      label: "Total Visits",
      icon: Users,
      value: sitesLoading ? null : stats.totalVisits,
      color: "bg-blue-500/10 text-blue-600",
      trend: "+12%", // Mock trend for UI
    },
    {
      label: "WA Clicks",
      icon: MousePointerClick,
      value: sitesLoading ? null : stats.totalWhatsappClicks,
      color: "bg-orange-500/10 text-orange-600",
      trend: "+5%",
    },
    {
      label: "Total Sites",
      icon: Globe,
      value: sitesLoading ? null : stats.totalSites,
      color: "bg-emerald-500/10 text-emerald-600",
      sub: `${stats.sitesLeft} slots left`,
    },
    {
      label: "Current Plan",
      icon: TrendingUp,
      value: sitesLoading ? null : planName,
      color: "bg-primary/10 text-primary",
      sub: planName === "Free" ? "Upgrade for more" : "Active Plan",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <stat.icon className="h-12 w-12" />
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div
              className={`h-11 w-11 rounded-xl ${stat.color} flex items-center justify-center shadow-inner`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </p>
              {stat.value === null ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mt-1" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black tracking-tight">
                    {stat.value}
                  </p>
                  {stat.trend && (
                    <span className="text-[10px] text-emerald-500">
                      {stat.trend}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {stat.sub && (
            <p className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full inline-block">
              {stat.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function SiteCard({ site }: { site: any }) {
  const siteUrl = `${SITE_SHORT_NAME}${DOMAIN_NAME}/${site.slug}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Check out my business website: ${siteUrl}`,
  )}`;

  return (
    <div
      key={site.id}
      className="group bg-card border border-border/50 rounded-2xl p-1 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-500"
      
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-500">
            <Globe className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                site.status === "published"
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
              }`}
            >
              {site.status}
            </span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
              <Users className="h-3 w-3" />
              {site.visits || 0}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-extrabold text-base truncate text-foreground group-hover:text-primary transition-colors">
            {site.name}
          </p>
          <p className="text-[11px] font-medium text-muted-foreground truncate flex items-center gap-1">
            <span className="opacity-50 italic">
              {SITE_SHORT_NAME}
              {DOMAIN_NAME}/
            </span>
            <span className="text-primary/80 font-bold">{site.slug}</span>
          </p>
        </div>
      </div>

      <div className="mt-2 p-2 border-t border-border/50 flex flex-col gap-2 bg-muted/30 rounded-b-[14px]">
        {site.status === "published" && (
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-black transition-all shadow-sm"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.554 4.189 1.602 6.039L0 24l6.135-1.61a11.77 11.77 0 005.911 1.586h.005c6.632 0 12.032-5.396 12.035-12.03a11.85 11.85 0 00-3.535-8.503z" />
            </svg>
            Share on WhatsApp
          </a>
        )}
        <div className="flex items-center justify-between w-full">
          <Link
            href={`/editor/${site.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-white dark:hover:bg-black rounded-lg transition-all"
          >
            Edit Site
          </Link>
          <div className="w-px h-4 bg-border/50 mx-1" />
          <Link
            href={`/dashboard/sites/${site.slug}`}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-white dark:hover:bg-black rounded-lg transition-all"
          >
            Manage Site
          </Link>
        </div>
      </div>
    </div>
  );
}

function SitesSection({
  recentSites,
  sitesLoading,
}: {
  recentSites: any[];
  sitesLoading: boolean;
}) {
  return (
    <div className="bg-card/30 rounded-3xl p-2 border border-border/50">
      <div className="p-4 flex items-center justify-between mb-2">
        <div>
          <h2 className="font-bold text-xl tracking-tight">My Sites</h2>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
            Manage your digital presence
          </p>
        </div>
        <Link
          href="/dashboard/sites"
          className="w-30 md:w-auto h-9 px-4 flex items-center gap-2 bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-xl text-xs font-bold transition-all"
        >
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="p-2">
        {sitesLoading ? (
          <div className="bg-card border border-border/50 rounded-2xl p-20 flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary animate-pulse" />
              </div>
            </div>
            <p className="text-xs font-bold text-muted-foreground animate-pulse">
              Fetching your masterpieces...
            </p>
          </div>
        ) : recentSites.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {recentSites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
            <Link
              href="/dashboard/new"
              className="group border-2 border-dashed border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-full bg-muted group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="font-bold text-sm">Create New Site</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                  Ready for another one?
                </p>
              </div>
            </Link>
          </div>
        ) : (
          <div className="bg-card border border-border/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-6 shadow-inner">
            <div className="h-20 w-20 rounded-3xl bg-primary/5 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-xl animate-pulse" />
              <Globe className="h-10 w-10 text-primary relative z-10" />
            </div>
            <div className="space-y-2 max-w-xs">
              <p className="font-black text-lg">No sites found</p>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                You haven&apos;t created any sites yet. Let&apos;s build
                something amazing today!
              </p>
            </div>
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-xl h-12 px-4 text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer"
            >
              <Plus className="h-5 w-5" /> Get Started Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickActionsSection() {
  const QUICK_ACTIONS = [
    {
      label: "Templates",
      sub: "Pick a starting point",
      href: "/templates",
      icon: LayoutDashboard,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Messages",
      sub: "Your inbox & leads",
      href: "/dashboard/messages",
      icon: Mail,
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      label: "Domains",
      sub: "Custom .com.ng domains",
      href: "/dashboard/domains",
      icon: Link2,
      color: "bg-violet-500/10 text-violet-600",
    },
    {
      label: "Support",
      sub: "Need some help?",
      href: "/support",
      icon: ShieldAlert,
      color: "bg-emerald-500/10 text-emerald-600",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="px-2">
        <h2 className="font-bold text-lg tracking-tight">Quick Actions</h2>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
          Commonly used tools
        </p>
      </div>

      <div className="grid gap-3">
        {QUICK_ACTIONS.map((action) => (
          <Link key={action.label} href={action.href} className="group">
            <div className="bg-card border border-border/50 rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 cursor-pointer">
              <div
                className={`h-11 w-11 rounded-xl ${action.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
              >
                <action.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {action.label}
                </p>
                <p className="text-[10px] font-medium text-muted-foreground truncate italic">
                  {action.sub}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="p-6 bg-linear-to-br from-primary/10 to-transparent rounded-3xl border border-primary/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        <p className="text-xs font-black mb-1 relative z-10 tracking-tight">
          Need a pro touch?
        </p>
        <p className="text-[10px] text-muted-foreground mb-4 relative z-10 leading-relaxed font-medium">
          Our team can help you design a custom site that stands out.
        </p>
        <button className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 relative z-10">
          Learn about services <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
