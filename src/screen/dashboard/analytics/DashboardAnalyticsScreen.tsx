"use client"
import { useEffect } from "react";
import { Users, MessageCircle, Globe, ArrowUpRight, TrendingUp, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useProfileStore } from "@/store/useProfileStore";
import { canUseFeature } from "@/lib/plans";
import Link from "next/link";

export default function DashboardAnalyticsScreen() {
  const { user } = useAuth();
  const { profile } = useProfileStore();
  const { sites, sitesLoading, fetchSites } = useDashboardStore();

  // Only allow view if user has analytics feature (pro plan)
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
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="max-w-md w-full bg-card border border-border/50 rounded-[2.5rem] p-12 text-center shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8 relative z-10">
             <TrendingUp className="h-10 w-10 text-primary" />
          </div>
          
          <h2 className="text-2xl font-black mb-3 tracking-tight relative z-10">Unlock Deep Insights</h2>
          <p className="text-sm text-muted-foreground mb-8 font-medium leading-relaxed relative z-10">
            Advanced analytics is only available on the <span className="text-primary font-bold">Pro</span> plan. Upgrade now to track visits, clicks, and conversions in real-time.
          </p>
          
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground rounded-2xl h-14 px-8 text-sm font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer relative z-10"
          >
            Upgrade to Pro <ArrowUpRight className="h-4 w-4" />
          </Link>
          
          <p className="mt-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest relative z-10">
            Professional Grade Analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Analytics
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Track and analyze your site&apos;s performance metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <div className="px-4 py-2 bg-muted/50 rounded-xl border border-border/50 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
             Real-time Tracking
           </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          label="Total Site Visits"
          value={formatNumber(totalVisits)}
          icon={Users}
          color="bg-blue-500/10 text-blue-600"
          sub="Across all your sites"
        />
        <StatCard
          label="WhatsApp Clicks"
          value={formatNumber(totalWhatsappClicks)}
          icon={MessageCircle}
          color="bg-emerald-500/10 text-emerald-600"
          sub="Customer inquiries"
        />
      </div>

      {/* Per-site Breakdown */}
      <div className="space-y-4">
        <div className="px-2 flex items-center justify-between">
           <div>
              <h3 className="font-black text-xl tracking-tight">Sites Breakdown</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Individual performance</p>
           </div>
           {sites.length > 0 && (
             <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
               {sites.length} Sites Tracked
             </span>
           )}
        </div>

        <div className="bg-card border border-border/50 rounded-4xl overflow-hidden shadow-sm">
          {sitesLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
               <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
               <p className="text-xs font-bold text-muted-foreground animate-pulse">Calculating metrics...</p>
            </div>
          ) : sites.length === 0 ? (
            <div className="px-6 py-8 md:p-20 flex flex-col items-center justify-center text-center gap-4 group">
               <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-500">
                  <Globe className="h-8 w-8 text-muted-foreground/30" />
               </div>
               <div className="space-y-1">
                 <p className="font-bold text-lg">No sites found</p>
                 <p className="text-sm text-muted-foreground font-medium">Create a site to start seeing analytics data.</p>
               </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Site Name</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Visits</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">WA Clicks</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {sites.map((site) => (
                    <tr
                      key={site.id}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                              <Globe className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors" />
                           </div>
                           <div className="flex flex-col min-w-0">
                              <span className="font-bold text-sm text-foreground truncate">{site.name}</span>
                              <span className="text-[10px] font-medium text-muted-foreground truncate">{site.slug}</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="inline-flex items-center justify-center min-w-12 px-3 py-1 rounded-lg bg-blue-500/5 text-blue-600 font-black text-sm tabular-nums">
                           {formatNumber(site.visits ?? 0)}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="inline-flex items-center justify-center min-w-12 px-3 py-1 rounded-lg bg-emerald-500/5 text-emerald-600 font-black text-sm tabular-nums">
                           {formatNumber(site.whatsappClicks ?? 0)}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Link
                          href={`/editor/${site.id}`}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-tight"
                        >
                          View Editor <ChevronRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  sub: string;
}

function StatCard({ label, value, icon: Icon, color, sub }: StatCardProps) {
  return (
    <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
        <Icon className="h-24 w-24" />
      </div>
      
      <div className="flex flex-col gap-6 relative z-10">
        <div className={`h-14 w-14 rounded-2xl ${color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
          <Icon className="h-7 w-7" />
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
          <p className="text-4xl font-black tracking-tighter text-foreground tabular-nums">{value}</p>
        </div>
        
        <div className="pt-4 border-t border-border/50 flex items-center justify-between">
           <span className="text-[11px] font-bold text-muted-foreground italic">{sub}</span>
           <div className="flex items-center gap-1 text-[11px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Live Data <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
           </div>
        </div>
      </div>
    </div>
  );
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}
