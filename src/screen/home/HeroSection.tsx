import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles, Star } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

const SITE_STANDARD_NAME =
  process.env.NEXT_PUBLIC_SITE_STANDARD_NAME || "Quicksite";

const SITE_SHORT_NAME = process.env.NEXT_PUBLIC_SITE_SHORT_NAME || "quicksite";

const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN_NAME || ".ng";

export default function HeroSection() {
  const { user } = useAuth();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-background text-foreground pt-12 pb-24 sm:pt-20 sm:pb-32"
    >
      {/* Background blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 -right-32 h-125 w-125 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="relative container mx-auto grid items-center gap-12 px-4 lg:grid-cols-2 lg:gap-16">
        {/* Left content */}
        <header className="space-y-7">
          {/* Announcement */}
          <aside className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/10 px-2.5 py-1 text-xs font-medium">
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-white">
              NEW
            </span>

            <p className="text-foreground/80">
              Get discovered on Google & WhatsApp 🇳🇬
            </p>
          </aside>

          {/* Heading */}
          <h1
            id="hero-heading"
            className="text-5xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Turn your Business into a{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-linear-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                discoverable brand
              </span>

              <svg
                aria-hidden="true"
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
            in minutes.
          </h1>

          {/* Description */}
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            {SITE_STANDARD_NAME} gives Nigerian businesses an instant online
            presence with SEO-powered business pages, WhatsApp leads, and
            beautiful mini websites — no coding or complicated setup needed.
          </p>

          {/* CTA */}
          <nav aria-label="Hero actions" className="flex flex-wrap gap-3">
            {user ? (
              <Link
                href="/dashboard/new"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90"
              >
                Create New
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90"
              >
                Start for Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}

            <Link
              href="/templates"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-input bg-background px-7 font-semibold transition-colors hover:bg-muted"
            >
              See Templates
            </Link>
          </nav>

          {/* Social proof */}
          <section
            aria-label="Customer statistics"
            className="flex items-center gap-6 pt-3"
          >
            <div aria-hidden="true" className="flex -space-x-2">
              {["AO", "TB", "CE", "FN"].map((initials, i) => (
                <div
                  key={i}
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-background bg-primary text-xs font-bold text-white"
                >
                  {initials}
                </div>
              ))}
            </div>

            <div className="text-sm">
              <div
                aria-label="5 star rating"
                className="flex gap-0.5 text-secondary"
              >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>

              <p className="text-muted-foreground">
                <strong className="text-foreground">12,400+</strong> Nigerian
                businesses
              </p>
            </div>
          </section>
        </header>

        {/* Right preview */}
        <aside
          aria-label="Quicksite business preview"
          className="relative flex min-h-105 items-center justify-center"
        >
          {/* Main preview */}
          <article className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            {/* Browser top */}
            <header className="flex h-9 items-center gap-2 border-b border-border bg-muted/60 px-4">
              <div aria-hidden="true" className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-secondary/50" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary/50" />
              </div>

              <p className="flex h-5 flex-1 items-center rounded-md bg-background px-2 text-[10px] text-muted-foreground">
                {SITE_SHORT_NAME}
                {DOMAIN_NAME}/amakachef
              </p>
            </header>

            {/* Preview content */}
            <div className="space-y-4 bg-linear-to-b from-primary/5 to-background p-6">
              {/* Business identity */}
              <header className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-white">
                  AO
                </div>

                <div>
                  <h2 className="text-sm font-bold">Amaka&apos;s Kitchen</h2>

                  <p className="text-[10px] text-muted-foreground">
                    Lagos, Nigeria 🇳🇬
                  </p>
                </div>
              </header>

              {/* Content skeleton */}
              <section
                aria-label="Business content preview"
                className="space-y-2"
              >
                <div className="h-5 w-3/4 rounded-md bg-foreground/10" />
                <div className="h-3 w-full rounded-md bg-foreground/5" />
                <div className="h-3 w-2/3 rounded-md bg-foreground/5" />
              </section>

              {/* CTA */}
              <button
                type="button"
                aria-label="Chat on WhatsApp"
                className="h-9 w-full rounded-xl bg-primary/80"
              />

              {/* Products */}
              <section
                aria-label="Product gallery preview"
                className="grid grid-cols-3 gap-2"
              >
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl border border-dashed border-border bg-muted/60"
                  />
                ))}
              </section>
            </div>
          </article>

          {/* Floating badge */}
          <section
            aria-label="Website published notification"
            className="absolute top-12 -left-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xl sm:-left-6"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary/20">
              <Sparkles className="h-5 w-5 text-secondary" />
            </div>

            <div>
              <p className="text-xs font-semibold">Site published!</p>

              <p className="text-[10px] text-muted-foreground">
                {SITE_SHORT_NAME}
                {DOMAIN_NAME}/amakachef
              </p>
            </div>
          </section>

          {/* Floating sales badge */}
          <section
            aria-label="Recent WhatsApp sales"
            className="absolute bottom-16 -right-2 flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xl sm:-right-4"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/20">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-xs font-semibold">+₦18,500 today</p>

              <p className="text-[10px] text-muted-foreground">
                3 new WhatsApp orders
              </p>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
