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
  ctaLink?: any;
  featured?: boolean;
};

export const PricingSection = ({
  content,
  isEditor,
  onUpdate,
  variant,
  position,
  anchorName,
  path
}: SectionProps) => {
  const plans: PricingPlan[] = content?.plans || [];

  const isEven = position % 2 === 0;

  const sectionBg = isEven ? "var(--qs-bg)" : "var(--qs-bg-alt)";
  const cardBg = isEven ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)";

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
        ? { ...plan, featured: true }
        : { ...plan, featured: false },
    );
    onUpdate("plans", nextPlans);
  };

  // ─────────────────────────────────────────────
  // HEADER
  // ─────────────────────────────────────────────

  const Header = () => (
    <div className="text-center mb-14">
      <h2
        className="text-4xl @md:text-5xl font-black tracking-tight"
        style={{ color: "var(--qs-text)" }}
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate("heading", e.currentTarget.textContent?.trim())}
      >
        {content.heading ?? "Pricing Plans"}
      </h2>

      <p
        className="mt-5 max-w-2xl mx-auto text-lg leading-relaxed"
        style={{ color: "var(--qs-text-muted)" }}
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
    const anyFeatured = plans.some((plan) => plan.featured);

    return (
      <section
        className="py-24"
        style={{ background: sectionBg }}
        id={anchorName}
      >
        <Container>
          <Header />

          <div className="grid gap-8 @md:grid-cols-3">
            {plans.map((plan, i) => {
              const featured = anyFeatured ? !!plan.featured : i === 1;

              return (
                <div
                  key={i}
                  className={`relative rounded-[32px] border p-8 transition-all duration-300 hover:-translate-y-2 ${
                    featured ? "scale-[1.03]" : ""
                  }`}
                  style={{
                    background: featured ? "var(--qs-primary)" : cardBg,
                    color: featured ? "var(--qs-primary-fg)" : "var(--qs-text)",
                    border: featured
                      ? "1px solid transparent"
                      : "1px solid var(--qs-border)",
                  }}
                >
                  {/* Editor Controls */}
                  {isEditor && (
                    <div className="absolute top-4 right-4 z-20 flex gap-1">
                      <Xbutton onClick={() => handleDelete(i)} color="red" />
                      <button
                        type="button"
                        className="ml-2 px-2 py-1 text-xs rounded font-bold border-2"
                        style={{ marginTop: -2, marginLeft: 8 }}
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
                            className="ml-2 text-red-600 opacity-70 hover:opacity-100"
                            style={{ marginTop: -2 }}
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
                      label={plan.cta ?? "Choose Plan"}
                      linkConfig={plan.ctaLink}
                      onLabelChange={(v) => onUpdate(`plans.${i}.cta`, v)}
                      onLinkChange={(cfg) =>
                        onUpdate(`plans.${i}.ctaLink`, cfg)
                      }
                      className="w-full rounded-2xl px-6 py-4 text-center font-bold"
                      style={{
                        background: featured ? "#fff" : "var(--qs-primary)",
                        color: featured ? "#000" : "var(--qs-primary-fg)",
                      }}
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
  // COMPACT VARIANT
  // ─────────────────────────────────────────────

  if (variant === "compact") {
    const anyFeatured = plans.some((plan) => plan.featured);

    return (
      <section
        className="py-20"
        style={{ background: sectionBg }}
        id={anchorName}
      >
        <Container>
          <Header />

          <div className="grid gap-5 @md:grid-cols-3">
            {plans.map((plan, i) => {
              const featured = anyFeatured ? !!plan.featured : i === 1;

              return (
                <div
                  key={i}
                  className={`relative rounded-[28px] border p-6 ${
                    featured ? "ring-2 ring-primary/20" : ""
                  }`}
                  style={{
                    background: cardBg,
                    border: "1px solid var(--qs-border)",
                  }}
                >
                  {/* Editor Controls */}
                  {isEditor && (
                    <div className="absolute top-4 right-4 flex gap-1">
                      <Xbutton onClick={() => handleDelete(i)} color="red" />
                      <button
                        type="button"
                        className={`ml-2 px-2 py-1 text-xs rounded font-bold ${
                          featured
                            ? "bg-white/40 text-black/90 border border-white/60"
                            : "bg-white/20 text-white border border-white/20 hover:bg-white/30 hover:border-white/60"
                        }`}
                        onClick={() => handleSetFeatured(i)}
                        disabled={featured}
                      >
                        {featured ? "Most Popular" : "Set Most Popular"}
                      </button>
                    </div>
                  )}

                  {featured && (
                    <div className="mb-4 inline-flex rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}

                  <h3
                    className="text-xl font-bold"
                    style={{ color: "var(--qs-text)" }}
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
                    className="mt-3 text-3xl font-black"
                    style={{ color: "var(--qs-primary)" }}
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

                  <ul className="mt-6 space-y-2">
                    {(plan.features || []).map((feature, j) => (
                      <li
                        key={j}
                        className="text-sm flex items-center group"
                        style={{ color: "var(--qs-text-muted)" }}
                      >
                        •{" "}
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

                  <div className="mt-8">
                    <EditableLinkButton
                      isEditor={isEditor}
                      label={plan.cta ?? "Choose"}
                      linkConfig={plan.ctaLink}
                      onLabelChange={(v) => onUpdate(`plans.${i}.cta`, v)}
                      onLinkChange={(cfg) =>
                        onUpdate(`plans.${i}.ctaLink`, cfg)
                      }
                      className="w-full rounded-xl px-5 py-3 text-center font-bold"
                      style={{
                        background: "var(--qs-primary)",
                        color: "var(--qs-primary-fg)",
                      }}
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
    <section
      className="py-24"
      style={{ background: sectionBg }}
      id={anchorName}
    >
      <Container>
        <Header />

        <div className="grid gap-8 @md:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={i}
              className="relative rounded-[32px] border p-8 text-center transition-all duration-300 hover:-translate-y-2"
              style={{
                background: cardBg,
                border: "1px solid var(--qs-border)",
              }}
            >
              <h3
                className="text-2xl font-black"
                style={{ color: "var(--qs-text)" }}
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
                style={{ color: "var(--qs-primary)" }}
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
                className="mt-5 leading-relaxed"
                style={{ color: "var(--qs-text-muted)" }}
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
                    className="text-sm flex items-center group"
                    style={{ color: "var(--qs-text-muted)" }}
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
                  label={plan.cta ?? "Choose Plan"}
                  linkConfig={plan.ctaLink}
                  onLabelChange={(v) => onUpdate(`plans.${i}.cta`, v)}
                  onLinkChange={(cfg) => onUpdate(`plans.${i}.ctaLink`, cfg)}
                  className="w-full rounded-2xl px-6 py-4 text-center font-bold"
                  style={{
                    background: "var(--qs-primary)",
                    color: "var(--qs-primary-fg)",
                  }}
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
