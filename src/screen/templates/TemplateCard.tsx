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
  // image,  // Ignore image for now
  previewHref,
  useHref,
  delay = 0,
  isPremium
}: TemplateCardProps) {
  return (
    <div
      className="group rounded-2xl bg-card border border-border shadow-md hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col relative"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Premium badge */}
      {isPremium && (
        <div className="absolute right-4 top-4 z-20">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-400 text-yellow-900 font-semibold text-xs rounded-full shadow border border-yellow-500">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M8 1l2.1 4.3L15 6l-3.5 3.6L12 15l-4-2.2L4 15l.6-5.4L1 6l4.9-.7L8 1z" />
            </svg>
            Premium
          </span>
        </div>
      )}
      {/* Stylized 'header' block instead of image */}
      <div className="relative flex items-center justify-center h-32 bg-linear-to-br from-primary/20 to-muted/60 transition-all">
        <div className="flex items-center justify-center w-full h-full">
          <span className="uppercase text-4xl font-extrabold tracking-widest text-primary drop-shadow-sm select-none">
            {title[0]}
          </span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-300 grid place-items-center opacity-0 group-hover:opacity-100 z-10">
          <Link
            href={previewHref}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 rounded-full text-sm font-medium cursor-pointer"
          >
            <Eye className="w-4 h-4" /> Preview
          </Link>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-xl mb-1 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 flex-1">
          {description}
        </p>
        <div className="flex gap-2">
          <Link
            href={previewHref}
            className="flex-1 flex items-center justify-center gap-1.5 border border-input bg-background hover:bg-muted h-9 rounded-full text-sm font-medium cursor-pointer transition"
          >
            <Eye className="w-4 h-4" /> Preview
          </Link>
          <Link
            href={useHref}
            className={`flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground hover:opacity-90 h-9 rounded-full text-sm font-semibold cursor-pointer transition ${
              isPremium ? "relative" : ""
            }`}
          >
            Use Template <ArrowRight className="w-4 h-4" />
            {isPremium && (
              <span className="absolute -top-3 right-2 text-amber-500 font-bold text-xs animate-bounce pointer-events-none">
                ★
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
