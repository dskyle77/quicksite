import { SectionProps } from "../../types";
import EditableLinkButton from "@/components/shared/EditableLink";
import { useState, type SubmitEvent } from "react";
import Container from "@/components/shared/Container";
import useFormSubmit from "@/hooks/useFormSubmit";

export const ContactSection = ({
  variant,
  isEditor,
  content,
  onUpdate,
  position,
  anchorName,
  slugs,
}: SectionProps) => {
  const isEven = position % 2 === 0;

  const sectionBg = isEven ? "var(--qs-bg)" : "var(--qs-bg-alt)";
  const cardBg = isEven ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitForm = useFormSubmit();

  // ─────────────────────────────────────────────
  // SPLIT VARIANT
  // ─────────────────────────────────────────────

  if (variant === "split") {
    return (
      <section id={anchorName} style={{ background: sectionBg }}>
        <Container className="py-24">
          <div
            className="grid @md:grid-cols-2 gap-12 items-center rounded-[36px] border p-8 @md:p-14"
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
                className="text-4xl @md:text-6xl font-black tracking-tight leading-tight"
                style={{ color: "var(--qs-text)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("title", e.currentTarget.textContent?.trim())
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
                  onUpdate("desc", e.currentTarget.textContent?.trim())
                }
              >
                {content.desc ??
                  "Tell people how to contact you and what you can help them with."}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <EditableLinkButton
                isEditor={isEditor}
                label={content.primaryButton ?? "Send a Message"}
                linkConfig={content.primaryButtonLink}
                onLabelChange={(v) => onUpdate("primaryButton", v)}
                onLinkChange={(cfg) =>
                  onUpdate("primaryButtonLink", cfg)
                }
                className="rounded-2xl px-8 py-5 font-bold text-center transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--qs-primary)",
                  color: "var(--qs-primary-fg)",
                }}
              />

              {content.secondaryButton && (
                <EditableLinkButton
                  isEditor={isEditor}
                  label={content.secondaryButton}
                  linkConfig={content.secondaryButtonLink}
                  onLabelChange={(v) => onUpdate("secondaryButton", v)}
                  onLinkChange={(cfg) =>
                    onUpdate("secondaryButtonLink", cfg)
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
        </Container>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // MINIMAL VARIANT
  // ─────────────────────────────────────────────

  if (variant === "minimal") {
    return (
      <section id={anchorName} style={{ background: sectionBg }}>
        <Container className="py-24 text-center">
          <div
            className="rounded-[36px] border p-8 @md:p-14"
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
              className="text-4xl @md:text-5xl font-black tracking-tight"
              style={{ color: "var(--qs-text)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("title", e.currentTarget.textContent?.trim())
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
                onUpdate("desc", e.currentTarget.textContent?.trim())
              }
            >
              {content.desc ??
                "Have an idea, project, or opportunity? Reach out anytime."}
            </p>

            <div className="mt-10">
              <EditableLinkButton
                isEditor={isEditor}
                label={content.primaryButton ?? "Send Message"}
                linkConfig={content.primaryButtonLink}
                onLabelChange={(v) => onUpdate("primaryButton", v)}
                onLinkChange={(cfg) =>
                  onUpdate("primaryButtonLink", cfg)
                }
                className="inline-flex items-center justify-center rounded-2xl px-10 py-5 font-bold transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "var(--qs-primary)",
                  color: "var(--qs-primary-fg)",
                }}
              />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // FORM VARIANT
  // ─────────────────────────────────────────────

  if (variant === "form") {
    const handleInput = (key: keyof typeof formData, value: string) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      setSubmitSuccess(false);
      setSubmitError(null);
    };

    const handleSubmit = async (e: SubmitEvent) => {
      e.preventDefault();
      if (isEditor) return;

      await submitForm({
        formData,
        setFormData,
        setSubmitting,
        setSubmitSuccess,
        setSubmitError,
        siteSlug: slugs?.slug,
        anchorName,
      });
    };

    const primaryButtonLabel = content.primaryButton ?? "Send Message";

    return (
      <section
        id={anchorName}
        className="py-24"
        style={{ background: sectionBg }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div
            className="grid @lg:grid-cols-2 gap-10 rounded-[36px] border overflow-hidden"
            style={{
              background: cardBg,
              border: "1px solid var(--qs-border)",
              backdropFilter: "blur(14px)",
            }}
          >
            {/* Left */}
            <div className="p-8 @md:p-14">
              <p
                className="uppercase tracking-[0.25em] text-xs font-bold mb-5"
                style={{ color: "var(--qs-primary)" }}
              >
                CONTACT
              </p>

              <h2
                className="text-4xl @md:text-5xl font-black tracking-tight leading-tight"
                style={{ color: "var(--qs-text)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("title", e.currentTarget.textContent?.trim())
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
                  onUpdate("desc", e.currentTarget.textContent?.trim())
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
                            "email",
                            e.currentTarget.textContent?.trim(),
                          );
                        }

                        if (i === 1) {
                          onUpdate(
                            "phone",
                            e.currentTarget.textContent?.trim(),
                          );
                        }

                        if (i === 2) {
                          onUpdate(
                            "location",
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
              className="p-8 @md:p-14 border-l"
              style={{
                borderColor: "var(--qs-border)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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
                    disabled={isEditor || submitting}
                    className="w-full rounded-2xl px-5 py-4 outline-none disabled:opacity-60"
                    style={{
                      background: "var(--qs-bg)",
                      border: "1px solid var(--qs-border)",
                      color: "var(--qs-text)",
                    }}
                    value={formData.name}
                    onChange={(e) => handleInput("name", e.target.value)}
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
                    disabled={isEditor || submitting}
                    className="w-full rounded-2xl px-5 py-4 outline-none disabled:opacity-60"
                    style={{
                      background: "var(--qs-bg)",
                      border: "1px solid var(--qs-border)",
                      color: "var(--qs-text)",
                    }}
                    value={formData.email}
                    onChange={(e) => handleInput("email", e.target.value)}
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
                    required
                    placeholder="Tell me about your project..."
                    disabled={isEditor || submitting}
                    className="w-full rounded-2xl px-5 py-4 outline-none resize-none disabled:opacity-60"
                    style={{
                      background: "var(--qs-bg)",
                      border: "1px solid var(--qs-border)",
                      color: "var(--qs-text)",
                    }}
                    value={formData.message}
                    onChange={(e) => handleInput("message", e.target.value)}
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type={isEditor ? "button" : "submit"}
                    disabled={!isEditor && submitting}
                    className="w-full rounded-2xl px-8 py-5 font-bold text-center transition-all duration-300 hover:-translate-y-1 disabled:opacity-60 disabled:hover:translate-y-0"
                    style={{
                      background: "var(--qs-primary)",
                      color: "var(--qs-primary-fg)",
                    }}
                  >
                    <span
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        onUpdate(
                          "primaryButton",
                          e.currentTarget.textContent?.trim(),
                        )
                      }
                    >
                      {submitting && !isEditor
                        ? "Sending…"
                        : primaryButtonLabel}
                    </span>
                  </button>
                  {submitSuccess && !isEditor && (
                    <p
                      className="text-sm text-center"
                      style={{ color: "var(--qs-primary)" }}
                    >
                      Thanks! Your message was sent.
                    </p>
                  )}
                  {submitError && !isEditor && (
                    <p className="text-sm text-center text-red-500">
                      {submitError}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={anchorName} style={{ background: sectionBg }}>
      <Container className="py-14">
        <div
          className="rounded-2xl shadow-lg border border-(--qs-border) px-5 py-8 @md:px-10 @md:py-12 bg-(--qs-bg-alt) flex flex-col gap-4 items-start"
          style={{
            background: "var(--qs-bg-alt)",
            color: "var(--qs-text)",
          }}
        >
          <div className="text-2xl mb-1 select-none" aria-hidden>
            🚀
          </div>
          <h2
            className="text-2xl @md:text-4xl font-extrabold tracking-tight mb-2"
            style={{ color: "var(--qs-primary)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("title", e.currentTarget.textContent?.trim())
            }
          >
            {content.title ?? "Let's Build Something Great"}
          </h2>
          <p
            className="mt-0 text-base @md:text-lg leading-relaxed mb-5 text-(--qs-text-muted) max-w-xl"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("desc", e.currentTarget.textContent?.trim())
            }
          >
            {content.desc ??
              "Ready to start your next project? Reach out and let's make it happen."}
          </p>
          <div className="flex flex-col @sm:flex-row items-center gap-3 w-full mt-1">
            <EditableLinkButton
              isEditor={isEditor}
              label={content.primaryButton ?? "Send a Message"}
              linkConfig={content.primaryButtonLink}
              onLabelChange={(v) => onUpdate("primaryButton", v)}
              onLinkChange={(cfg) => onUpdate("primaryButtonLink", cfg)}
              className="rounded-lg px-6 py-3 font-bold text-center w-full @sm:w-auto transition-all duration-200 hover:-translate-y-1 bg-(--qs-primary) text-(--qs-primary-fg)"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};
