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
      shownTemplates = [];
      if (selectedTemplate && selectedTemplate.config.type !== "template-builder") {
        shownTemplates.push(selectedTemplate);
      }
      for (const t of others) {
        if (!shownTemplates.find((tt) => tt.config.type === t.config.type) && shownTemplates.length < 6) {
          shownTemplates.push(t);
        }
      }
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
      shownTemplates = others.slice(0, 6);
    }

    return { filteredTemplates: shownTemplates, templateBuilderTemplate: builder };
  }, [search, selectedType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: themeVars.textMuted }} size={18} />
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
              fontSize: "0.95rem",
              outline: "none",
              transition: "all 0.2s",
            }}
            className="focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </div>
        <Link
          href={`/templates?name=${encodeURIComponent(nameForPreview)}&slug=${encodeURIComponent(slugForPreview)}`}
          style={{
            color: themeVars.foregroundPrimary,
            fontWeight: 700,
            fontSize: "0.95rem",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            alignSelf: "end",
            textDecoration: "underline",
          }}
          className="hover:underline self-end sm:self-auto"
        >
          View All Templates <ArrowRight size={14} className="inline" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  padding: "1rem",
                  borderRadius: "1.5rem",
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
                className={`group`}
                onClick={() => !isLocked && onTemplateChange(type)}
              >
                <div className="flex items-start gap-4">
                  <div
                    style={{
                      padding: "0.75rem",
                      borderRadius: "1rem",
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
                    className="group-hover:text-primary group-hover:border-primary/20"
                  >
                    {isLocked ? <Lock size={20} /> : <Layout size={20} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        style={{
                          fontWeight: 800,
                          fontSize: "0.95rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: selected ? themeVars.foregroundPrimary : themeVars.foreground,
                        }}
                      >
                        {t.meta?.title ?? "Standard Template"}
                      </h3>
                      {t.config.isPremium && (
                        <span
                          style={{
                            padding: "0.125rem 0.5rem",
                            fontSize: "9px",
                            borderRadius: "999px",
                            background: themeVars.backgroundPremium,
                            color: themeVars.textPremium,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginLeft: "0.25rem",
                          }}
                        >
                          Premium
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: "11px",
                        lineHeight: "1.5",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
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
                      top: "0.75rem",
                      right: "0.75rem",
                      color: themeVars.foregroundPrimary,
                    }}
                    className="text-primary"
                  >
                    <CheckCircle2 size={20} fill="currentColor" className="text-white fill-primary" />
                  </div>
                )}
              </button>
            );
          })
        ) : (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: "3rem 0",
              textAlign: "center",
              background: themeVars.backgroundMuted,
              borderRadius: "2rem",
              border: `1px dashed ${themeVars.border}`,
            }}
          >
            <p style={{ color: themeVars.textMuted, fontWeight: 500 }}>No templates match your search.</p>
            <button
              onClick={() => setSearch("")}
              style={{ color: themeVars.foregroundPrimary, fontWeight: 700, fontSize: "0.95rem", marginTop: "0.5rem" }}
            >Clear search</button>
          </div>
        )}
      </div>

      {templateBuilderTemplate && (
        <div className="pt-2">
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span
                style={{ width: "100%", borderTop: `1px solid ${themeVars.border}` }}
              ></span>
            </div>
            <div className="relative flex justify-center">
              <span
                style={{
                  background: themeVars.backgroundWhite,
                  padding: "0 1rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: themeVars.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Advanced
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={!canUsePremiumTemplate}
            style={{
              position: "relative",
              padding: "1.25rem",
              borderRadius: "1.5rem",
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
            className="group"
            onClick={() => canUsePremiumTemplate && onTemplateChange(CUSTOM_TEMPLATE_TYPE)}
          >
            <div className="flex items-center gap-5">
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "1rem",
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
                className="group-hover:text-primary"
              >
                {!canUsePremiumTemplate ? <Lock size={24} /> : <Layout size={24} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  style={{
                    fontWeight: 900,
                    fontSize: "1.15rem",
                    marginBottom: "0.25rem",
                    color: selectedType === CUSTOM_TEMPLATE_TYPE
                      ? themeVars.foregroundPrimary
                      : themeVars.foreground,
                  }}
                >
                  {templateBuilderTemplate.meta?.title ?? "Custom Builder"}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: selectedType === CUSTOM_TEMPLATE_TYPE
                      ? "color-mix(in srgb, " + themeVars.foregroundPrimary + " 70%, " + themeVars.foreground + " 30%)"
                      : themeVars.textMuted,
                  }}
                >
                  {!canUsePremiumTemplate
                    ? "Upgrade to Growth or Pro to unlock the full power of our drag-and-drop builder."
                    : (templateBuilderTemplate.meta?.description ?? "Build your site exactly how you want it with modular sections.")}
                </p>
              </div>
              {selectedType === CUSTOM_TEMPLATE_TYPE && canUsePremiumTemplate && (
                <CheckCircle2 size={24} fill="currentColor" className="text-white fill-primary" />
              )}
            </div>
          </button>
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Link
          href={`/templates/${encodeURIComponent(selectedType)}?from=/dashboard/new&name=${encodeURIComponent(nameForPreview)}&slug=${encodeURIComponent(slugForPreview)}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "999px",
            background: "#18181b",
            color: "#fff",
            fontSize: "0.99rem",
            fontWeight: 700,
            boxShadow: themeVars.shadow,
            transition: "all 0.15s",
            outline: "none",
            border: 0,
          }}
          className="hover:bg-slate-800 active:scale-95"
        >
          <Eye size={18} />
          Live Preview Selected Template
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