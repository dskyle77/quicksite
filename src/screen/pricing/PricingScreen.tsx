// src/features/pricing/PricingScreen.tsx
"use client";

import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: 0,
    description: "Start building your mini-site",
    features: [
      "1 mini-site",
      "Quicksite subdomain",
      "Basic templates",
      "Powered by Quicksite branding",
    ],
    buttonText: "Get Started Free",
    href: "/signup",
  },
  {
    name: "Basic",
    price: 1500,
    description: "Look professional online",
    isPopular: true,
    features: [
      "Custom domain",
      "Remove Quicksite branding",
      "Better templates",
      "Social links",
      "Basic customization",
    ],
    buttonText: "Upgrade to Basic",
    href: "/signup",
  },
  {
    name: "Growth",
    price: 4000,
    description: "Grow your business",
    features: [
      "Everything in Basic",
      "Analytics (views & clicks)",
      "Contact forms",
      "More sections",
      "Image gallery",
    ],
    buttonText: "Upgrade to Growth",
    href: "/signup",
  },
  {
    name: "Pro",
    price: 10000,
    description: "Run your business online",
    features: [
      "Everything in Growth",
      "Accept payments",
      "Sell products",
      "Advanced customization",
      "Priority performance",
    ],
    buttonText: "Go Pro",
    href: "/signup",
  },
];

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
    a: "We accept bank transfers, Paystack. All amounts are in Naira (₦).",
  },
];

export default function PricingScreen() {
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
          {PLANS.map((plan) => (
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

              <Link href={plan.href}>
                <button
                  className={`w-full py-2.5 rounded-full text-sm font-semibold transition cursor-pointer ${
                    plan.isPopular
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </Link>
            </div>
          ))}
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
