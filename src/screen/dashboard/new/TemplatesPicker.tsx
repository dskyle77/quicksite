/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Layout, CheckCircle2, Eye, Lock } from "lucide-react";
import { templatesRegistry } from "@/lib/templates";
import { CUSTOM_TEMPLATE_TYPE } from "@/lib/plans";
import { useMemo, useState } from "react";

interface TemplatePickerProps {
  selectedType: string;
  onTemplateChange: (type: string) => void;
  slugForPreview: string;
  nameForPreview: string;
  canUseCustomTemplate?: boolean;
}

export function TemplatePicker({
  selectedType,
  onTemplateChange,
  slugForPreview,
  nameForPreview,
  canUseCustomTemplate = true,
}: TemplatePickerProps) {
  const [search, setSearch] = useState("");

  const { filteredTemplates, templateBuilderTemplate } = useMemo(() => {
    const cleanedSearch = search.trim().toLowerCase();

    // Separate template-builder out from other templates
    let builder: any = null;
    const others: typeof templatesRegistry = [];

    // Optionally, identify selectedTemplate even if it's template-builder
    let selectedTemplate: any = null;

    for (const t of templatesRegistry) {
      const isSelected = t.config.type === selectedType;
      if (t.config.type === "template-builder") {
        builder = t;
        if (isSelected) selectedTemplate = t;
        continue;
      }
      if (isSelected) {
        selectedTemplate = t;
      }
      // If searching, filter here
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
        if (
          !shownTemplates.find((tt) => tt.config.type === t.config.type) &&
          shownTemplates.length < 4
        ) {
          shownTemplates.push(t);
        }
      }
    } else {
      // On search, include "template-builder" in results only if it matches search
      if (
        builder &&
        (
          builder.meta?.title?.toLowerCase().includes(cleanedSearch) ||
          builder.meta?.category?.toLowerCase().includes(cleanedSearch) ||
          builder.meta?.description?.toLowerCase().includes(cleanedSearch)
        )
      ) {
        // Remove template-builder from builder, push to end
      } else {
        builder = null;
      }
      // Show up to 4 results (excluding template-builder)
      shownTemplates = others.slice(0, 4);
    }

    // Always show template-builder last, as divider, unless filtered out by search
    return {
      filteredTemplates: shownTemplates,
      templateBuilderTemplate: builder,
    };
  }, [search, selectedType]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold ml-1">Template</span>
        <Link
          href={`/templates?name=${encodeURIComponent(nameForPreview)}&slug=${encodeURIComponent(slugForPreview)}`}
          className="text-primary text-sm font-semibold rounded-full px-3 py-1 transition-all border border-primary cursor-pointer"
        >
          View all
        </Link>
      </div>
      <div className="grid gap-3">
        <input
          type="text"
          placeholder="Search templates..."
          className="h-9 px-3 py-1 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/70 transition-colors mb-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
        />
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((t) => {
            const type = t.config.type;
            const selected = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                className={[
                  "relative p-3 rounded-2xl border-2 transition-all text-left",
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-muted/40",
                ].join(" ")}
                tabIndex={0}
                onClick={() => onTemplateChange(type)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={[
                      "p-2 rounded-lg border shadow-sm transition-all shrink-0",
                      selected
                        ? "bg-white border-primary"
                        : "bg-slate-50 border-slate-200",
                    ].join(" ")}
                  >
                    <Layout
                      size={16}
                      className={selected ? "text-primary" : "text-slate-400"}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3
                      className={[
                        "font-bold text-sm truncate transition-colors",
                        selected ? "text-primary" : "text-foreground",
                      ].join(" ")}
                    >
                      {t.meta?.title ?? "Production Template"}
                    </h3>
                    <p
                      className={[
                        "text-[10px] line-clamp-3 transition-colors",
                        selected ? "text-primary/80" : "text-slate-500",
                      ].join(" ")}
                    >
                      {t.meta?.description ??
                        "Ready-to-ship layout for catalogue sites."}
                    </p>
                  </div>
                </div>
                {selected && (
                  <CheckCircle2
                    className="absolute top-2 right-2 text-primary drop-shadow"
                    size={16}
                  />
                )}
              </button>
            );
          })
        ) : (
          <div className="text-sm text-muted-foreground text-center py-6">
            No templates found.
          </div>
        )}

        {/* Divider and Template Builder at the end */}
        {templateBuilderTemplate && (
          <>
            <div className="border-t my-2 border-border" />
            <button
              key={templateBuilderTemplate.config.type}
              type="button"
              disabled={!canUseCustomTemplate}
              className={[
                "relative p-3 rounded-2xl border-2 transition-all text-left w-full",
                !canUseCustomTemplate
                  ? "opacity-60 cursor-not-allowed border-transparent bg-muted/30"
                  : selectedType === CUSTOM_TEMPLATE_TYPE
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-muted/40",
              ].join(" ")}
              tabIndex={canUseCustomTemplate ? 0 : -1}
              onClick={() => {
                if (canUseCustomTemplate) {
                  onTemplateChange(CUSTOM_TEMPLATE_TYPE);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={[
                    "p-2 rounded-lg border shadow-sm transition-all shrink-0",
                    selectedType === CUSTOM_TEMPLATE_TYPE
                      ? "bg-white border-primary"
                      : "bg-slate-50 border-slate-200",
                  ].join(" ")}
                >
                  {!canUseCustomTemplate ? (
                    <Lock size={16} className="text-slate-400" />
                  ) : (
                    <Layout
                      size={16}
                      className={
                        selectedType === CUSTOM_TEMPLATE_TYPE
                          ? "text-primary"
                          : "text-slate-400"
                      }
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h3
                    className={[
                      "font-bold text-sm truncate transition-colors",
                      selectedType === CUSTOM_TEMPLATE_TYPE
                        ? "text-primary"
                        : "text-foreground",
                    ].join(" ")}
                  >
                    {templateBuilderTemplate.meta?.title ?? "Custom Builder"}
                  </h3>
                  <p
                    className={[
                      "text-[10px] line-clamp-3 transition-colors",
                      selectedType === CUSTOM_TEMPLATE_TYPE
                        ? "text-primary/80"
                        : "text-slate-500",
                    ].join(" ")}
                  >
                    {!canUseCustomTemplate
                      ? "Upgrade to Growth or Pro to build with custom sections."
                      : (templateBuilderTemplate.meta?.description ??
                        "Fully dynamic template builder supporting multiple section instances.")}
                  </p>
                </div>
              </div>
              {selectedType === CUSTOM_TEMPLATE_TYPE && canUseCustomTemplate && (
                <CheckCircle2
                  className="absolute top-2 right-2 text-primary drop-shadow"
                  size={16}
                />
              )}
            </button>
          </>
        )}

        <Link
          href={`/templates/${encodeURIComponent(selectedType)}?from=/dashboard/new&name=${encodeURIComponent(nameForPreview)}&slug=${encodeURIComponent(slugForPreview)}`}
          className="h-10 inline-flex items-center justify-center gap-2 rounded-full border bg-primary text-sm font-semibold text-primary-foreground transition"
        >
          <Eye size={16} />
          Preview Template
        </Link>
      </div>
    </div>
  );
}
