/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Layout, CheckCircle2, Eye, Lock, Search } from "lucide-react";
import { templatesRegistry } from "@/lib/templates";
import { CUSTOM_TEMPLATE_TYPE } from "@/lib/plans";
import { useMemo, useState } from "react";

const themeVars = {
  border: "var(--color-border)",
  borderAccent: "var(--color-accent)",
  borderPrimary: "var(--color-primary)",
  borderShadow: "var(--color-ring)",
  background: "var(--color-background)",
  backgroundMuted: "var(--color-muted)",
  backgroundAccent: "var(--color-accent)",
  backgroundWhite: "var(--color-card)",
  backgroundPrimary: "var(--color-primary)",
  backgroundPremium: "#FEF3C7",
  foreground: "var(--color-foreground)",
  foregroundPrimary: "var(--color-primary)",
  textWhite: "var(--color-primary-foreground)",
  textLight: "var(--color-muted-foreground)",
  textMuted: "var(--color-muted-foreground)",
  textAccent: "var(--color-accent-foreground)",
  textPremium: "#92400e",
  shadow: "0 6px 24px 0 rgba(20,20,20,0.09)",
  shadowHover: "0 2px 8px 0 rgba(10,60,60,0.06)",
};

interface TemplatePickerProps {
  selectedType: string;
  onTemplateChange: (type: string) => void;
  slugForPreview: string;
  nameForPreview: string;
  canUsePremiumTemplate?: boolean;
}

export function TemplatePicker({
  selectedType,
  onTemplateChange,
  slugForPreview,
  nameForPreview,
  canUsePremiumTemplate = false,
}: TemplatePickerProps) {
  const [search, setSearch] = useState("");

  const { filteredTemplates, templateBuilderTemplate } = useMemo(() => {
    const cleanedSearch = search.trim().toLowerCase();
    let builder: any = null;
    const others: typeof templatesRegistry = [];
    let selectedTemplate: any = null;

    for (const t of templatesRegistry) {
      const isSelected = t.config.type === selectedType;
      if (t.config.type === "template-builder") {
        builder = t;
        if (isSelected) selectedTemplate = t;
        continue;
      }
      if (isSelected) selectedTemplate = t;

      if (cleanedSearch) {
        if (
          t.meta?.title?.toLowerCase().includes(cleanedSearch) ||
          t.meta?.category?.toLowerCase().includes(cleanedSearch) ||
          t.meta?.description?.toLowerCase().includes(cleanedSearch)
        ) {
          others.push(t);
        }
      } else {
        others.push(t);
      }
    }

    let shownTemplates: typeof templatesRegistry = [];
    if (!cleanedSearch) {
      shownTemplates = others;
    } else {
      if (builder && (
        builder.meta?.title?.toLowerCase().includes(cleanedSearch) ||
        builder.meta?.category?.toLowerCase().includes(cleanedSearch) ||
        builder.meta?.description?.toLowerCase().includes(cleanedSearch)
      )) {
        // builder matches
      } else {
        builder = null;
      }
      shownTemplates = others;
    }

    return { filteredTemplates: shownTemplates, templateBuilderTemplate: builder };
  }, [search, selectedType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by category or style..."
            style={{
              width: "100%",
              paddingLeft: "2.5rem",
              paddingRight: "1rem",
              paddingTop: "0.75rem",
              paddingBottom: "0.75rem",
              borderRadius: "1rem",
              border: `1px solid ${themeVars.border}`,
              background: `color-mix(in srgb, ${themeVars.backgroundMuted} 50%, ${themeVars.background} 50%)`,
              outline: "none",
              transition: "all 0.2s",
            }}
            className="focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-[0.95rem]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </div>
        <Link
          href={`/templates?name=${encodeURIComponent(nameForPreview)}&slug=${encodeURIComponent(slugForPreview)}`}
          className="text-primary font-bold text-xs sm:text-[0.95rem] flex items-center gap-1 self-end sm:self-auto hover:underline"
        >
          View All Templates <ArrowRight size={14} className="inline" />
        </Link>
      </div>

      <div className="h-100 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((t) => {
            const type = t.config.type;
            const selected = selectedType === type;
            const isLocked = t.config.isPremium && !canUsePremiumTemplate;

            return (
              <button
                key={type}
                type="button"
                disabled={isLocked}
                style={{
                  position: "relative",
                  borderRadius: "1.25rem sm:1.5rem",
                  border: `2px solid ${
                    isLocked
                      ? themeVars.border
                      : selected
                      ? themeVars.borderPrimary
                      : themeVars.border
                  }`,
                  background: isLocked
                    ? themeVars.backgroundMuted
                    : selected
                    ? "color-mix(in srgb, " +
                      themeVars.backgroundPrimary +
                      " 5%, " +
                      themeVars.background +
                      " 95%)"
                    : themeVars.backgroundWhite,
                  boxShadow: selected
                    ? themeVars.shadow
                    : undefined,
                  opacity: isLocked ? 0.60 : 1,
                  cursor: isLocked ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  textAlign: "left",
                  overflow: "hidden",
                }}
                className={`group p-3 sm:p-4`}
                onClick={() => !isLocked && onTemplateChange(type)}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    style={{
                      borderRadius: "0.75rem sm:1rem",
                      border: `1px solid ${
                        selected
                          ? themeVars.borderPrimary
                          : themeVars.border
                      }`,
                      background: selected
                        ? themeVars.backgroundPrimary
                        : themeVars.backgroundMuted,
                      color: selected
                        ? themeVars.textWhite
                        : themeVars.textMuted,
                      transition: "all 0.2s",
                      flexShrink: 0,
                    }}
                    className="p-2 sm:p-3 group-hover:text-primary group-hover:border-primary/20"
                  >
                    {isLocked ? <Lock size={18} /> : <Layout size={18} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                      <h3
                        className="font-extrabold text-sm sm:text-[0.95rem] truncate"
                        style={{
                          color: selected ? themeVars.foregroundPrimary : themeVars.foreground,
                        }}
                      >
                        {t.meta?.title ?? "Standard Template"}
                      </h3>
                      {t.config.isPremium && (
                        <span
                          className="px-1.5 py-0.5 text-[8px] sm:text-[9px] rounded-full font-bold uppercase tracking-wider shrink-0"
                          style={{
                            background: themeVars.backgroundPremium,
                            color: themeVars.textPremium,
                          }}
                        >
                          Premium
                        </span>
                      )}
                    </div>
                    <p
                      className="text-[10px] sm:text-[11px] leading-relaxed line-clamp-2"
                      style={{
                        color: selected ? "color-mix(in srgb, " + themeVars.foregroundPrimary + " 70%, " + themeVars.foreground + " 30%)" : themeVars.textMuted,
                      }}
                    >
                      {t.meta?.description ?? "A clean, high-converting layout for your business."}
                    </p>
                  </div>
                </div>
                {selected && (
                  <div
                    style={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      color: themeVars.foregroundPrimary,
                    }}
                    className="text-primary sm:top-3 sm:right-3"
                  >
                    <CheckCircle2 size={18} fill="currentColor" className="text-white fill-primary sm:w-5 sm:h-5" />
                  </div>
                )}
              </button>
            );
          })
        ) : (
          <div className="col-span-full py-10 sm:py-12 text-center rounded-2xl sm:rounded-4xl border border-dashed border-slate-200 bg-slate-50">
            <p className="text-slate-400 font-medium text-sm">No templates match your search.</p>
            <button
              onClick={() => setSearch("")}
              className="text-primary font-bold text-sm mt-2"
            >Clear search</button>
          </div>
        )}
      </div>
      </div>

      {templateBuilderTemplate && (
        <div className="pt-2">
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100"></span>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                Advanced
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={!canUsePremiumTemplate}
            style={{
              position: "relative",
              borderRadius: "1.25rem sm:1.5rem",
              border: `2px solid ${
                !canUsePremiumTemplate
                  ? themeVars.border
                  : selectedType === CUSTOM_TEMPLATE_TYPE
                  ? themeVars.borderPrimary
                  : themeVars.border
              }`,
              background: !canUsePremiumTemplate
                ? themeVars.backgroundMuted
                : selectedType === CUSTOM_TEMPLATE_TYPE
                ? "color-mix(in srgb, " +
                  themeVars.backgroundPrimary +
                  " 5%, " +
                  themeVars.background +
                  " 95%)"
                : themeVars.backgroundWhite,
              boxShadow:
                selectedType === CUSTOM_TEMPLATE_TYPE
                  ? themeVars.shadow
                  : undefined,
              opacity: !canUsePremiumTemplate ? 0.60 : 1,
              cursor: !canUsePremiumTemplate ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              width: "100%",
              textAlign: "left",
            }}
            className="group p-4 sm:p-5"
            onClick={() => canUsePremiumTemplate && onTemplateChange(CUSTOM_TEMPLATE_TYPE)}
          >
            <div className="flex items-center gap-4 sm:gap-5">
              <div
                style={{
                  borderRadius: "0.75rem sm:1rem",
                  border: `1px solid ${
                    selectedType === CUSTOM_TEMPLATE_TYPE
                      ? themeVars.borderPrimary
                      : themeVars.border
                  }`,
                  background: selectedType === CUSTOM_TEMPLATE_TYPE
                    ? themeVars.backgroundPrimary
                    : themeVars.backgroundMuted,
                  color: selectedType === CUSTOM_TEMPLATE_TYPE
                    ? themeVars.textWhite
                    : themeVars.textMuted,
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
                className="p-3 sm:p-4 group-hover:text-primary"
              >
                {!canUsePremiumTemplate ? <Lock size={20} className="sm:w-6 sm:h-6" /> : <Layout size={20} className="sm:w-6 sm:h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="font-black text-base sm:text-[1.15rem] mb-0.5 sm:mb-1"
                  style={{
                    color: selectedType === CUSTOM_TEMPLATE_TYPE
                      ? themeVars.foregroundPrimary
                      : themeVars.foreground,
                  }}
                >
                  {templateBuilderTemplate.meta?.title ?? "Custom Builder"}
                </h3>
                <p
                  className="text-[11px] sm:text-[0.85rem] leading-tight"
                  style={{
                    color: selectedType === CUSTOM_TEMPLATE_TYPE
                      ? "color-mix(in srgb, " + themeVars.foregroundPrimary + " 70%, " + themeVars.foreground + " 30%)"
                      : themeVars.textMuted,
                  }}
                >
                  {!canUsePremiumTemplate
                    ? "Upgrade to Growth or Pro to unlock the full power of our builder."
                    : (templateBuilderTemplate.meta?.description ?? "Build your site exactly how you want it with modular sections.")}
                </p>
              </div>
              {selectedType === CUSTOM_TEMPLATE_TYPE && canUsePremiumTemplate && (
                <CheckCircle2 size={20} fill="currentColor" className="text-white fill-primary sm:w-6 sm:h-6" />
              )}
            </div>
          </button>
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Link
          href={`/templates/${encodeURIComponent(selectedType)}?from=/dashboard/new&name=${encodeURIComponent(nameForPreview)}&slug=${encodeURIComponent(slugForPreview)}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-bold shadow-lg hover:bg-slate-800 active:scale-95 transition-all"
        >
          <Eye size={16} />
          Live Preview Selected
        </Link>
      </div>
    </div>
  );
}

function ArrowRight({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}