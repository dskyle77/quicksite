"use client";

import { TrendingUp } from "lucide-react";
import type { OverviewStats, PlanType } from "./adminTypes";
import { cn } from "@/lib/utils";

const PLAN_HEX: Record<string, string> = {
  free: "#94a3b8",
  basic: "#3b82f6",
  growth: "#10b981",
  pro: "#8b5cf6",
};

export default function OverviewScreen({ stats }: { stats: OverviewStats }) {
  const {
    totalUsers,
    activeUsers,
    totalSites,
    publishedSites,
    totalDomains,
    verifiedDomains,
    mrr,
    planDist,
  } = stats;

  const maxPlan = Math.max(...Object.values(planDist), 1);

  const cards = [
    {
      label: "Total Users",
      value: totalUsers,
      sub: `${activeUsers} active`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Sites",
      value: totalSites,
      sub: `${publishedSites} published`,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Est. MRR",
      value: `₦${mrr.toLocaleString()}`,
      sub: "Paying users only",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Custom Domains",
      value: totalDomains,
      sub: `${verifiedDomains} verified`,
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
        {cards.map((s) => (
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

      {/* Plan distribution */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 max-w-sm">
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
                      background: PLAN_HEX[plan] ?? "#94a3b8",
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
    </div>
  );
}
