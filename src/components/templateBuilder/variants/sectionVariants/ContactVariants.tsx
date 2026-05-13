import { SectionProps } from "../../types";
import CtaLink from "@/components/shared/CtaLinkModal";

export const ContactSection = ({
  variant,
  isEditor,
  content,
  onUpdate,
  position,
}: SectionProps) => {
  const isEven = position % 2 === 0;

  const sectionBg = isEven
    ? "linear-gradient(135deg, var(--qs-bg) 0%, var(--qs-bg-alt) 100%)"
    : "linear-gradient(135deg, var(--qs-bg-alt) 0%, var(--qs-bg) 100%)";

  const cardBg = isEven ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)";

  // ─────────────────────────────────────────────
  // SPLIT VARIANT
  // ─────────────────────────────────────────────

  if (variant === "split") {
    return (
      <section id="contact" className="py-24" style={{ background: sectionBg }}>
        <div className="max-w-6xl mx-auto px-4">
          <div
            className="grid md:grid-cols-2 gap-12 items-center rounded-[36px] border p-8 md:p-14"
            style={{
              background: cardBg,
              border: "1px solid var(--qs-border)",
              backdropFilter: "blur(14px)",
            }}
          >
            <div>
              <p
                className="uppercase tracking-[0.25em] text-xs font-bold mb-5"
                style={{ color: "var(--qs-primary)" }}
              >
                CONTACT
              </p>

              <h2
                className="text-4xl md:text-6xl font-black tracking-tight leading-tight"
                style={{ color: "var(--qs-text)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("content.title", e.currentTarget.textContent?.trim())
                }
              >
                {content.title ?? "Let's Work Together"}
              </h2>

              <p
                className="mt-6 text-lg leading-relaxed"
                style={{ color: "var(--qs-text-muted)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("content.desc", e.currentTarget.textContent?.trim())
                }
              >
                {content.desc ??
                  "Tell people how to contact you and what you can help them with."}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <CtaLink
                isEditor={isEditor}
                label={content.primaryButton ?? "Send a Message"}
                linkConfig={content.primaryButtonLink}
                onLabelChange={(v) => onUpdate("content.primaryButton", v)}
                onLinkChange={(cfg) =>
                  onUpdate("content.primaryButtonLink", cfg)
                }
                className="rounded-2xl px-8 py-5 font-bold text-center transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--qs-primary)",
                  color: "var(--qs-primary-fg)",
                }}
              />

              {content.secondaryButton && (
                <CtaLink
                  isEditor={isEditor}
                  label={content.secondaryButton}
                  linkConfig={content.secondaryButtonLink}
                  onLabelChange={(v) => onUpdate("content.secondaryButton", v)}
                  onLinkChange={(cfg) =>
                    onUpdate("content.secondaryButtonLink", cfg)
                  }
                  className="rounded-2xl px-8 py-5 font-bold text-center transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "transparent",
                    color: "var(--qs-text)",
                    border: "1px solid var(--qs-border)",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // MINIMAL VARIANT
  // ─────────────────────────────────────────────

  if (variant === "minimal") {
    return (
      <section id="contact" className="py-24" style={{ background: sectionBg }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div
            className="rounded-[36px] border p-8 md:p-14"
            style={{
              background: cardBg,
              border: "1px solid var(--qs-border)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="text-6xl mb-8"
              style={{ color: "var(--qs-primary)" }}
            >
              ✦
            </div>

            <h2
              className="text-4xl md:text-5xl font-black tracking-tight"
              style={{ color: "var(--qs-text)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("content.title", e.currentTarget.textContent?.trim())
              }
            >
              {content.title ?? "Get In Touch"}
            </h2>

            <p
              className="mt-6 text-lg leading-relaxed"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("content.desc", e.currentTarget.textContent?.trim())
              }
            >
              {content.desc ??
                "Have an idea, project, or opportunity? Reach out anytime."}
            </p>

            <div className="mt-10">
              <CtaLink
                isEditor={isEditor}
                label={content.primaryButton ?? "Send Message"}
                linkConfig={content.primaryButtonLink}
                onLabelChange={(v) => onUpdate("content.primaryButton", v)}
                onLinkChange={(cfg) =>
                  onUpdate("content.primaryButtonLink", cfg)
                }
                className="inline-flex items-center justify-center rounded-2xl px-10 py-5 font-bold transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--qs-primary)",
                  color: "var(--qs-primary-fg)",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // DEFAULT VARIANT
  // ─────────────────────────────────────────────
  // ─────────────────────────────────────────────
  // FORM VARIANT
  // ─────────────────────────────────────────────

  if (variant === "form") {
    return (
      <section id="contact" className="py-24" style={{ background: sectionBg }}>
        <div className="max-w-6xl mx-auto px-4">
          <div
            className="grid lg:grid-cols-2 gap-10 rounded-[36px] border overflow-hidden"
            style={{
              background: cardBg,
              border: "1px solid var(--qs-border)",
              backdropFilter: "blur(14px)",
            }}
          >
            {/* Left */}
            <div className="p-8 md:p-14">
              <p
                className="uppercase tracking-[0.25em] text-xs font-bold mb-5"
                style={{ color: "var(--qs-primary)" }}
              >
                CONTACT
              </p>

              <h2
                className="text-4xl md:text-5xl font-black tracking-tight leading-tight"
                style={{ color: "var(--qs-text)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("content.title", e.currentTarget.textContent?.trim())
                }
              >
                {content.title ?? "Let's Talk About Your Project"}
              </h2>

              <p
                className="mt-6 text-lg leading-relaxed"
                style={{ color: "var(--qs-text-muted)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("content.desc", e.currentTarget.textContent?.trim())
                }
              >
                {content.desc ??
                  "Use this section to collect leads, enquiries, or project requests."}
              </p>

              <div className="mt-10 space-y-5">
                {[
                  content.email || "hello@example.com",
                  content.phone || "+234 000 000 0000",
                  content.location || "Lagos, Nigeria",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-2xl border px-5 py-4"
                    style={{
                      border: "1px solid var(--qs-border)",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center font-bold"
                      style={{
                        background: "var(--qs-primary)",
                        color: "var(--qs-primary-fg)",
                      }}
                    >
                      {i === 0 ? "@" : i === 1 ? "☎" : "⌂"}
                    </div>

                    <div
                      className="font-medium"
                      style={{ color: "var(--qs-text)" }}
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        if (i === 0) {
                          onUpdate(
                            "contact.email",
                            e.currentTarget.textContent?.trim(),
                          );
                        }

                        if (i === 1) {
                          onUpdate(
                            "contact.phone",
                            e.currentTarget.textContent?.trim(),
                          );
                        }

                        if (i === 2) {
                          onUpdate(
                            "contact.location",
                            e.currentTarget.textContent?.trim(),
                          );
                        }
                      }}
                    >
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div
              className="p-8 md:p-14 border-l"
              style={{
                borderColor: "var(--qs-border)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div className="space-y-5">
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--qs-text)" }}
                  >
                    Name
                  </label>

                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full rounded-2xl px-5 py-4 outline-none"
                    style={{
                      background: "var(--qs-bg)",
                      border: "1px solid var(--qs-border)",
                      color: "var(--qs-text)",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--qs-text)" }}
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full rounded-2xl px-5 py-4 outline-none"
                    style={{
                      background: "var(--qs-bg)",
                      border: "1px solid var(--qs-border)",
                      color: "var(--qs-text)",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: "var(--qs-text)" }}
                  >
                    Message
                  </label>

                  <textarea
                    rows={6}
                    placeholder="Tell me about your project..."
                    className="w-full rounded-2xl px-5 py-4 outline-none resize-none"
                    style={{
                      background: "var(--qs-bg)",
                      border: "1px solid var(--qs-border)",
                      color: "var(--qs-text)",
                    }}
                  />
                </div>

                <div className="pt-2">
                  <CtaLink
                    isEditor={isEditor}
                    label={content.primaryButton ?? "Send Message"}
                    linkConfig={content.primaryButtonLink}
                    onLabelChange={(v) => onUpdate("content.primaryButton", v)}
                    onLinkChange={(cfg) =>
                      onUpdate("content.primaryButtonLink", cfg)
                    }
                    className="w-full rounded-2xl px-8 py-5 font-bold text-center transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: "var(--qs-primary)",
                      color: "var(--qs-primary-fg)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="contact" className="py-28" style={{ background: sectionBg }}>
      <div className="max-w-6xl mx-auto px-4">
        <div
          className="relative overflow-hidden rounded-[40px] px-6 py-14 md:px-14 md:py-20 text-center"
          style={{
            background:
              "linear-gradient(135deg, var(--qs-primary) 0%, color-mix(in srgb, var(--qs-primary) 70%, black) 100%)",
            color: "var(--qs-primary-fg)",
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="text-5xl md:text-6xl mb-6">✦</div>

            <h2
              className="text-4xl md:text-6xl font-black tracking-tight leading-tight"
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("content.title", e.currentTarget.textContent?.trim())
              }
            >
              {content.title ?? "Let's Build Something Great"}
            </h2>

            <p
              className="mx-auto mt-6 max-w-2xl text-lg md:text-xl leading-relaxed opacity-90"
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("content.desc", e.currentTarget.textContent?.trim())
              }
            >
              {content.desc ??
                "Ready to start your next project? Reach out and let's make it happen."}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <CtaLink
                isEditor={isEditor}
                label={content.primaryButton ?? "Send a Message"}
                linkConfig={content.primaryButtonLink}
                onLabelChange={(v) => onUpdate("content.primaryButton", v)}
                onLinkChange={(cfg) =>
                  onUpdate("content.primaryButtonLink", cfg)
                }
                className="rounded-2xl px-8 py-5 font-bold text-center transition-all duration-300 hover:scale-[1.03]"
                style={{
                  background: "#fff",
                  color: "#000",
                }}
              />

              {content.secondaryButton && (
                <CtaLink
                  isEditor={isEditor}
                  label={content.secondaryButton}
                  linkConfig={content.secondaryButtonLink}
                  onLabelChange={(v) => onUpdate("content.secondaryButton", v)}
                  onLinkChange={(cfg) =>
                    onUpdate("content.secondaryButtonLink", cfg)
                  }
                  className="rounded-2xl px-8 py-5 font-bold text-center transition-all duration-300 hover:scale-[1.03]"
                  style={{
                    background: "transparent",
                    color: "var(--qs-primary-fg)",
                    border: "1px solid rgba(255,255,255,0.25)",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
