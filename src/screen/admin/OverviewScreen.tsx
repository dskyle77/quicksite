"use client";

import { TrendingUp } from "lucide-react";
import type { AdminUser, AdminSite, AdminDomain, PlanType } from "./adminTypes";
import { STATUS_COLORS } from "./adminTypes";
import { cn } from "@/lib/utils";

const PLAN_HEX = {
  free: "#94a3b8",
  basic: "#3b82f6",
  growth: "#10b981",
  pro: "#8b5cf6",
};

export default function OverviewScreen({
  users,
  sites,
  domains,
}: {
  users: AdminUser[];
  sites: AdminSite[];
  domains: AdminDomain[];
}) {
  const totalVisits = sites.reduce((a, s) => a + (s.visits ?? 0), 0);
  const planDist: Record<PlanType, number> = {
    free: 0,
    basic: 0,
    growth: 0,
    pro: 0,
  };
  users.forEach((u) => {
    planDist[u.plan as PlanType]++;
  });
  const maxPlan = Math.max(...Object.values(planDist), 1);
  const activeDomains = domains.filter((d) => d.dnsOk).length;
  const revenue =
    users.filter((u) => u.plan === "basic").length * 1500 +
    users.filter((u) => u.plan === "growth").length * 4000 +
    users.filter((u) => u.plan === "pro").length * 10000;

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      sub: `${users.filter((u) => u.status === "active").length} active`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Sites",
      value: sites.length,
      sub: `${sites.filter((s) => s.status === "published").length} published`,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Visits",
      value: totalVisits.toLocaleString(),
      sub: "All time",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Est. MRR",
      value: `₦${revenue.toLocaleString()}`,
      sub: "Paying users only",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Custom Domains",
      value: domains.length,
      sub: `${activeDomains} verified`,
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-slate-200 rounded-2xl p-4"
          >
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center mb-2.5",
                s.bg,
              )}
            >
              <TrendingUp className={cn("w-4 h-4", s.color)} />
            </div>
            <div className="text-2xl font-black text-slate-900 leading-none">
              {s.value}
            </div>
            <div className="text-xs font-bold text-slate-500 mt-1">
              {s.label}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Plan distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-[11px] font-black tracking-widest text-slate-400 uppercase mb-4">
            Plan Distribution
          </p>
          <div className="flex flex-col gap-3">
            {(Object.entries(planDist) as [PlanType, number][]).map(
              ([plan, count]) => (
                <div key={plan} className="flex items-center gap-2.5">
                  <span className="w-12 text-[11px] font-bold text-slate-500 capitalize">
                    {plan}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(count / maxPlan) * 100}%`,
                        background: PLAN_HEX[plan],
                      }}
                    />
                  </div>
                  <span className="text-xs font-black text-slate-900 min-w-[14px]">
                    {count}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Domain health */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-[11px] font-black tracking-widest text-slate-400 uppercase mb-4">
            Domain Health
          </p>
          <div className="flex flex-col gap-2.5">
            {domains.slice(0, 5).map((d) => (
              <div key={d.id} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{d.domain}</p>
                  <p className="text-[10px] text-slate-400">{d.siteName}</p>
                </div>
                <span
                  className={cn(
                    "text-[11px] font-semibold flex items-center gap-1",
                    STATUS_COLORS[d.vercelStatus],
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                  {d.vercelStatus.replace("_", " ")}
                </span>
              </div>
            ))}
            {domains.length === 0 && (
              <p className="text-xs text-slate-400">
                No domains registered yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
