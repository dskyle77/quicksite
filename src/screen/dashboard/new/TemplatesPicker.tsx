import Link from "next/link";
import { Layout, CheckCircle2, Eye } from "lucide-react";
import { templatesRegistry } from "@/lib/templates";
import { useMemo, useState } from "react";

interface TemplatePickerProps {
  selectedType: string;
  onTemplateChange: (type: string) => void;
  slugForPreview: string;
  nameForPreview: string;
}

export function TemplatePicker({
  selectedType,
  onTemplateChange,
  slugForPreview,
  nameForPreview,
}: TemplatePickerProps) {
  const [search, setSearch] = useState("");

  const filteredTemplates = useMemo(() => {
    const cleanedSearch = search.trim().toLowerCase();
    const result = templatesRegistry
      .filter(({ meta, config }) => {
        if (!cleanedSearch) return true;
        if (config.type === selectedType) return true;
        return (
          meta.title.toLowerCase().includes(cleanedSearch) ||
          meta.category.toLowerCase().includes(cleanedSearch) ||
          meta.description.toLowerCase().includes(cleanedSearch)
        );
      })
      .slice(0, 5)
      .sort((a) =>
        a.config.type === selectedType ? -1 : 1,
      );
    return result;
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
