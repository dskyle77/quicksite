/* eslint-disable @typescript-eslint/no-explicit-any */

import { SectionProps } from "../../types";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";

type FeatureItem = {
  title: string;
  desc: string;
};

export const FeaturesSection = ({
  content,
  isEditor,
  onUpdate,
  variant,
  position,
}: SectionProps) => {
  const items: FeatureItem[] = content?.items ?? [];

  const isEven = position % 2 === 0;
  const sectionBg = isEven
    ? "var(--qs-bg)"
    : "var(--qs-bg-alt)";


  const handleDelete = (idx: number) => {
    const next = [...items];
    next.splice(idx, 1);
    onUpdate("items", next);
  };

  const handleAdd = () => {
    onUpdate("items", [
      ...items,
      {
        title: "New Feature",
        desc: "Feature description goes here.",
      },
    ]);
  };

  // ─────────────────────────────────────────────
  // LIST VARIANT
  // ─────────────────────────────────────────────

  if (variant === "list") {
    return (
      <section
        id="features"
        className="py-24"
        style={{ background: sectionBg }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <h2
            className="text-4xl md:text-5xl font-black text-center mb-5"
            style={{ color: "var(--qs-text)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("heading", e.currentTarget.textContent?.trim())
            }
          >
            {content?.heading ?? "Features"}
          </h2>

          {content?.subheading && (
            <p
              className="text-center max-w-2xl mx-auto mb-14 text-lg leading-relaxed"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate(
                  "subheading",
                  e.currentTarget.textContent?.trim(),
                )
              }
            >
              {content.subheading}
            </p>
          )}

          <div className="space-y-6">
            {items.map((feature, i) => (
              <div
                key={i}
                className="relative rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl bg-(--qs-card)"
                style={{
                  border: "1px solid var(--qs-border)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {isEditor && (
                  <div className="absolute top-4 right-4">
                    <Xbutton onClick={() => handleDelete(i)} color="red" />
                  </div>
                )}

                <div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: "var(--qs-text)" }}
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdate(
                        `items.${i}.title`,
                        e.currentTarget.textContent?.trim(),
                      )
                    }
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="leading-relaxed"
                    style={{ color: "var(--qs-text-muted)" }}
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdate(
                        `items.${i}.desc`,
                        e.currentTarget.textContent?.trim(),
                      )
                    }
                  >
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {isEditor && (
            <div className="mt-10 flex justify-center">
              <AddButton onClick={handleAdd}>Add Feature</AddButton>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // ICONS VARIANT
  // ─────────────────────────────────────────────

  if (variant === "icons") {
    return (
      <section
        id="features"
        className="py-24"
        style={{ background: sectionBg }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2
            className="text-4xl md:text-5xl font-black text-center mb-5"
            style={{ color: "var(--qs-text)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("heading", e.currentTarget.textContent?.trim())
            }
          >
            {content?.heading ?? "Key Features"}
          </h2>

          {content?.subheading && (
            <p
              className="text-center max-w-2xl mx-auto mb-16 text-lg"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate(
                  "subheading",
                  e.currentTarget.textContent?.trim(),
                )
              }
            >
              {content.subheading}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {items.map((feature, i) => (
              <div
                key={i}
                className="relative rounded-3xl border p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-(--qs-card)"
                style={{
                  border: "1px solid var(--qs-border)",
                }}
              >
                {isEditor && (
                  <div className="absolute top-3 right-3">
                    <Xbutton onClick={() => handleDelete(i)} color="red" />
                  </div>
                )}

                <h3
                  className="font-bold text-lg mb-3"
                  style={{ color: "var(--qs-text)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdate(
                      `items.${i}.title`,
                      e.currentTarget.textContent?.trim(),
                    )
                  }
                >
                  {feature.title}
                </h3>

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--qs-text-muted)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdate(
                      `items.${i}.desc`,
                      e.currentTarget.textContent?.trim(),
                    )
                  }
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {isEditor && (
            <div className="mt-10 flex justify-center">
              <AddButton onClick={handleAdd}>Add Feature</AddButton>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // DEFAULT GRID
  // ─────────────────────────────────────────────

  return (
    <section id="features" className="py-28" style={{ background: sectionBg }}>
      <div className="max-w-7xl mx-auto px-4">
        <h2
          className="text-5xl md:text-6xl font-black text-center mb-5"
          style={{ color: "var(--qs-text)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("heading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.heading ?? "Features"}
        </h2>

        {content?.subheading && (
          <p
            className="max-w-3xl mx-auto text-center text-lg leading-relaxed mb-16"
            style={{ color: "var(--qs-text-muted)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate(
                "subheading",
                e.currentTarget.textContent?.trim(),
              )
            }
          >
            {content.subheading}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-[28px] border p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl bg-(--qs-card)"
              style={{
                border: "1px solid var(--qs-border)",
                backdropFilter: "blur(14px)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background:
                    "radial-gradient(circle at top right, var(--qs-primary)10, transparent 45%)",
                }}
              />

              {isEditor && (
                <div className="absolute top-4 right-4 z-20">
                  <Xbutton onClick={() => handleDelete(i)} color="red" />
                </div>
              )}

              <div className="relative z-10">
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: "var(--qs-text)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdate(
                      `items.${i}.title`,
                      e.currentTarget.textContent?.trim(),
                    )
                  }
                >
                  {item.title}
                </h3>

                <p
                  className="leading-relaxed"
                  style={{ color: "var(--qs-text-muted)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdate(
                      `items.${i}.desc`,
                      e.currentTarget.textContent?.trim(),
                    )
                  }
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {isEditor && (
          <div className="mt-12 flex justify-center">
            <AddButton onClick={handleAdd}>Add Feature</AddButton>
          </div>
        )}
      </div>
    </section>
  );
};
