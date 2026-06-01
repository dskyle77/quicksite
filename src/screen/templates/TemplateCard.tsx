// src/features/templates/TemplateCard.tsx
import Link from "next/link";
import { Eye, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

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
  type,
  title,
  description,
  previewHref,
  useHref,
  delay = 0,
  isPremium,
  image,
  category
}: TemplateCardProps) {
  return (
    <div
      className="group rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col overflow-hidden relative h-full"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute top-3 right-3 z-30">
          <div className="flex items-center gap-1 bg-linear-to-r from-amber-500 to-yellow-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            PREMIUM
          </div>
        </div>
      )}

      {/* Image / Visual Header */}
      <div className="relative h-48 overflow-hidden bg-linear-to-br from-muted to-card">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-primary/10 via-primary/5 to-transparent">
            <span className="text-[120px] font-black text-primary/10 select-none tracking-tighter">
              {title[0]}
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        {type !== "custom" && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <Link
              href={previewHref}
              className="flex items-center gap-2 bg-white text-black hover:bg-white/90 px-5 py-2.5 rounded-xl font-medium text-sm shadow-lg"
            >
              <Eye className="w-4 h-4" />
              Live Preview
            </Link>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <span className="text-xs font-medium px-2.5 py-1 bg-muted rounded-md text-muted-foreground">
            {category}
          </span>
        </div>

        <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
          {description}
        </p>

        <div className="flex gap-3 mt-6">
          {type !== "custom" && (
            <Link
              href={previewHref}
              className="flex-1 border border-input hover:bg-muted py-2.5 rounded-xl text-sm font-medium text-center transition"
            >
              Preview
            </Link>
          )}
          <Link
            href={useHref}
            className={`${
              type !== "custom" ? "flex-1" : "w-full"
            } py-2.5 rounded-xl text-sm font-medium text-center transition flex items-center justify-center gap-2 ${
              isPremium
                ? "bg-linear-to-r from-amber-500 to-yellow-500 text-white hover:brightness-110"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          >
            Use Template
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}