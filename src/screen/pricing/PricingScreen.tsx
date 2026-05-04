// src/features/pricing/PricingScreen.tsx
"use client";

import { useState } from "react";
import authFetch from "@/lib/authFetch";

import { useRouter } from "next/navigation"; 
import { Check, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner";

import { PLANS } from "@/lib/plans";
import type { Plan } from "@/lib/plans";

const FAQ = [
  {
    q: "Can I upgrade or downgrade anytime?",
    a: "Yes. You can switch plans anytime. Upgrades are instant; downgrades take effect at your next billing cycle.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. The Free plan requires no payment details at all. You only pay when you choose to upgrade.",
  },
  {
    q: "How does payment work?",
    a: "We accept bank transfers and cards via Paystack. All amounts are in Naira (₦).",
  },
];

export default function PricingScreen() {
  const { user } = useAuth();
  const { profile } = useUserStore();
  const currentPlan = profile?.plan ?? "free";

  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);

  const router = useRouter();

  const handleUpgrade = async (plan: Plan) => {
    if (plan === "free") return;

    if (!user) {
      router.push("/signup");
      return;
    }

    if (currentPlan === plan) {
      toast.info(`You're already on the ${plan} plan.`);
      return;
    }

    setLoadingPlan(plan);

    try {
      const res = await authFetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start payment");

      router.push(data.authorization_url as string);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setLoadingPlan(null);
    }
  };

  const getButtonLabel = (plan: Plan, buttonText: string) => {
    if (plan === "free") return buttonText;
    if (currentPlan === plan) return "Current Plan";
    return buttonText;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="text-center py-20 px-4">
        <div className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-border bg-muted/50 mb-4">
          <Sparkles className="w-3 h-3 text-primary" /> Simple Pricing
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
          Build your website in minutes
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
          Choose a plan that fits your business. Start free — upgrade as you
          grow.
        </p>
      </section>

      {/* Pricing grid */}
      <section className="px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {PLANS.map((plan) => {
            const isCurrentPlan = currentPlan === plan.plan;
            const isLoading = loadingPlan === plan.plan;

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-6 flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl ${
                  plan.isPopular
                    ? "border-primary shadow-lg bg-card"
                    : "border-border bg-card"
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Your Plan
                  </div>
                )}

                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-3xl font-bold">
                    ₦{plan.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground"> /month</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1 text-sm">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {plan.plan === "free" ? (
                  <Link href={user ? "/dashboard" : "/signup"}>
                    <button className="w-full py-2.5 rounded-full text-sm font-semibold transition cursor-pointer border border-border hover:bg-muted">
                      {user ? "Go to Dashboard" : "Get Started Free"}
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.plan)}
                    disabled={isCurrentPlan || isLoading}
                    className={`w-full py-2.5 rounded-full text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
                      isCurrentPlan
                        ? "border border-green-200 text-green-600 bg-green-50 cursor-default"
                        : plan.isPopular
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : "border border-border hover:bg-muted"
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      getButtonLabel(plan.plan, plan.buttonText)
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-24 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {FAQ.map(({ q, a }) => (
            <div
              key={q}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <p className="font-semibold mb-2">{q}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {a}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            Back to home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
