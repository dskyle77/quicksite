import { SectionProps } from "../../types";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";
import Container from "@/components/shared/Container";
type Testimonial = {
  quote: string;
  name: string;
  role?: string;
};

export const TestimonialsSection = ({
  variant,
  isEditor,
  content,
  onUpdate,
  position,
  anchorName,
}: SectionProps) => {
  const items: Testimonial[] = content?.items ?? [];

  const isEven = position % 2 === 0;

  const sectionBg = isEven ? "var(--qs-bg)" : "var(--qs-bg-alt)";

  const cardBg = isEven ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)";

  const handleAdd = () => {
    onUpdate("items", [
      ...items,
      {
        quote: "Amazing experience working together.",
        name: "Client Name",
        role: "Business Owner",
      },
    ]);
  };

  const handleDelete = (idx: number) => {
    const next = [...items];
    next.splice(idx, 1);
    onUpdate("items", next);
  };

  // ─────────────────────────────────────────────
  // GRID VARIANT
  // ─────────────────────────────────────────────

  if (variant === "grid") {
    return (
      <section style={{ background: sectionBg }} id={anchorName}>
        <Container className="py-24">
          <div className="text-center mb-14">
            <h2
              className="text-4xl @md:text-5xl font-black mb-5"
              style={{ color: "var(--qs-text)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("heading", e.currentTarget.textContent?.trim())
              }
            >
              {content?.heading ?? "What People Say"}
            </h2>

            {content?.subheading && (
              <p
                className="max-w-2xl mx-auto text-lg"
                style={{ color: "var(--qs-text-muted)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("subheading", e.currentTarget.textContent?.trim())
                }
              >
                {content?.subheading}
              </p>
            )}
          </div>

          <div className="grid gap-7 @md:grid-cols-2">
            {items.map((item, i) => (
              <div
                key={i}
                className="group relative rounded-[30px] border p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  background: cardBg,
                  border: "1px solid var(--qs-border)",
                  backdropFilter: "blur(14px)",
                }}
              >
                {isEditor && (
                  <div className="absolute top-4 right-4 z-20">
                    <Xbutton onClick={() => handleDelete(i)} color="red" />
                  </div>
                )}

                {/* Decorative quote mark, never gets into the quote's value */}
                <div
                  className="text-6xl leading-none mb-5 opacity-30"
                  style={{ color: "var(--qs-primary)" }}
                  aria-hidden="true"
                >
                  &rdquo;
                </div>

                <p
                  className="text-lg leading-relaxed mb-8"
                  style={{ color: "var(--qs-text)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdate(
                      `items.${i}.quote`,
                      e.currentTarget.textContent?.trim(),
                    )
                  }
                >
                  {item.quote}
                </p>

                <div className="flex items-center gap-4">
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{
                      background: "var(--qs-primary)",
                      color: "var(--qs-primary-fg)",
                    }}
                  >
                    {item.name?.charAt(0) || "A"}
                  </div>

                  <div>
                    <div
                      className="font-bold"
                      style={{ color: "var(--qs-text)" }}
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdate(
                          `items.${i}.name`,
                          e.currentTarget.textContent?.trim(),
                        )
                      }
                    >
                      {item.name}
                    </div>

                    <div
                      className="text-sm"
                      style={{ color: "var(--qs-text-muted)" }}
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdate(
                          `items.${i}.role`,
                          e.currentTarget.textContent?.trim(),
                        )
                      }
                    >
                      {item.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isEditor && (
            <div className="mt-10 flex justify-center">
              <AddButton onClick={handleAdd}>Add Testimonial</AddButton>
            </div>
          )}
        </Container>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // CAROUSEL VARIANT
  // ─────────────────────────────────────────────

  if (variant === "carousel") {
    return (
      <section
        className="overflow-hidden"
        style={{ background: sectionBg }}
        id={anchorName}
      >
        <Container className="py-24">
          <div className="text-center mb-14">
            <h2
              className="text-4xl @md:text-5xl font-black mb-5"
              style={{ color: "var(--qs-text)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("heading", e.currentTarget.textContent?.trim())
              }
            >
              {content?.heading ?? "Loved By Clients"}
            </h2>
          </div>

          {/* 
            To change the scrollbar, add custom Tailwind or CSS classes to this div. 
            Example below uses custom scroll style classes.
          */}
          <div
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 custom-scrollbar"
            style={{
              scrollbarColor: "var(--qs-primary) var(--qs-bg-alt)", // fallback for browsers that support it
              scrollbarWidth: "thin", // fallback for Firefox
            }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="relative min-w-[340px] @md:min-w-[420px] snap-center rounded-[32px] border p-8 transition-all duration-300"
                style={{
                  background: cardBg,
                  border: "1px solid var(--qs-border)",
                }}
              >
                {isEditor && (
                  <div className="absolute top-4 right-4">
                    <Xbutton onClick={() => handleDelete(i)} color="red" />
                  </div>
                )}

                {/* Decorative quote mark, never gets into the quote's value */}
                <div
                  className="text-5xl mb-6 opacity-30"
                  style={{ color: "var(--qs-primary)" }}
                  aria-hidden="true"
                >
                  &rdquo;
                </div>

                <p
                  className="text-xl leading-relaxed mb-10"
                  style={{ color: "var(--qs-text)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdate(
                      `items.${i}.quote`,
                      e.currentTarget.textContent?.trim(),
                    )
                  }
                >
                  {item.quote}
                </p>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div
                      className="font-bold text-lg"
                      style={{ color: "var(--qs-text)" }}
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdate(
                          `items.${i}.name`,
                          e.currentTarget.textContent?.trim(),
                        )
                      }
                    >
                      {item.name}
                    </div>

                    <div
                      className="text-sm mt-1"
                      style={{ color: "var(--qs-text-muted)" }}
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdate(
                          `items.${i}.role`,
                          e.currentTarget.textContent?.trim(),
                        )
                      }
                    >
                      {item.role}
                    </div>
                  </div>

                  <div
                    className="text-sm tracking-widest"
                    style={{ color: "var(--qs-primary)" }}
                  >
                    ★★★★★
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isEditor && (
            <div className="mt-10 flex justify-center">
              <AddButton onClick={handleAdd}>Add Testimonial</AddButton>
            </div>
          )}
        </Container>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // MINIMAL VARIANT
  // ─────────────────────────────────────────────

  // Minimal Variant: "List" style but with Card Appearance

  return (
    <section style={{ background: sectionBg }} id={anchorName}>
      <Container className="py-24 @md:py-32">
        <div className="text-center mb-12">
          <h2
            className="text-3xl @md:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: "var(--qs-primary)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("heading", e.currentTarget.textContent?.trim())
            }
          >
            {content?.heading ?? "Client Feedback"}
          </h2>
          <div
            className="mx-auto mt-2 w-12 h-1 rounded-full"
            style={{ background: "var(--qs-primary)" }}
          />
        </div>

        <div className="flex flex-col items-stretch gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="relative rounded-2xl shadow-md px-5 py-6 flex flex-col @md:flex-row items-center gap-3 border border-solid background-(--qs-card-bg)"
              style={{
                borderColor: "var(--qs-border, #e5e7eb)",
              }}
            >
              {isEditor && (
                <div className="absolute top-3 right-3 z-10">
                  <Xbutton onClick={() => handleDelete(i)} color="red" />
                </div>
              )}

              <div className="w-full flex flex-col @md:flex-row items-center @md:items-start gap-4">
                <div className="shrink-0 text-4xl @md:mr-5 mb-2 @md:mb-0 text-center @md:text-left">
                  <span
                    role="img"
                    aria-label="testimonial emoji"
                    style={{ opacity: 0.7 }}
                  >
                    💬
                  </span>
                </div>

                <div className="flex-1 flex flex-col items-center @md:items-start">
                  {/* Remove decorative quotes from the value */}
                  <p
                    className="text-lg @md:text-xl italic leading-relaxed text-center @md:text-left"
                    style={{ color: "var(--qs-text)" }}
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdate(
                        `items.${i}.quote`,
                        e.currentTarget.textContent?.trim(),
                      )
                    }
                  >
                    {item.quote}
                  </p>

                  <div className="mt-6 flex flex-col items-center @md:items-start">
                    <div
                      className="font-semibold text-base @md:text-lg"
                      style={{ color: "var(--qs-primary)" }}
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdate(
                          `items.${i}.name`,
                          e.currentTarget.textContent?.trim(),
                        )
                      }
                    >
                      {item.name}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: "var(--qs-text-muted)" }}
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdate(
                          `items.${i}.role`,
                          e.currentTarget.textContent?.trim(),
                        )
                      }
                    >
                      {item.role}
                    </div>
                    <div className="mt-2 text-yellow-400 text-base @md:text-lg">
                      <span aria-label="Rated 5 Stars" title="Rated 5 Stars">
                        ★★★★★
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isEditor && (
          <div className="mt-14 flex justify-center">
            <AddButton onClick={handleAdd}>Add Testimonial</AddButton>
          </div>
        )}
      </Container>
    </section>
  );
};
