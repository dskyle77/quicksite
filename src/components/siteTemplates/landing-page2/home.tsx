/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { TemplateProps, TemplateComponentProps } from "@/lib/templates";
import { Navbar, Footer } from "./layout";
import TemplateImage from "@/components/shared/TemplateImage";
import CtaLink from "@/components/shared/CtaLinkModal";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ isEditor, content, onUpdate }: TemplateComponentProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 md:pt-24 md:pb-20">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        {/* Left: copy */}
        <div>
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
            style={{
              background: "var(--qs-bg-alt)",
              border: "1px solid var(--qs-border)",
              color: "var(--qs-text-muted)",
            }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("hero.badge", e.currentTarget.textContent?.trim())
            }
          >
            {content?.hero?.badge ?? "🚀 Now in Public Beta"}
          </div>

          <h2
            className="max-w-xl text-4xl font-extrabold tracking-tight leading-[1.1] md:text-6xl"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("hero.title", e.currentTarget.textContent?.trim())
            }
          >
            {content?.hero?.title ?? "The Fastest Way to Launch Your Product"}
          </h2>

          <p
            className="mt-5 max-w-lg text-base leading-7 md:text-lg"
            style={{ color: "var(--qs-text-muted)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("hero.desc", e.currentTarget.textContent?.trim())
            }
          >
            {content?.hero?.desc ??
              "Stop wasting time on boilerplate. Get everything you need to go from idea to live product in days — not months."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink
              isEditor={isEditor}
              label={content?.hero?.primaryButton ?? "Start for Free"}
              linkConfig={content?.hero?.primaryButtonLink}
              onLabelChange={(v) => onUpdate("hero.primaryButton", v)}
              onLinkChange={(cfg) => onUpdate("hero.primaryButtonLink", cfg)}
              className="rounded-xl px-7 py-3 font-bold text-base transition-transform hover:scale-[1.02] active:scale-95"
              style={{
                background: "var(--qs-primary)",
                color: "var(--qs-primary-fg)",
              }}
            />
            <CtaLink
              isEditor={isEditor}
              label={content?.hero?.secondaryButton ?? "Watch Demo"}
              linkConfig={content?.hero?.secondaryButtonLink}
              onLabelChange={(v) => onUpdate("hero.secondaryButton", v)}
              onLinkChange={(cfg) => onUpdate("hero.secondaryButtonLink", cfg)}
              className="rounded-xl px-7 py-3 font-bold text-base transition-transform hover:scale-[1.02] active:scale-95"
              style={{
                background: "var(--qs-bg-alt)",
                color: "var(--qs-text)",
                border: "1px solid var(--qs-border)",
              }}
            />
          </div>

          <p
            className="mt-5 text-sm"
            style={{ color: "var(--qs-text-muted)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("hero.trustBadge", e.currentTarget.textContent?.trim())
            }
          >
            {content?.hero?.trustBadge ?? "✓ Trusted by 500+ teams worldwide"}
          </p>
        </div>

        {/* Right: image */}
        <div className="relative">
          <TemplateImage
            source={content?.hero?.image1}
            publicId={content?.hero?.image1PId}
            isEditor={isEditor}
            onImageChange={(url, publicId) => {
              onUpdate("hero", {
                ...content.hero,
                image1: url,
                image1PId: publicId,
              });
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Logos / Social Proof ─────────────────────────────────────────────────────

function Logos({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const logos = content?.logos ?? [
    { name: "Acme Corp" },
    { name: "Globex" },
    { name: "Initech" },
    { name: "Umbrella" },
    { name: "Hooli" },
  ];

  return (
    <section
      className="border-y py-8"
      style={{ borderColor: "var(--qs-border)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <p
          className="mb-6 text-center text-sm font-medium uppercase tracking-widest"
          style={{ color: "var(--qs-text-muted)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("logosHeading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.logosHeading ?? "Trusted by teams at"}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {logos.map((logo: any, i: number) => (
            <span
              key={i}
              className="relative text-lg font-bold tracking-tight opacity-40 hover:opacity-70 transition-opacity"
              style={{ color: "var(--qs-text)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newLogos = [...logos];
                newLogos[i].name =
                  e.currentTarget.textContent?.trim() || logo.name;
                onUpdate("logos", newLogos);
              }}
            >
              {logo.name}
              {isEditor && (
                <Xbutton
                  onClick={() => {
                    const newLogos = logos.filter(
                      (_: any, idx: number) => idx !== i,
                    );
                    onUpdate("logos", newLogos);
                  }}
                />
              )}
            </span>
          ))}
          {isEditor && (
            <AddButton
              onClick={() => {
                onUpdate("logos", [...logos, { name: "Brand Name" }]);
              }}
            >
              Add Logo
            </AddButton>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function Features({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const features = content?.features ?? [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-24" id="features">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h3
          className="text-3xl font-bold tracking-tight md:text-4xl"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("featuresHeading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.featuresHeading ?? "Everything You Need"}
        </h3>
        <p
          className="mt-4 text-base md:text-lg"
          style={{ color: "var(--qs-text-muted)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("featuresSubheading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.featuresSubheading ??
            "Purpose-built features that help you move faster and ship with confidence."}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {features.map((feature: any, i: number) => (
          <div
            key={i}
            className="relative rounded-3xl p-6"
            style={{
              background: "var(--qs-bg-alt)",
              border: "1px solid var(--qs-border)",
            }}
          >
            {isEditor && (
              <div className="absolute top-3 right-3">
                <Xbutton
                  onClick={() => {
                    const newFeatures = features.filter(
                      (_: any, idx: number) => idx !== i,
                    );
                    onUpdate("features", newFeatures);
                  }}
                  color="red"
                />
              </div>
            )}

            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
              style={{
                background: "var(--qs-bg)",
                border: "1px solid var(--qs-border)",
              }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newFeatures = [...features];
                newFeatures[i].icon =
                  e.currentTarget.textContent?.trim() || feature.icon;
                onUpdate("features", newFeatures);
              }}
            >
              {feature.icon}
            </div>

            <h4
              className="text-base font-semibold"
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newFeatures = [...features];
                newFeatures[i].title =
                  e.currentTarget.textContent?.trim() || feature.title;
                onUpdate("features", newFeatures);
              }}
            >
              {feature.title}
            </h4>

            <p
              className="mt-2 text-sm leading-6"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newFeatures = [...features];
                newFeatures[i].desc =
                  e.currentTarget.textContent?.trim() || feature.desc;
                onUpdate("features", newFeatures);
              }}
            >
              {feature.desc}
            </p>
          </div>
        ))}
        {isEditor && (
          <AddButton
            onClick={() => {
              onUpdate("features", [
                ...features,
                {
                  icon: "✨",
                  title: "New Feature",
                  desc: "Describe this feature here.",
                },
              ]);
            }}
          >
            Add Feature
          </AddButton>
        )}
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const steps = content?.steps ?? [];

  return (
    <section
      className="py-16 md:py-24"
      id="how-it-works"
      style={{ background: "var(--qs-bg-alt)" }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h3
            className="text-3xl font-bold tracking-tight md:text-4xl"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("howItWorksHeading", e.currentTarget.textContent?.trim())
            }
          >
            {content?.howItWorksHeading ?? "How It Works"}
          </h3>
          <p
            className="mt-4 text-base md:text-lg"
            style={{ color: "var(--qs-text-muted)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate(
                "howItWorksSubheading",
                e.currentTarget.textContent?.trim(),
              )
            }
          >
            {content?.howItWorksSubheading ??
              "From sign-up to launch in three simple steps."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step: any, i: number) => (
            <div
              key={i}
              className="relative rounded-3xl p-8"
              style={{
                background: "var(--qs-bg)",
                border: "1px solid var(--qs-border)",
              }}
            >
              <div
                className="mb-4 text-4xl font-black opacity-10"
                style={{ color: "var(--qs-primary)" }}
              >
                {step.number}
              </div>

              <h4
                className="text-xl font-bold"
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newSteps = [...steps];
                  newSteps[i].title =
                    e.currentTarget.textContent?.trim() || step.title;
                  onUpdate("steps", newSteps);
                }}
              >
                {step.title}
              </h4>

              <p
                className="mt-3 text-sm leading-6"
                style={{ color: "var(--qs-text-muted)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newSteps = [...steps];
                  newSteps[i].desc =
                    e.currentTarget.textContent?.trim() || step.desc;
                  onUpdate("steps", newSteps);
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const plans = content?.plans ?? [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-24" id="pricing">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h3
          className="text-3xl font-bold tracking-tight md:text-4xl"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("pricingHeading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.pricingHeading ?? "Simple, Transparent Pricing"}
        </h3>
        <p
          className="mt-4 text-base md:text-lg"
          style={{ color: "var(--qs-text-muted)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("pricingSubheading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.pricingSubheading ?? "No hidden fees. Cancel anytime."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan: any, i: number) => (
          <div
            key={i}
            className="relative flex flex-col rounded-3xl p-7"
            style={
              plan.highlighted
                ? {
                    background: "var(--qs-primary)",
                    color: "var(--qs-primary-fg)",
                    border: "1px solid var(--qs-primary)",
                  }
                : {
                    background: "var(--qs-bg-alt)",
                    border: "1px solid var(--qs-border)",
                  }
            }
          >
            {plan.highlighted && (
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold"
                style={{ background: "var(--qs-text)", color: "var(--qs-bg)" }}
              >
                Most Popular
              </div>
            )}

            {isEditor && (
              <div className="absolute top-3 right-3">
                <Xbutton
                  onClick={() => {
                    const newPlans = plans.filter(
                      (_: any, idx: number) => idx !== i,
                    );
                    onUpdate("plans", newPlans);
                  }}
                  color={plan.highlighted ? undefined : "red"}
                />
              </div>
            )}

            <div>
              <h4
                className="text-base font-bold uppercase tracking-wider"
                style={
                  plan.highlighted ? {} : { color: "var(--qs-text-muted)" }
                }
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newPlans = [...plans];
                  newPlans[i].name =
                    e.currentTarget.textContent?.trim() || plan.name;
                  onUpdate("plans", newPlans);
                }}
              >
                {plan.name}
              </h4>

              <div className="mt-3 flex items-end gap-1">
                <span
                  className="text-5xl font-extrabold tracking-tight"
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newPlans = [...plans];
                    newPlans[i].price =
                      e.currentTarget.textContent?.trim() || plan.price;
                    onUpdate("plans", newPlans);
                  }}
                >
                  {plan.price}
                </span>
                <span
                  className="mb-1 text-sm"
                  style={
                    plan.highlighted
                      ? { opacity: 0.8 }
                      : { color: "var(--qs-text-muted)" }
                  }
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newPlans = [...plans];
                    newPlans[i].period =
                      e.currentTarget.textContent?.trim() || plan.period;
                    onUpdate("plans", newPlans);
                  }}
                >
                  {plan.period}
                </span>
              </div>

              <p
                className="mt-2 text-sm"
                style={
                  plan.highlighted
                    ? { opacity: 0.85 }
                    : { color: "var(--qs-text-muted)" }
                }
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newPlans = [...plans];
                  newPlans[i].desc =
                    e.currentTarget.textContent?.trim() || plan.desc;
                  onUpdate("plans", newPlans);
                }}
              >
                {plan.desc}
              </p>
            </div>

            <ul className="my-6 flex flex-col gap-3 flex-1">
              {(plan.features || []).map((feat: string, fi: number) => (
                <li key={fi} className="flex items-start gap-2 text-sm">
                  <span
                    className="mt-0.5 shrink-0 text-base"
                    style={
                      plan.highlighted ? {} : { color: "var(--qs-primary)" }
                    }
                  >
                    ✓
                  </span>
                  <span
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newPlans = [...plans];
                      newPlans[i].features[fi] =
                        e.currentTarget.textContent?.trim() || feat;
                      onUpdate("plans", newPlans);
                    }}
                  >
                    {feat}
                  </span>
                  {isEditor && (
                    <Xbutton
                      onClick={() => {
                        const newPlans = [...plans];
                        newPlans[i].features = newPlans[i].features.filter(
                          (_: any, fIdx: number) => fIdx !== fi,
                        );
                        onUpdate("plans", newPlans);
                      }}
                    />
                  )}
                </li>
              ))}
              {isEditor && (
                <AddButton
                  onClick={() => {
                    const newPlans = [...plans];
                    newPlans[i].features = [
                      ...(newPlans[i].features || []),
                      "New feature",
                    ];
                    onUpdate("plans", newPlans);
                  }}
                >
                  Add Feature
                </AddButton>
              )}
            </ul>

            <CtaLink
              isEditor={isEditor}
              label={plan.ctaLabel ?? "Get Started"}
              linkConfig={content?.cta?.primaryButtonLink}
              onLabelChange={(v) => {
                const newPlans = [...plans];
                newPlans[i].ctaLabel = v;
                onUpdate("plans", newPlans);
              }}
              onLinkChange={() => {}}
              className="block w-full rounded-xl px-5 py-3 text-center text-sm font-bold transition-transform hover:scale-[1.02] active:scale-95"
              style={
                plan.highlighted
                  ? {
                      background: "var(--qs-primary-fg)",
                      color: "var(--qs-primary)",
                    }
                  : {
                      background: "var(--qs-primary)",
                      color: "var(--qs-primary-fg)",
                    }
              }
            />
          </div>
        ))}
        {isEditor && (
          <AddButton
            onClick={() => {
              onUpdate("plans", [
                ...plans,
                {
                  name: "Custom",
                  price: "$–",
                  period: "/ month",
                  desc: "Describe this plan.",
                  features: ["Feature one", "Feature two"],
                  ctaLabel: "Contact Us",
                  highlighted: false,
                },
              ]);
            }}
          >
            Add Plan
          </AddButton>
        )}
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const testimonials = content?.testimonials ?? [];

  return (
    <section
      className="py-16 md:py-24"
      style={{ background: "var(--qs-bg-alt)" }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h3
            className="text-3xl font-bold tracking-tight md:text-4xl"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate(
                "testimonialsHeading",
                e.currentTarget.textContent?.trim(),
              )
            }
          >
            {content?.testimonialsHeading ?? "Loved by Builders"}
          </h3>
          <p
            className="mt-4 text-base"
            style={{ color: "var(--qs-text-muted)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate(
                "testimonialsSubheading",
                e.currentTarget.textContent?.trim(),
              )
            }
          >
            {content?.testimonialsSubheading ??
              "Don't take our word for it — hear from our customers."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item: any, i: number) => (
            <blockquote
              key={i}
              className="relative rounded-3xl p-6"
              style={{
                background: "var(--qs-bg)",
                border: "1px solid var(--qs-border)",
              }}
            >
              {isEditor && (
                <div className="absolute top-3 right-3">
                  <Xbutton
                    onClick={() => {
                      const newT = testimonials.filter(
                        (_: any, idx: number) => idx !== i,
                      );
                      onUpdate("testimonials", newT);
                    }}
                    color="red"
                  />
                </div>
              )}

              <div
                className="mb-4 text-3xl leading-none"
                style={{ color: "var(--qs-primary)" }}
              >
                ❝
              </div>

              <p
                className="text-sm leading-7"
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newT = [...testimonials];
                  newT[i].quote =
                    e.currentTarget.textContent?.trim() || item.quote;
                  onUpdate("testimonials", newT);
                }}
              >
                {item.quote}
              </p>

              <footer className="mt-5 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: "var(--qs-primary)",
                    color: "var(--qs-primary-fg)",
                  }}
                >
                  {item.avatar || item.name?.[0] || "?"}
                </div>
                <div>
                  <div
                    className="text-sm font-semibold"
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newT = [...testimonials];
                      newT[i].name =
                        e.currentTarget.textContent?.trim() || item.name;
                      onUpdate("testimonials", newT);
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--qs-text-muted)" }}
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newT = [...testimonials];
                      newT[i].role =
                        e.currentTarget.textContent?.trim() || item.role;
                      onUpdate("testimonials", newT);
                    }}
                  >
                    {item.role}
                  </div>
                </div>
              </footer>
            </blockquote>
          ))}
          {isEditor && (
            <AddButton
              onClick={() => {
                onUpdate("testimonials", [
                  ...testimonials,
                  {
                    quote: "This product is amazing. Highly recommend it.",
                    name: "Jane Doe",
                    role: "CEO, Company",
                    avatar: "J",
                  },
                ]);
              }}
            >
              Add Testimonial
            </AddButton>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQ({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const faqs = content?.faqs ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:py-24" id="faq">
      <div className="mb-12 text-center">
        <h3
          className="text-3xl font-bold tracking-tight md:text-4xl"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("faqHeading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.faqHeading ?? "Frequently Asked Questions"}
        </h3>
        <p
          className="mt-4 text-base"
          style={{ color: "var(--qs-text-muted)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("faqSubheading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.faqSubheading ??
            "Everything you need to know before getting started."}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((faq: any, i: number) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: "var(--qs-bg-alt)",
              border: "1px solid var(--qs-border)",
            }}
          >
            {isEditor && (
              <div className="absolute top-3 right-3 z-10">
                <Xbutton
                  onClick={() => {
                    const newFaqs = faqs.filter(
                      (_: any, idx: number) => idx !== i,
                    );
                    onUpdate("faqs", newFaqs);
                  }}
                  color="red"
                />
              </div>
            )}

            <button
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left font-semibold"
              onClick={() =>
                !isEditor && setOpenIndex(openIndex === i ? null : i)
              }
            >
              <span
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newFaqs = [...faqs];
                  newFaqs[i].question =
                    e.currentTarget.textContent?.trim() || faq.question;
                  onUpdate("faqs", newFaqs);
                }}
              >
                {faq.question}
              </span>
              {!isEditor && (
                <span
                  className="shrink-0 text-xl leading-none transition-transform duration-200"
                  style={{
                    color: "var(--qs-text-muted)",
                    transform:
                      openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              )}
            </button>

            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{
                maxHeight: isEditor || openIndex === i ? "400px" : "0",
              }}
            >
              <p
                className="px-6 pb-5 text-sm leading-7"
                style={{ color: "var(--qs-text-muted)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newFaqs = [...faqs];
                  newFaqs[i].answer =
                    e.currentTarget.textContent?.trim() || faq.answer;
                  onUpdate("faqs", newFaqs);
                }}
              >
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
        {isEditor && (
          <AddButton
            onClick={() => {
              onUpdate("faqs", [
                ...faqs,
                {
                  question: "New question?",
                  answer: "Answer goes here.",
                },
              ]);
            }}
          >
            Add FAQ
          </AddButton>
        )}
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTABanner({ isEditor, content, onUpdate }: TemplateComponentProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-20" id="contact">
      <div
        className="rounded-3xl md:rounded-4xl px-6 py-12 md:px-12 md:py-16 text-center"
        style={{
          background: "var(--qs-primary)",
          color: "var(--qs-primary-fg)",
        }}
      >
        <h3
          className="text-2xl font-bold tracking-tight sm:text-3xl md:text-5xl"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("cta.title", e.currentTarget.textContent?.trim())
          }
        >
          {content?.cta?.title ?? "Ready to Build Something Great?"}
        </h3>

        <p
          className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-base md:text-lg"
          style={{ opacity: 0.9 }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("cta.desc", e.currentTarget.textContent?.trim())
          }
        >
          {content?.cta?.desc ??
            "Join thousands of teams already building with LaunchPad. Start for free — no credit card needed."}
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <CtaLink
            isEditor={isEditor}
            label={content?.cta?.primaryButton ?? "Get Started Free"}
            linkConfig={content?.cta?.primaryButtonLink}
            onLabelChange={(v) => onUpdate("cta.primaryButton", v)}
            onLinkChange={(cfg) => onUpdate("cta.primaryButtonLink", cfg)}
            className="rounded-xl bg-white px-8 py-4 sm:py-3 font-bold text-center transition-transform active:scale-95 sm:hover:scale-[1.02]"
            style={{ color: "var(--qs-primary)" }}
          />

          <CtaLink
            isEditor={isEditor}
            label={content?.cta?.secondaryButton ?? "Talk to Sales"}
            linkConfig={content?.cta?.secondaryButtonLink}
            onLabelChange={(v) => onUpdate("cta.secondaryButton", v)}
            onLinkChange={(cfg) => onUpdate("cta.secondaryButtonLink", cfg)}
            className="rounded-xl px-8 py-4 sm:py-3 font-bold text-center transition-transform active:scale-95 sm:hover:scale-[1.02]"
            style={{
              background: "transparent",
              color: "var(--qs-primary-fg)",
              border: "2px solid var(--qs-primary-fg)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Home (root export) ───────────────────────────────────────────────────────

export default function Home({
  isEditor,
  content,
  onUpdate,
  slugs,
}: TemplateProps) {
  const handleUpdate = (path: string, value: any) => {
    if (onUpdate) onUpdate(path, value);
  };

  return (
    <>
      <Navbar
        isEditor={isEditor}
        content={content}
        onUpdate={handleUpdate}
        slugs={slugs}
      />
      <Hero isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <Logos isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <Features isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <HowItWorks
        isEditor={isEditor}
        content={content}
        onUpdate={handleUpdate}
      />
      <Pricing isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <Testimonials
        isEditor={isEditor}
        content={content}
        onUpdate={handleUpdate}
      />
      <FAQ isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <CTABanner
        isEditor={isEditor}
        content={content}
        onUpdate={handleUpdate}
      />
      <Footer isEditor={isEditor} content={content} onUpdate={handleUpdate} />
    </>
  );
}
