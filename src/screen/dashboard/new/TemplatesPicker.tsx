import Link from "next/link";
import { Layout, CheckCircle2, Eye } from "lucide-react";
import { templatesRegistry } from "@/lib/templates";

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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold ml-1">Template</span>
        <Link href={`/templates?name=${nameForPreview}&slug=${slugForPreview}`}>
          <button className="text-primary text-sm font-semibold rounded-full px-3 py-1 transition-all border border-primary cursor-pointer">
            View all
          </button>
        </Link>
      </div>
      <div className="grid gap-3">
        {templatesRegistry.slice(0, 3).map((t) => {
          const type = t.config.type;
          const selected = selectedType === type;
          return (
            <div
              className={[
                "relative p-3 rounded-2xl border-2 transition-all cursor-pointer",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-transparent bg-muted/40",
              ].join(" ")}
              key={type}
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
            </div>
          );
        })}
        <Link
          href={`/templates/${selectedType}?from=/dashboard/new&name=${nameForPreview}&slug=${slugForPreview}`}
          className="h-10 inline-flex items-center justify-center gap-2 rounded-full border bg-primary text-sm font-semibold text-primary-foreground transition"
        >
          <Eye size={16} />
          Preview Template
        </Link>
      </div>
    </div>
  );
}