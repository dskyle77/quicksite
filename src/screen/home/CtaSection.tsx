// src/features/home/CtaSection.tsx
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const SITE_STANDARD_NAME = process.env.NEXT_PUBLIC_SITE_STANDARD_NAME

export default function CtaSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="rounded-3xl border border-border bg-card p-10 sm:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-96 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-balance">
              Your business deserves to be online.
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join 12,400+ Nigerian businesses growing with {SITE_STANDARD_NAME}. Free
              forever — no card needed.
            </p>
            <Link href="/signup">
              <button className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 rounded-full font-semibold h-12 px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105">
                Get Started Free
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
