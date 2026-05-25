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
}

export function TemplateCard({
  title,
  description,
  // image,  // Ignore image for now
  previewHref,
  useHref,
  delay = 0,
}: TemplateCardProps) {
  return (
    <div
      className="group rounded-2xl bg-card border border-border shadow-md hover:shadow-lg hover:border-primary/40 transition-all duration-300 flex flex-col"
      style={{ animationDelay: `${delay}ms` }}
    >
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
        <p className="text-sm text-muted-foreground mb-4 flex-1">{description}</p>
        <div className="flex gap-2">
          <Link
            href={previewHref}
            className="flex-1 flex items-center justify-center gap-1.5 border border-input bg-background hover:bg-muted h-9 rounded-full text-sm font-medium cursor-pointer transition"
          >
            <Eye className="w-4 h-4" /> Preview
          </Link>
          <Link
            href={useHref}
            className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground hover:opacity-90 h-9 rounded-full text-sm font-semibold cursor-pointer transition"
          >
            Use Template <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
