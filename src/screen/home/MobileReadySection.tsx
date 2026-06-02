import Link from "next/link";
import {
  ArrowRight,
  Check,
  MousePointer2,
  Smartphone,
  Sparkles,
} from "lucide-react";

export default function MobileReadySection() {
  return (
    <section
      aria-labelledby="mobile-friendly-heading"
      className="bg-background py-20"
    >
      <div className="container mx-auto px-2">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-10 text-primary-foreground sm:p-14">
          {/* Background effect */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, white 0%, transparent 50%)",
            }}
          />

          <div className="relative grid items-center gap-12 md:grid-cols-2">
            {/* Left content */}
            <header>
              {/* Badge */}
              <aside className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs font-semibold">
                Mobile Friendly
              </aside>

              {/* Heading */}
              <h2
                id="mobile-friendly-heading"
                className="mb-4 text-3xl font-bold leading-tight text-balance sm:text-4xl"
              >
                Make your business mobile friendly and accessible from any device.
              </h2>

              {/* Description */}
              <p className="mb-6 max-w-md leading-relaxed text-primary-foreground/80">
                Every Quicksite business page is expertly crafted to be mobile friendly for Android, iPhone, and low-data users—making it easy for customers to browse, discover, and contact your business wherever they are.
              </p>

              {/* CTA */}
              <nav aria-label="Mobile section actions">
                <Link href="/templates">
                  <button className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-secondary px-4 font-semibold text-secondary-foreground shadow-lg shadow-black/10 transition-all hover:opacity-90">
                    See mobile-friendly templates
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </nav>
            </header>

            {/* Right visual */}
            <aside
              aria-label="Mobile website friendly preview"
              className="relative flex h-75 items-center justify-center sm:h-95"
            >
              {/* Main mobile preview */}
              <article className="absolute w-full max-w-[320px] rotate-2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                {/* Browser top */}
                <header className="flex h-8 items-center gap-1.5 border-b border-border bg-muted/50 px-4">
                  <span className="h-2 w-2 rounded-full bg-destructive/40" />
                  <span className="h-2 w-2 rounded-full bg-secondary/40" />
                  <span className="h-2 w-2 rounded-full bg-primary/40" />
                </header>

                {/* Preview content */}
                <div className="space-y-4 bg-background p-6">
                  {/* Header */}
                  <header className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="h-2.5 w-24 rounded bg-foreground/10" />
                      <div className="h-2 w-16 rounded bg-foreground/5" />
                    </div>
                  </header>

                  {/* Grid preview */}
                  <section
                    aria-label="Mobile content preview"
                    className="grid grid-cols-2 gap-3"
                  >
                    <div className="h-20 rounded-xl border border-dashed border-border bg-muted/50" />
                    <div className="h-20 rounded-xl border border-dashed border-border bg-muted/50" />
                  </section>

                  {/* CTA preview */}
                  <button
                    type="button"
                    aria-label="WhatsApp contact button preview"
                    className="h-10 w-full rounded-lg bg-primary/80"
                  />
                </div>
              </article>

              {/* Success card */}
              <section
                aria-label="Mobile optimization status"
                className="absolute top-10 right-0 z-20 w-52 rotate-6 rounded-xl border border-primary/20 bg-card p-4 shadow-2xl sm:-right-2"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Check className="h-4 w-4 text-white" />
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-foreground">
                      Mobile Friendly Complete
                    </p>

                    <p className="text-[10px] leading-tight text-muted-foreground">
                      Your business page is fully mobile friendly and ready for WhatsApp leads.
                    </p>
                  </div>
                </div>
              </section>

              {/* Pointer */}
              <div
                aria-hidden="true"
                className="absolute bottom-10 left-1/4 z-30 animate-pulse"
              >
                <MousePointer2 className="fill-secondary h-6 w-6 text-secondary drop-shadow-md" />
              </div>

              {/* Sparkles */}
              <div
                aria-hidden="true"
                className="absolute -top-4 left-8 animate-pulse text-white/30"
              >
                <Sparkles className="h-8 w-8" />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
