"use client";

import { useEffect } from "react";
import { Users, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useProfileStore } from "@/store/useProfileStore";
import { canUseFeature } from "@/lib/plans";

export default function DashboardAnalyticsScreen() {
  const { user } = useAuth();
  const { profile } = useProfileStore();
  const { sites, sitesLoading, fetchSites } = useDashboardStore();

  // Only allow view if user has analytics feature (pro plan); do not allow for free/growth
  const canViewAnalytics = !!profile && canUseFeature(profile.plan, "analytics");

  useEffect(() => {
    if (user?.uid) fetchSites(user.uid);
  }, [fetchSites, user?.uid]);

  const totalVisits = sites.reduce((sum, site) => sum + (site.visits ?? 0), 0);
  const totalWhatsappClicks = sites.reduce(
    (sum, site) => sum + (site.whatsappClicks ?? 0),
    0,
  );

  if (!canViewAnalytics) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-card border border-border rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Analytics Not Available</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Analytics is only available on the Pro plan.
        </p>
        <a
          href="/pricing"
          className="inline-block px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition"
        >
          Upgrade to Pro
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Overview of your site performance.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4">
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
      </div>

      {/* Per-site Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-bold">Sites Breakdown</h3>
        </div>

        {sitesLoading ? (
          <div className="px-6 py-8 text-sm text-muted-foreground text-center">
            Loading...
          </div>
        ) : sites.length === 0 ? (
          <div className="px-6 py-8 text-sm text-muted-foreground text-center">
            No sites yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            <div className="grid grid-cols-3 px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <span>Site</span>
              <span className="text-center">Visits</span>
              <span className="text-center">WhatsApp Clicks</span>
            </div>
            {sites.map((site) => (
              <div
                key={site.id}
                className="grid grid-cols-3 px-6 py-4 text-sm items-center"
              >
                <span className="font-medium truncate">{site.name}</span>
                <span className="text-center">
                  {formatNumber(site.visits ?? 0)}
                </span>
                <span className="text-center">
                  {formatNumber(site.whatsappClicks ?? 0)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="p-2 bg-muted rounded-xl w-fit mb-4">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}
