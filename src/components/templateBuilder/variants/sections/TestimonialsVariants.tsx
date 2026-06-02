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

  const cardBg = isEven ? "var(--qs-bg-alt)" : "var(--qs-bg)";

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
        <Container className="py-12 @sm:py-16 @md:py-24">
          <div className="text-center mb-10 @md:mb-14 px-2">
            <h2
              className="text-2xl @sm:text-3xl @md:text-5xl font-black mb-4 @md:mb-5"
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
                className="max-w-xl @md:max-w-2xl mx-auto text-base @sm:text-lg"
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

          <div className="grid gap-5 @sm:gap-7 @md:grid-cols-2">
            {items.map((item, i) => (
              <div
                key={i}
                className="group relative rounded-2xl @md:rounded-[30px] border p-4 @sm:p-6 @md:p-8 transition-all duration-300 hover:-translate-y-1 @md:hover:-translate-y-2 hover:shadow-lg @md:hover:shadow-2xl"
                style={{
                  background: cardBg,
                  border: "1px solid var(--qs-border)",
                  backdropFilter: "blur(10px)",
                }}
              >
                {isEditor && (
                  <div className="absolute top-3 right-3 @md:top-4 @md:right-4 z-20">
                    <Xbutton onClick={() => handleDelete(i)} color="red" />
                  </div>
                )}

                {/* Decorative quote mark, never gets into the quote's value */}
                <div
                  className="text-4xl @md:text-6xl leading-none mb-4 @md:mb-5 opacity-30"
                  style={{ color: "var(--qs-primary)" }}
                  aria-hidden="true"
                >
                  &rdquo;
                </div>

                <p
                  className="text-base @sm:text-lg leading-relaxed mb-6 @md:mb-8"
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

                <div className="flex items-center gap-3 @md:gap-4">
                  <div
                    className="h-10 w-10 @md:h-12 @md:w-12 rounded-full flex items-center justify-center text-base @md:text-sm font-bold shrink-0"
                    style={{
                      background: "var(--qs-primary)",
                      color: "var(--qs-primary-fg)",
                    }}
                  >
                    {item.name?.charAt(0) || "A"}
                  </div>

                  <div>
                    <div
                      className="font-bold text-sm @md:text-base"
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
                      className="text-xs @md:text-sm"
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
            <div className="mt-8 @md:mt-10 flex justify-center">
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
        <Container className="py-16 @md:py-24 px-0">
          <div className="text-center mb-8 @md:mb-14 px-4">
            <h2
              className="text-2xl @sm:text-3xl @md:text-5xl font-black mb-3 @md:mb-5"
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
          <div
            className="flex gap-4 @sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 @md:pb-4 custom-scrollbar px-2 @sm:px-4"
            style={{
              scrollbarColor: "var(--qs-primary) var(--qs-bg-alt)", // fallback for browsers that support it
              scrollbarWidth: "thin", // fallback for Firefox
            }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="relative min-w-[85vw] max-w-[90vw] @sm:min-w-[340px] @sm:max-w-[420px] @md:min-w-[420px] snap-center rounded-2xl @md:rounded-[32px] border p-4 @sm:p-8 flex flex-col justify-between transition-all duration-300"
                style={{
                  background: cardBg,
                  border: "1px solid var(--qs-border)",
                }}
              >
                {isEditor && (
                  <div className="absolute top-2 right-2 @sm:top-4 @sm:right-4">
                    <Xbutton onClick={() => handleDelete(i)} color="red" />
                  </div>
                )}

                {/* Decorative quote mark, never gets into the quote's value */}
                <div
                  className="text-3xl @sm:text-5xl mb-4 @sm:mb-6 opacity-30"
                  style={{ color: "var(--qs-primary)" }}
                  aria-hidden="true"
                >
                  &rdquo;
                </div>

                <p
                  className="text-base @sm:text-xl leading-relaxed mb-6 @sm:mb-10"
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

                <div className="flex flex-col @sm:flex-row @sm:items-center justify-between gap-2 @sm:gap-4">
                  <div>
                    <div
                      className="font-bold text-base @sm:text-lg"
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
                    className="text-xs @sm:text-sm tracking-widest mt-2 @sm:mt-0"
                    style={{ color: "var(--qs-primary)" }}
                  >
                    ★★★★★
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isEditor && (
            <div className="mt-6 @md:mt-10 flex justify-center px-2">
              <AddButton onClick={handleAdd}>Add Testimonial</AddButton>
            </div>
          )}
        </Container>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // MINIMAL VARIANT (Mobile Friendly)
  // ─────────────────────────────────────────────

  // Minimal Variant: "List" style but with Card Appearance

  return (
    <section style={{ background: sectionBg }} id={anchorName}>
      <Container className="py-10 sm:py-14 md:py-24">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 px-2">
          <h2
            className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 tracking-tight"
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
            className="mx-auto mt-2 w-10 md:w-12 h-1 rounded-full"
            style={{ background: "var(--qs-primary)" }}
          />
        </div>

        <div className="flex flex-col items-stretch gap-5 sm:gap-7 md:gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="relative rounded-xl md:rounded-2xl shadow-sm md:shadow-md px-3 sm:px-5 py-5 sm:py-6 flex flex-col md:flex-row items-center gap-2 sm:gap-3 border border-solid background-(--qs-card-bg) transition-all duration-200"
              style={{
                borderColor: "var(--qs-border, #e5e7eb)",
                background: "var(--qs-card-bg, #fff)",
              }}
            >
              {isEditor && (
                <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
                  <Xbutton onClick={() => handleDelete(i)} color="red" />
                </div>
              )}

              <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-3 sm:gap-4">
                <div className="shrink-0 text-3xl sm:text-4xl md:mr-5 mb-1 md:mb-0 text-center md:text-left">
                  <span
                    role="img"
                    aria-label="testimonial emoji"
                    style={{ opacity: 0.7 }}
                  >
                    💬
                  </span>
                </div>

                <div className="flex-1 flex flex-col items-center md:items-start">
                  {/* Remove decorative quotes from the value */}
                  <p
                    className="text-base sm:text-lg md:text-xl italic leading-relaxed text-center md:text-left"
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

                  <div className="mt-5 sm:mt-6 flex flex-col items-center md:items-start">
                    <div
                      className="font-semibold text-sm sm:text-base md:text-lg"
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
                      className="text-xs sm:text-sm mt-0.5"
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
                    <div className="mt-2 text-yellow-400 text-sm sm:text-base md:text-lg">
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
          <div className="mt-9 md:mt-14 flex justify-center">
            <AddButton onClick={handleAdd}>Add Testimonial</AddButton>
          </div>
        )}
      </Container>
    </section>
  );
};
