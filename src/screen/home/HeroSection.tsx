// src/screen/home/HeroSection.tsx
import { ArrowRight, Star, Sparkles, MessageCircle } from "lucide-react";
import Link from "next/link";

const SITE_SHORT_NAME = process.env.NEXT_PUBLIC_SITE_SHORT_NAME;
const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN_NAME;

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 sm:pt-20 sm:pb-32 bg-background text-foreground">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-125 w-125 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Content */}
        <div className="space-y-7">
          <div className="inline-flex items-center border border-border px-2.5 py-1 rounded-full bg-secondary/10 gap-2 font-medium text-xs">
            <span className="bg-secondary text-white rounded-full px-2 py-0.5 text-[10px] font-bold">
              NEW
            </span>
            <span className="text-foreground/80">
              WhatsApp orders are live 🇳🇬
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-balance">
            Launch your business website{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                today
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 9C50 3 150 3 198 9"
                  stroke="var(--secondary)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            — no coding needed.
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
            MakeSite helps Nigerian small businesses go online in minutes. Pick
            a template, add your details, and start selling.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 rounded-full font-semibold h-12 px-7 transition-all shadow-lg shadow-primary/20"
            >
              Start for Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center gap-2 border-2 border-input bg-background hover:bg-muted rounded-full font-semibold h-12 px-7 transition-colors"
            >
              See Templates
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-3">
            <div className="flex -space-x-2">
              {["AO", "TB", "CE", "FN"].map((initials, i) => (
                <div
                  key={i}
                  className="h-9 w-9 rounded-full bg-primary border-2 border-background grid place-items-center text-xs font-bold text-white"
                >
                  {initials}
                </div>
              ))}
            </div>
            <div className="text-sm">
              <div className="flex gap-0.5 text-secondary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">12,400+</span>{" "}
                Nigerian businesses
              </p>
            </div>
          </div>
        </div>

        {/* Right — Mockup card stack */}
        <div className="relative flex items-center justify-center min-h-105">
          {/* Main card */}
          <div className="relative w-full max-w-sm bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
            {/* Browser chrome */}
            <div className="h-9 bg-muted/60 border-b border-border flex items-center gap-2 px-4">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-secondary/50" />
                <div className="h-2.5 w-2.5 rounded-full bg-primary/50" />
              </div>
              <div className="flex-1 bg-background rounded-md h-5 text-[10px] flex items-center px-2 text-muted-foreground">
                {SITE_SHORT_NAME}
                {DOMAIN_NAME}/amakachef
              </div>
            </div>

            {/* Site preview */}
            <div className="p-6 space-y-4 bg-linear-to-b from-primary/5 to-background">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary grid place-items-center text-white font-bold text-sm">
                  AO
                </div>
                <div>
                  <p className="font-bold text-sm">Amaka&apos;s Kitchen</p>
                  <p className="text-[10px] text-muted-foreground">
                    Lagos, Nigeria 🇳🇬
                  </p>
                </div>
              </div>

              {/* Hero text */}
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-foreground/10 rounded-md" />
                <div className="h-3 w-full bg-foreground/5 rounded-md" />
                <div className="h-3 w-2/3 bg-foreground/5 rounded-md" />
              </div>

              {/* CTA */}
              <div className="h-9 w-full rounded-xl bg-primary/80" />

              {/* Product grid */}
              <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl bg-muted/60 border border-dashed border-border"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Floating badge — published */}
          <div className="absolute -left-4 sm:-left-6 top-12 bg-card rounded-2xl shadow-xl border border-border p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-secondary/20 grid place-items-center shrink-0">
              <Sparkles className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs font-semibold">Site published!</p>
              <p className="text-[10px] text-muted-foreground">
                {SITE_SHORT_NAME}
                {DOMAIN_NAME}/amakachef
              </p>
            </div>
          </div>

          {/* Floating badge — revenue */}
          <div className="absolute -right-2 sm:-right-4 bottom-16 bg-card rounded-2xl shadow-xl border border-border p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/20 grid place-items-center shrink-0">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold">+₦18,500 today</p>
              <p className="text-[10px] text-muted-foreground">
                3 new WhatsApp orders
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
