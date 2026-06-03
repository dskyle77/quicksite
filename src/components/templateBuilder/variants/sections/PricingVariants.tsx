/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { SectionProps } from "../../types";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";
import EditableLinkButton from "@/components/shared/EditableLink";
import Container from "@/components/shared/Container";

type PricingPlan = {
  name: string;
  price: string;
  desc?: string;
  features?: string[];
  cta?: string;
  ctaLabel?: string;
  ctaLink?: any;
  featured?: boolean;
  highlighted?: boolean;
};

export const PricingSection = ({
  content,
  isEditor,
  onUpdate,
  variant,
  position,
  anchorName,
}: SectionProps) => {
  const plans: PricingPlan[] = content?.plans || [];

  const isEven = position % 2 === 0;

  const sectionBgClass = isEven ? "bg-[var(--qs-bg)]" : "bg-[var(--qs-bg-alt)]";
  const cardBgClass = isEven ? "bg-white/[0.03]" : "bg-white/[0.05]";

  // ─────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────

  const handleAdd = () => {
    onUpdate("plans", [
      ...plans,
      {
        name: "Starter",
        price: "$99",
        desc: "Perfect for small projects.",
        features: ["Feature One", "Feature Two", "Feature Three"],
        cta: "Get Started",
      },
    ]);
  };

  const handleDelete = (idx: number) => {
    const next = [...plans];
    next.splice(idx, 1);
    onUpdate("plans", next);
  };

  const handleAddFeature = (planIdx: number) => {
    const nextPlans = [...plans];
    const plan = { ...nextPlans[planIdx] };
    plan.features = Array.isArray(plan.features) ? [...plan.features] : [];
    plan.features.push("New Feature");
    nextPlans[planIdx] = plan;
    onUpdate("plans", nextPlans);
  };

  const handleDeleteFeature = (planIdx: number, featureIdx: number) => {
    const nextPlans = [...plans];
    const plan = { ...nextPlans[planIdx] };
    plan.features = Array.isArray(plan.features) ? [...plan.features] : [];
    plan.features.splice(featureIdx, 1);
    nextPlans[planIdx] = plan;
    onUpdate("plans", nextPlans);
  };

  const handleSetFeatured = (planIdx: number) => {
    const nextPlans = plans.map((plan, i) =>
      i === planIdx
        ? { ...plan, featured: true, highlighted: true }
        : { ...plan, featured: false, highlighted: false },
    );
    onUpdate("plans", nextPlans);
  };

  // ─────────────────────────────────────────────
  // HEADER
  // ─────────────────────────────────────────────

  const Header = () => (
    <div className="text-center mb-14">
      <h2
        className="text-4xl @md:text-5xl font-black tracking-tight text-(--qs-text)"
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate("heading", e.currentTarget.textContent?.trim())}
      >
        {content.heading ?? "Pricing Plans"}
      </h2>

      <p
        className="mt-5 max-w-2xl mx-auto text-lg leading-relaxed text-(--qs-text-muted)"
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) =>
          onUpdate("subheading", e.currentTarget.textContent?.trim())
        }
      >
        {content.subheading ?? "Choose the perfect plan for your needs."}
      </p>
    </div>
  );

  // ─────────────────────────────────────────────
  // HIGHLIGHT TOP VARIANT
  // ─────────────────────────────────────────────

    if (variant === "highlight-top") {
      const anyFeatured = plans.some((plan) => plan.featured ?? plan.highlighted);

      return (
        <section className={`py-24 ${sectionBgClass}`} id={anchorName}>
          <Container>
            <Header />

            <div className="grid gap-8 grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 justify-center">

              {plans.map((plan, i) => {
                const featured = anyFeatured ? !!(plan.featured ?? plan.highlighted) : i === 1;

                return (
                  <div
                    key={i}
                    className={`relative rounded-[32px] border transition-all duration-300 hover:-translate-y-2 p-8 ${
                      featured
                        ? "scale-[1.03] bg-(--qs-primary) text-(--qs-primary-fg) border-transparent"
                        : `${cardBgClass} text-(--qs-text) border-(--qs-border)`
                    }`}
                  >
                    {/* Editor Controls */}
                    {isEditor && (
                      <div className="absolute top-4 right-4 z-20 flex gap-1 items-center">
                        <Xbutton onClick={() => handleDelete(i)} color="red" />
                        <button
                          type="button"
                          className="ml-2 -mt-0.5 px-2 py-1 text-xs rounded font-bold border-2"
                          title="Mark as Most Popular"
                          onClick={() => handleSetFeatured(i)}
                          disabled={featured}
                        >
                          {featured ? "Most Popular" : "Set Most Popular"}
                        </button>
                      </div>
                    )}

                    {featured && (
                      <div className="mb-5 inline-flex rounded-full bg-white/20 px-4 py-1 text-xs font-bold uppercase tracking-wider">
                        Most Popular
                      </div>
                    )}

                    <h3
                      className="text-2xl font-black"
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdate(
                          `plans.${i}.name`,
                          e.currentTarget.textContent?.trim(),
                        )
                      }
                    >
                      {plan.name}
                    </h3>

                    <div
                      className="mt-5 text-5xl font-black"
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdate(
                          `plans.${i}.price`,
                          e.currentTarget.textContent?.trim(),
                        )
                      }
                    >
                      {plan.price}
                    </div>

                    <p
                      className="mt-5 leading-relaxed opacity-80"
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdate(
                          `plans.${i}.desc`,
                          e.currentTarget.textContent?.trim(),
                        )
                      }
                    >
                      {plan.desc}
                    </p>

                    <ul className="mt-8 space-y-3">
                      {(plan.features || []).map((feature, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-3 text-sm group"
                        >
                          <span>✓</span>
                          <span
                            contentEditable={isEditor}
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              onUpdate(
                                `plans.${i}.features.${j}`,
                                e.currentTarget.textContent?.trim(),
                              )
                            }
                          >
                            {feature}
                          </span>
                          {isEditor && (
                            <button
                              type="button"
                              className="ml-2 -mt-0.5 text-red-600 opacity-70 hover:opacity-100"
                              onClick={() => handleDeleteFeature(i, j)}
                            >
                              ✕
                            </button>
                          )}
                        </li>
                      ))}

                      {isEditor && (
                        <li>
                          <button
                            type="button"
                            className="text-xs px-2 py-1 rounded bg-white/10 border border-dashed border-white/30 hover:bg-white/20 hover:border-white/50"
                            onClick={() => handleAddFeature(i)}
                          >
                            + Add feature
                          </button>
                        </li>
                      )}
                    </ul>

                    <div className="mt-10">
                      <EditableLinkButton
                        isEditor={isEditor}
                        label={plan.ctaLabel ?? plan.cta ?? "Choose Plan"}
                        linkConfig={plan.ctaLink}
                        onLabelChange={(v) => onUpdate(`plans.${i}.ctaLabel`, v)}
                        onLinkChange={(cfg) =>
                          onUpdate(`plans.${i}.ctaLink`, cfg)
                        }
                        className={`w-full rounded-2xl px-6 py-4 text-center font-bold ${
                          featured
                            ? "bg-white text-black shadow-lg"
                            : "bg-(--qs-primary) text-(--qs-primary-fg)"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {isEditor && (
              <div className="mt-10 flex justify-center">
                <AddButton onClick={handleAdd}>Add Pricing Plan</AddButton>
              </div>
            )}
          </Container>
        </section>
      );
    }

    // ─────────────────────────────────────────────
    // DEFAULT VARIANT
    // ─────────────────────────────────────────────

    return (
      <section className={`py-24 ${sectionBgClass}`} id={anchorName}>
        <Container>
          <Header />

          <div className="grid gap-8 grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 justify-center">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-[32px] border p-8 text-center transition-all duration-300 hover:-translate-y-2 ${cardBgClass} border-(--qs-border)`}
              >
                <h3
                  className="text-2xl font-black text-(--qs-text)"
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdate(
                      `plans.${i}.name`,
                      e.currentTarget.textContent?.trim(),
                    )
                  }
                >
                  {plan.name}
                </h3>

                <div
                  className="mt-5 text-5xl font-black text-(--qs-primary)"
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdate(
                      `plans.${i}.price`,
                      e.currentTarget.textContent?.trim(),
                    )
                  }
                >
                  {plan.price}
                </div>

                <p
                  className="mt-5 leading-relaxed text-(--qs-text-muted)"
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdate(
                      `plans.${i}.desc`,
                      e.currentTarget.textContent?.trim(),
                    )
                  }
                >
                  {plan.desc}
                </p>

                <ul className="mt-8 space-y-3">
                  {(plan.features || []).map((feature, j) => (
                    <li
                      key={j}
                      className="text-sm flex items-center group text-(--qs-text-muted)"
                    >
                      ✓{" "}
                      <span
                        contentEditable={isEditor}
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          onUpdate(
                            `plans.${i}.features.${j}`,
                            e.currentTarget.textContent?.trim(),
                          )
                        }
                      >
                        {feature}
                      </span>
                      {isEditor && (
                        <button
                          type="button"
                          className="ml-2 text-red-600 opacity-70 hover:opacity-100"
                          onClick={() => handleDeleteFeature(i, j)}
                        >
                          ✕
                        </button>
                      )}
                    </li>
                  ))}

                  {isEditor && (
                    <li>
                      <button
                        type="button"
                        className="text-xs px-2 py-1 rounded bg-white/10 border border-dashed border-white/30 hover:bg-white/20 hover:border-white/50"
                        onClick={() => handleAddFeature(i)}
                      >
                        + Add feature
                      </button>
                    </li>
                  )}
                </ul>

                <div className="mt-10">
                  <EditableLinkButton
                    isEditor={isEditor}
                    label={plan.ctaLabel ?? plan.cta ?? "Choose Plan"}
                    linkConfig={plan.ctaLink}
                    onLabelChange={(v) => onUpdate(`plans.${i}.ctaLabel`, v)}
                    onLinkChange={(cfg) => onUpdate(`plans.${i}.ctaLink`, cfg)}
                    className="w-full rounded-2xl px-6 py-4 text-center font-bold bg-(--qs-primary) text-(--qs-primary-fg)"
                  />
                </div>
              </div>
            ))}
          </div>

          {isEditor && (
            <div className="mt-10 flex justify-center">
              <AddButton onClick={handleAdd}>Add Pricing Plan</AddButton>
            </div>
          )}
        </Container>
      </section>
    );
  };

  export type PricingSectionVariants = "highlight-top" | "default";
  export const PricingVariantList: PricingSectionVariants[] = [
    "highlight-top",
    "default",
  ];
