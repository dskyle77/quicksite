import { SectionProps } from "../../types";
import TemplateImage from "@/components/shared/TemplateImage";
import Container from "@/components/shared/Container";

export const AboutSection = ({
  variant,
  isEditor,
  content,
  onUpdate,
  position,
  anchorName,
  path,
}: SectionProps) => {
  const isEven = position % 2 === 0;

  const sectionBg = isEven ? "var(--qs-bg)" : "var(--qs-bg-alt)";

  const cardBg = isEven ? "var(--qs-bg-alt)" : "var(--qs-bg)";

  const showImage = content.image1;

  // ─────────────────────────────────────────────
  // SPLIT VARIANT — MOBILE FRIENDLY
  // ─────────────────────────────────────────────

  if (variant === "split") {
    return (
      <section
        id={anchorName}
        className="py-14 sm:py-20 md:py-24"
        style={{ background: sectionBg }}
      >
        <Container>
          <div
            className={`grid gap-10 sm:gap-14 items-center ${
              showImage
                ? "md:grid-cols-2"
                : "max-w-3xl mx-auto text-center"
            }`}
          >
            <div>
              <p
                className="uppercase tracking-[0.25em] text-xs font-bold mb-4 sm:mb-5"
                style={{ color: "var(--qs-primary)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("label", e.currentTarget.textContent?.trim())
                }
              >
                {content.label || "About"}
              </p>

              <h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black tracking-tight leading-tight"
                style={{ color: "var(--qs-text)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("title", e.currentTarget.textContent?.trim())
                }
              >
                {content.title || "Your Story"}
              </h2>

              <p
                className="mt-5 sm:mt-7 text-base sm:text-lg leading-relaxed"
                style={{ color: "var(--qs-text-muted)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("desc", e.currentTarget.textContent?.trim())
                }
              >
                {content.desc ||
                  "Write something meaningful about yourself, your company, or your mission."}
              </p>
            </div>

            {showImage && (
              <div
                className="overflow-hidden rounded-[20px] sm:rounded-[32px] border shadow-2xl max-w-xs mx-auto md:max-w-full w-full"
                style={{
                  border: "1px solid var(--qs-border)",
                  background: cardBg,
                }}
              >
                <TemplateImage
                  source={content.image1}
                  isEditor={isEditor}
                  path={path + ".image1"}
                />
              </div>
            )}
          </div>
        </Container>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // CARD STATS VARIANT — MOBILE FRIENDLY
  // ─────────────────────────────────────────────

  if (variant === "card-stats") {
    return (
      <section
        id={anchorName}
        className="py-14 sm:py-20 md:py-24"
        style={{ background: sectionBg }}
      >
        <Container>
          <div
            className="rounded-[20px] sm:rounded-[36px] border p-5 sm:p-8 md:p-14"
            style={{
              background: cardBg,
              border: "1px solid var(--qs-border)",
              backdropFilter: "blur(14px)",
            }}
          >
            <div
              className={`grid gap-10 sm:gap-14 items-center ${
                showImage ? "md:grid-cols-2" : "max-w-4xl mx-auto"
              }`}
            >
              {showImage && (
                <div className="overflow-hidden rounded-[18px] sm:rounded-[28px] border border-[--qs-border] max-w-xs mx-auto md:max-w-full w-full mb-8 md:mb-0">
                  <TemplateImage
                    source={content.image1}
                    path={path + ".image1"}
                    isEditor={isEditor}
                  />
                </div>
              )}

              <div className={!showImage ? "text-center" : ""}>
                <p
                  className="uppercase tracking-[0.25em] text-xs font-bold mb-3 sm:mb-4"
                  style={{ color: "var(--qs-primary)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdate("label", e.currentTarget.textContent?.trim())
                  }
                >
                  {content.label || "About"}
                </p>

                <h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-5 sm:mb-6"
                  style={{ color: "var(--qs-text)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdate("title", e.currentTarget.textContent?.trim())
                  }
                >
                  {content.title || "Built With Experience"}
                </h2>

                <p
                  className="text-base sm:text-lg leading-relaxed mb-7 sm:mb-10"
                  style={{ color: "var(--qs-text-muted)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdate("desc", e.currentTarget.textContent?.trim())
                  }
                >
                  {content.desc ||
                    "Add a strong paragraph that explains your expertise, journey, or value."}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="rounded-2xl border p-3 sm:p-4 md:p-6 transition-all duration-300 hover:-translate-y-1"
                      style={{
                        background: "var(--qs-bg)",
                        border: "1px solid var(--qs-border)",
                      }}
                    >
                      <div
                        className="text-2xl sm:text-3xl md:text-4xl font-black mb-1 sm:mb-2"
                        style={{ color: "var(--qs-primary)" }}
                        contentEditable={isEditor}
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          onUpdate(
                            `stat${n}Value`,
                            e.currentTarget.textContent?.trim(),
                          )
                        }
                      >
                        {content[`stat${n}Value`] || "0"}
                      </div>

                      <div
                        className="text-xs sm:text-sm"
                        style={{ color: "var(--qs-text-muted)" }}
                        contentEditable={isEditor}
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          onUpdate(
                            `stat${n}Label`,
                            e.currentTarget.textContent?.trim(),
                          )
                        }
                      >
                        {content[`stat${n}Label`] || "Stat"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // DEFAULT CENTERED — MOBILE FRIENDLY
  // ─────────────────────────────────────────────

  return (
    <section
      id={anchorName}
      className="py-16 sm:py-24 md:py-28"
      style={{ background: sectionBg }}
    >
      <Container className="text-center">
        {showImage && (
          <div
            className="mx-auto mb-8 sm:mb-12 w-44 sm:w-72 overflow-hidden rounded-[20px] sm:rounded-[32px] border shadow-2xl"
            style={{
              border: "1px solid var(--qs-border)",
              background: cardBg,
            }}
          >
            <TemplateImage
              source={content.image1}
              path={path + ".image1"}
              isEditor={isEditor}
            />
          </div>
        )}

        <p
          className="uppercase tracking-[0.25em] text-xs font-bold mb-4 sm:mb-5"
          style={{ color: "var(--qs-primary)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate("label", e.currentTarget.textContent?.trim())}
        >
          {content.label || "About"}
        </p>

        <h2
          className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 sm:mb-7"
          style={{ color: "var(--qs-text)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate("title", e.currentTarget.textContent?.trim())}
        >
          {content.title || "Tell Your Story"}
        </h2>

        <p
          className="text-base sm:text-lg leading-relaxed max-w-[95vw] sm:max-w-3xl mx-auto"
          style={{ color: "var(--qs-text-muted)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate("desc", e.currentTarget.textContent?.trim())}
        >
          {content.desc ||
            "Write something that builds trust and explains who you are and what you do."}
        </p>
      </Container>
    </section>
  );
};
