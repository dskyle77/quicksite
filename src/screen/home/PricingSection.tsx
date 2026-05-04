// src/features/home/PricingSection.tsx
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PLANS } from "@/lib/plans";


export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-24 border-t border-border/60 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center border border-border px-2.5 py-0.5 text-xs rounded-full mb-4 font-medium bg-muted/50">
            Simple pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance mb-4">
            Plans that grow with your business.
          </h2>
          <p className="text-muted-foreground">
            Start free. Upgrade anytime. No surprise charges.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 border flex flex-col transition-all duration-300 ${
                plan.isPopular
                  ? "bg-primary text-primary-foreground border-primary shadow-xl scale-[1.03] z-10"
                  : "bg-card border-border hover:border-primary/40"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  Most popular
                </div>
              )}

              <p
                className={`text-sm font-semibold mb-1 ${plan.isPopular ? "text-primary-foreground/80" : "text-muted-foreground"}`}
              >
                {plan.name}
              </p>
              <p className="text-3xl font-bold mb-4">
                ₦{plan.price}
                <span
                  className={`text-sm font-normal ${plan.isPopular ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  /mo
                </span>
              </p>

              <ul className="space-y-3 mb-8 text-sm grow">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check
                      className={`h-4 w-4 mt-0.5 shrink-0 ${plan.isPopular ? "text-white/80" : "text-primary"}`}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.name === "Free" ? "/signup" : "/pricing"}
                className="mt-auto block"
              >
                <button
                  className={`w-full py-2 px-4 rounded-full text-sm font-bold transition-colors cursor-pointer ${
                    plan.isPopular
                      ? "bg-white text-primary hover:bg-white/90"
                      : "border border-input bg-background hover:bg-accent"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/pricing"
            className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            See full pricing details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
