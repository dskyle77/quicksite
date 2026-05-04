"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type { PricingConfig, PricingPlan, PlanType } from "./adminTypes";
import { PLAN_COLORS } from "./adminTypes";
import { cn } from "@/lib/utils";

const PLAN_HEX: Record<PlanType, string> = {
  free: "#94a3b8",
  basic: "#3b82f6",
  growth: "#10b981",
  pro: "#8b5cf6",
};

const BOOLEAN_FEATURES: Array<{ key: keyof PricingPlan; label: string }> = [
  { key: "customDomain", label: "Custom Domains" },
  { key: "analytics", label: "Analytics" },
  { key: "payments", label: "Payments" },
];

export default function PricingScreen({
  initialPricing,
}: {
  initialPricing: PricingConfig;
}) {
  const [pricing, setPricing] = useState<PricingConfig>(initialPricing);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState("");

  const update = (plan: PlanType, field: keyof PricingPlan, value: unknown) => {
    setPricing((prev) => ({
      ...prev,
      [plan]: {
        ...prev[plan],
        [field]: field === "price" || field === "sites" ? Number(value) : value,
      },
    }));
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/pricing", {
      method: "PUT",
      body: JSON.stringify(pricing),
      headers: { "Content-Type": "application/json" },
    });
    setSaving(false);
    setDirty(false);
    setToast("Pricing saved successfully");
    setTimeout(() => setToast(""), 3000);
  };

  const fieldLabel = (label: string) => (
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1">
      {label}
    </label>
  );

  const textInput = (
    value: string,
    onChange: (v: string) => void,
    placeholder?: string,
  ) => (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[13px] text-slate-900 outline-none bg-slate-50 focus:bg-white"
    />
  );

  const numInput = (value: number, onChange: (v: string) => void) => (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-900 outline-none bg-slate-50 focus:bg-white"
    />
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Unsaved banner */}
      {dirty && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-[13px] font-bold text-amber-800">
            You have unsaved changes.
          </span>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1.5 bg-slate-900 text-white text-[13px] font-bold px-4 py-2 rounded-xl disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving…" : "Save All Changes"}
          </button>
        </div>
      )}

      {/* Plan editor cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {(Object.entries(pricing) as [PlanType, PricingPlan][]).map(
          ([planKey, plan]) => (
            <div
              key={planKey}
              className="bg-white border border-slate-200 rounded-2xl p-5"
              style={{ borderTop: `3px solid ${PLAN_HEX[planKey]}` }}
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: PLAN_HEX[planKey] }}
                />
                <span className="font-black text-[15px] text-slate-900 capitalize">
                  {plan.name}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full",
                    PLAN_COLORS[planKey],
                  )}
                >
                  {planKey}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {/* Price */}
                <div>
                  {fieldLabel("Monthly Price (₦)")}
                  {numInput(plan.price, (v) => update(planKey, "price", v))}
                </div>
                {/* Display label */}
                <div>
                  {fieldLabel("Display Label")}
                  {textInput(
                    plan.nairaLabel,
                    (v) => update(planKey, "nairaLabel", v),
                    "e.g. ₦1,500",
                  )}
                </div>
                {/* Description */}
                <div>
                  {fieldLabel("Description")}
                  {textInput(
                    plan.description,
                    (v) => update(planKey, "description", v),
                    "Short description",
                  )}
                </div>
                {/* Button text */}
                <div>
                  {fieldLabel("CTA Button Text")}
                  {textInput(
                    plan.buttonText,
                    (v) => update(planKey, "buttonText", v),
                    "e.g. Upgrade Now",
                  )}
                </div>
                {/* Site limit */}
                <div>
                  {fieldLabel("Site Limit")}
                  {numInput(plan.sites, (v) => update(planKey, "sites", v))}
                </div>

                {/* Feature toggles */}
                <div className="border-t border-slate-100 pt-3">
                  {fieldLabel("Features")}
                  {BOOLEAN_FEATURES.map((feat) => (
                    <label
                      key={feat.key}
                      className="flex items-center gap-2 mb-1.5 cursor-pointer"
                    >
                      <div
                        onClick={() =>
                          update(planKey, feat.key, !plan[feat.key])
                        }
                        className="w-9 h-5 rounded-full relative transition-colors cursor-pointer"
                        style={{
                          background: plan[feat.key]
                            ? PLAN_HEX[planKey]
                            : "#e2e8f0",
                        }}
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] shadow-sm transition-all"
                          style={{ left: plan[feat.key] ? 19 : 3 }}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          plan[feat.key] ? "text-slate-900" : "text-slate-400",
                        )}
                      >
                        {feat.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      {/* Live preview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <p className="text-[11px] font-black tracking-widest text-slate-400 uppercase mb-4">
          Live Preview (as users see it)
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2.5">
          {(Object.entries(pricing) as [PlanType, PricingPlan][]).map(
            ([planKey, plan]) => (
              <div
                key={planKey}
                className="rounded-xl p-4"
                style={{
                  border: `2px solid ${planKey === "basic" ? PLAN_HEX[planKey] : "#f1f5f9"}`,
                }}
              >
                <p className="font-black text-slate-900 mb-0.5">{plan.name}</p>
                <p
                  className="text-2xl font-black"
                  style={{ color: PLAN_HEX[planKey] }}
                >
                  {plan.nairaLabel}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 mb-2.5">
                  {plan.description}
                </p>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div>
                    🏠 {plan.sites === 50 ? "Unlimited" : plan.sites} site
                    {plan.sites !== 1 ? "s" : ""}
                  </div>
                  {plan.customDomain && <div>🌐 Custom domain</div>}
                  {plan.analytics && <div>📊 Analytics</div>}
                  {plan.payments && <div>💳 Payments</div>}
                </div>
                <div
                  className="mt-2.5 py-1.5 text-center rounded-lg text-[11px] font-black text-white"
                  style={{ background: PLAN_HEX[planKey] }}
                >
                  {plan.buttonText}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Production note */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
        <p className="text-[13px] font-bold text-emerald-800 mb-1">
          ⚠️ Production Note
        </p>
        <p className="text-xs text-emerald-700 leading-relaxed">
          Saving updates the{" "}
          <code className="bg-emerald-100 px-1 rounded">config/pricing</code>{" "}
          document in Firestore. Your{" "}
          <code className="bg-emerald-100 px-1 rounded">PricingScreen.tsx</code>{" "}
          and{" "}
          <code className="bg-emerald-100 px-1 rounded">src/lib/plans.ts</code>{" "}
          must read from that document at runtime.
        </p>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-4 py-3 text-[13px] font-bold shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
