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
} from "lucide-react";
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

// ─────────── COMPONENT: StatsGrid ──────────────
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
      color: "bg-primary/10 text-primary",
    },
    {
      label: "WhatsApp Clicks",
      icon: MousePointerClick,
      value: sitesLoading ? null : stats.totalWhatsappClicks,
      color: "bg-secondary/10 text-secondary",
    },
    {
      label: `Total Sites. ${stats.sitesLeft} left`,
      icon: Globe,
      value: sitesLoading ? null : stats.totalSites,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Plan",
      icon: TrendingUp,
      value: sitesLoading ? null : planName,
      color:
        planName === "Free"
          ? "bg-primary/10 text-primary"
          : planName === "Basic"
            ? "bg-secondary/10 text-secondary"
            : planName === "Growth"
              ? "bg-emerald-500/10 text-emerald-600"
              : planName === "Pro"
                ? "bg-violet-500/10 text-violet-600"
                : "bg-gray-500/10 text-gray-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`h-9 w-9 rounded-xl ${stat.color} grid place-items-center`}
            >
              <stat.icon className="h-4 w-4" />
            </div>
          </div>
          {stat.value === null ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mb-1" />
          ) : (
            <p className="text-2xl font-bold">{stat.value}</p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─────────── COMPONENT: SiteCard ──────────────
function SiteCard({ site }: { site: any }) {
  return (
    <div
      key={site.id}
      className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center">
          <Globe className="h-5 w-5 text-primary" />
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            site.status === "published"
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-orange-500/10 text-orange-500"
          }`}
        >
          {site.status}
        </span>
      </div>
      <p className="font-bold text-sm truncate">{site.name}</p>
      <p className="text-xs text-primary mt-0.5 truncate">
        {SITE_SHORT_NAME}
        {DOMAIN_NAME}/{site.slug}
      </p>
      <p className="text-xs text-muted-foreground mt-3">{site.visits} visits</p>
    </div>
  );
}

// ─────────── COMPONENT: SitesSection ──────────────
function SitesSection({
  recentSites,
  sitesLoading,
}: {
  recentSites: any[];
  sitesLoading: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">My Sites</h2>
        <Link
          href="/dashboard/sites"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View all <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {sitesLoading ? (
        <div className="bg-card border border-border rounded-2xl p-10 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : recentSites.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentSites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-muted grid place-items-center">
            <Globe className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-sm">No sites yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create your first site and go live in minutes.
            </p>
          </div>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full h-9 px-5 text-sm font-semibold hover:opacity-90 transition mt-1 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Create your first site
          </Link>
        </div>
      )}
    </div>
  );
}

// ─────────── COMPONENT: QuickActionsSection ──────────────
function QuickActionsSection() {

  const QUICK_ACTIONS = [
    {
      label: "Browse Templates",
      sub: "Find the perfect design",
      href: "/templates",
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Connect Domain",
      sub: "Use your own .com.ng domain",
      href: "/dashboard/domains",
      color: "bg-violet-500/10 text-violet-600",
    },
    {
      label: "Get Support",
      sub: "Contact our support team for help",
      href: "/support",
      color: "bg-orange-100 text-orange-600",
    },
  ];
  return (
    <div>
      <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
      <div className="grid sm:grid-cols-3 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <Link key={action.label} href={action.href}>
            <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer group">
              <div
                className={`h-9 w-9 rounded-xl ${action.color} grid place-items-center mb-3`}
              >
                <ArrowUpRight className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </div>
              <p className="font-semibold text-sm">{action.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {action.sub}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─────────── Main DashboardScreen ──────────────
export default function DashboardScreen() {
  const { sites, stats, sitesLoading, fetchSites } = useDashboardStore();
  const { profile: user } = useProfileStore();

  useEffect(() => {
    if (user?.uid) {
      fetchSites(user.uid);
    }
  }, [fetchSites, user?.uid]);

  const recentSites = sites.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* ── Upgrade Success Alert (after upgrade) ────────────────────── */}
      <UpgradeSuccessAlert />

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <StatsGrid stats={stats} sitesLoading={sitesLoading} />

      {/* ── My Sites ───────────────────────────────────────────────────── */}
      <SitesSection recentSites={recentSites} sitesLoading={sitesLoading} />

      {/* ── Quick Actions ──────────────────────────────────────────────── */}
      <QuickActionsSection />
    </div>
  );
}
