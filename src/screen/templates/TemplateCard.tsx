// src/features/templates/TemplateCard.tsx
import Link from "next/link";
import { Eye, ArrowRight } from "lucide-react";

interface TemplateCardProps {
  type: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  previewHref: string;
  useHref: string;
  delay?: number;
  isPremium: boolean;
}

export function TemplateCard({
  title,
  description,
  previewHref,
  useHref,
  delay = 0,
  isPremium
}: TemplateCardProps) {
  return (
    <div
      className="group rounded-xl bg-card border border-border shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-200 flex flex-col relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Premium badge */}
      {isPremium && (
        <div className="absolute right-2 top-2 z-20">
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-yellow-400 text-yellow-900 font-bold text-[10px] rounded-sm shadow-xs border border-yellow-500">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
              <path d="M8 1l2.1 4.3L15 6l-3.5 3.6L12 15l-4-2.2L4 15l.6-5.4L1 6l4.9-.7L8 1z" />
            </svg>
            PREMIUM
          </span>
        </div>
      )}

      {/* Stylized compact header block */}
      <div className="relative flex items-center justify-center h-20 bg-linear-to-br from-primary/10 to-muted/40 transition-all">
        <div className="flex items-center justify-center w-full h-full">
          <span className="uppercase text-2xl font-black tracking-widest text-primary/80 drop-shadow-xs select-none">
            {title[0]}
          </span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/10 transition-all duration-200 grid place-items-center opacity-0 group-hover:opacity-100 z-10">
          <Link
            href={previewHref}
            className="flex items-center gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-7 px-3 rounded-md text-xs font-medium cursor-pointer shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </Link>
        </div>
      </div>

      <div className="p-3.5 flex flex-col flex-1">
        <h3 className="font-bold text-sm mb-0.5 text-foreground tracking-tight line-clamp-1">{title}</h3>
        <p className="text-xs text-muted-foreground mb-3 flex-1 line-clamp-2 leading-relaxed">
          {description}
        </p>
        
        <div className="flex gap-1.5 mt-auto">
          <Link
            href={previewHref}
            className="flex-1 flex items-center justify-center gap-1 border border-input bg-background hover:bg-muted h-7.5 rounded-md text-xs font-medium cursor-pointer transition"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </Link>
          <Link
            href={useHref}
            className={`flex-1 flex items-center justify-center gap-1 bg-primary text-primary-foreground hover:opacity-95 h-7.5 rounded-md text-xs font-medium cursor-pointer transition ${
              isPremium ? "relative" : ""
            }`}
          >
            Use Template <ArrowRight className="w-3.5 h-3.5" />
            {isPremium && (
              <span className="absolute -top-2 right-1 text-amber-500 font-bold text-[10px] pointer-events-none">
                ★
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}