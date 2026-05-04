"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart2,
  Calendar,
  Users,
  Image as ImageIcon,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getAnalyticsEventsForUser } from "@/lib/firestore";
import { useDashboardStore } from "@/store/useDashboardStore";
import type { AnalyticsEvent, Site } from "@/lib/types";

export default function DashboardAnalyticsScreen() {
  const [timeRange, setTimeRange] = useState("7d");
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const { user } = useAuth();
  const { sites, sitesLoading, fetchSites } = useDashboardStore();
  const filteredSites = filterSitesByRange(sites, timeRange);

  const totalVisits = filteredSites.reduce(
    (sum, site) => sum + (site.visits ?? 0),
    0,
  );
  const totalWhatsappClicks = filteredSites.reduce(
    (sum, site) => sum + (site.whatsappClicks ?? 0),
    0,
  );
  const totalImageAssets = filteredSites.reduce((sum, site) => {
    const content = site.content as { items?: Array<{ image?: string }> };
    const imageCount =
      content.items?.filter(
        (item) => typeof item.image === "string" && item.image,
      ).length ?? 0;
    return sum + imageCount;
  }, 0);
  const conversionRate =
    totalVisits > 0
      ? ((totalWhatsappClicks / totalVisits) * 100).toFixed(1)
      : "0.0";
  useEffect(() => {
    let active = true;
    async function loadEvents() {
      if (!user?.uid) {
        if (active) {
          setEvents([]);
          setEventsLoading(false);
        }
        return;
      }
      setEventsLoading(true);
      try {
        const data = await getAnalyticsEventsForUser(user.uid);
        if (active) setEvents(data);
      } catch (error) {
        console.error("Failed to fetch analytics events:", error);
      } finally {
        if (active) setEventsLoading(false);
      }
    }
    void loadEvents();
    return () => {
      active = false;
    };
  }, [user?.uid]);

  const dailySeries = useMemo(() => {
    const now = new Date();
    const days = getDaysForRange(timeRange);
    const dateKeys = Array.from({ length: days }, (_, index) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (days - 1 - index));
      return toDateKey(d);
    });

    const visitsByDay = new Map<string, number>();
    const whatsappByDay = new Map<string, number>();

    for (const key of dateKeys) {
      visitsByDay.set(key, 0);
      whatsappByDay.set(key, 0);
    }

    for (const event of events) {
      if (!event.createdAt) continue;
      const key = toDateKey(new Date(event.createdAt));
      if (!visitsByDay.has(key)) continue;
      if (event.type === "visit") {
        visitsByDay.set(key, (visitsByDay.get(key) ?? 0) + 1);
      } else if (event.type === "whatsapp_click") {
        whatsappByDay.set(key, (whatsappByDay.get(key) ?? 0) + 1);
      }
    }

    return dateKeys.map((key) => ({
      key,
      label: formatDayLabel(key),
      visits: visitsByDay.get(key) ?? 0,
      whatsappClicks: whatsappByDay.get(key) ?? 0,
    }));
  }, [events, timeRange]);

  const maxDayVisits = Math.max(...dailySeries.map((point) => point.visits), 1);

  useEffect(() => {
    if (user?.uid) {
      fetchSites(user.uid);
    }
  }, [fetchSites, user?.uid]);

  return (
    <div className="space-y-8">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">MakeSite Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Real-time overview from your site data.
          </p>
        </div>

        <div className="flex items-center bg-card border border-border rounded-xl p-1">
          {["24h", "7d", "30d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                timeRange === range
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Visits"
          value={formatNumber(totalVisits)}
          icon={Users}
        />
        <StatCard
          label="WhatsApp Clicks"
          value={formatNumber(totalWhatsappClicks)}
          icon={MessageCircle}
        />
        <StatCard
          label="Catalogue Images"
          value={formatNumber(totalImageAssets)}
          icon={ImageIcon}
        />
        <StatCard
          label="Conversion Rate"
          value={`${conversionRate}%`}
          icon={BarChart2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Traffic Chart ───────────────────────────────────────────── */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-primary" />
              Daily Visitor Traffic
            </h3>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {timeRange.toUpperCase()}
            </span>
          </div>

          {sitesLoading || eventsLoading ? (
            <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
              Loading analytics...
            </div>
          ) : dailySeries.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
              No site analytics available for this range yet.
            </div>
          ) : (
            <div className="w-full overflow-x-auto no-scrollbar h-64 flex items-end justify-between gap-3 px-2 border-b border-border/50">
              {dailySeries.map((point) => {
                const height = Math.max(
                  Math.round((point.visits / maxDayVisits) * 100),
                  4,
                );
                return (
                  <div
                    key={point.key}
                    className="flex-1 h-full flex flex-col justify-end items-center group relative"
                  >
                    <div
                      className="w-full bg-primary/20 rounded-t-lg relative group-hover:bg-primary/40 transition-all duration-300 ease-in-out"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {formatNumber(point.visits)} visits /{" "}
                        {formatNumber(point.whatsappClicks)} clicks
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground mt-3 mb-1 max-w-full truncate">
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Content Insights ────────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col">
          <h3 className="font-bold text-sm mb-6">Content Insight</h3>

          <div className="flex-1 space-y-5">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                Top Tip
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                Sites with clear product names, prices, and strong WhatsApp CTA
                labels usually get better click-through.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Published Sites
                </span>
                <span className="text-xs font-bold">
                  {
                    filteredSites.filter((site) => site.status === "published")
                      .length
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Avg. Visits per Site
                </span>
                <span className="text-xs font-bold">
                  {filteredSites.length > 0
                    ? formatNumber(
                        Math.round(totalVisits / filteredSites.length),
                      )
                    : "0"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-[11px] text-muted-foreground italic leading-relaxed">
              Analytics values on this page are computed from your stored site
              metrics only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function filterSitesByRange(sites: Site[], range: string): Site[] {
  const now = Date.now();
  const cutoff = getCutoffMs(now, range);
  if (!cutoff) return sites;

  return sites.filter((site) => {
    const date = parseSiteDate(site.updatedAt) ?? parseSiteDate(site.createdAt);
    return date ? date.getTime() >= cutoff : true;
  });
}

function getCutoffMs(now: number, range: string): number | null {
  if (range === "24h") return now - 24 * 60 * 60 * 1000;
  if (range === "7d") return now - 7 * 24 * 60 * 60 * 1000;
  if (range === "30d") return now - 30 * 24 * 60 * 60 * 1000;
  return null;
}

function getDaysForRange(range: string): number {
  if (range === "24h") return 1;
  if (range === "30d") return 30;
  return 7;
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDayLabel(dateKey: string): string {
  const parsed = new Date(`${dateKey}T00:00:00`);
  return parsed.toLocaleDateString(undefined, { weekday: "short" });
}

function parseSiteDate(value: unknown): Date | null {
  if (!value || typeof value !== "string") return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-muted rounded-xl">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
