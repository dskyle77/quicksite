import { SectionProps } from "../../types";
import Container from "@/components/shared/Container";

export const TextSection = ({
  variant,
  isEditor,
  content,
  onUpdate,
  position,
  anchorName,
  path
}: SectionProps) => {
  const isEven = position % 2 === 0;

  const sectionBg = isEven ? "var(--qs-bg)" : "var(--qs-bg-alt)";

  const cardBg = isEven ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)";

  // ─────────────────────────────────────────────
  // MINIMAL VARIANT
  // ─────────────────────────────────────────────

  if (variant === "minimal") {
    return (
      <section
        id={anchorName}
        className="py-24"
        style={{ background: sectionBg }}
      >
        <Container className="max-w-4xl">
          <div className="text-center">
            <p
              className="uppercase tracking-[0.25em] text-xs font-bold mb-5"
              style={{ color: "var(--qs-primary)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("label", e.currentTarget.textContent?.trim())
              }
            >
              {content.label || "Introduction"}
            </p>

            <h2
              className="text-4xl @md:text-6xl font-black tracking-tight leading-tight mb-6"
              style={{ color: "var(--qs-text)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("title", e.currentTarget.textContent?.trim())
              }
            >
              {content.title || "Simple Powerful Heading"}
            </h2>

            <p
              className="text-lg leading-relaxed max-w-3xl mx-auto"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("desc", e.currentTarget.textContent?.trim())
              }
            >
              {content.desc ||
                "This section is perfect for simple introductions, mission statements, or short blocks of content."}
            </p>
          </div>
        </Container>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // LEFT-ALIGNED VARIANT (like minimal, but left-aligned)
  // ─────────────────────────────────────────────

  if (variant === "minimal-left") {
    return (
      <section
        id={anchorName}
        className="py-24"
        style={{ background: sectionBg }}
      >
        <Container className="max-w-4xl">
          <div className="text-left">
            <p
              className="uppercase tracking-[0.25em] text-xs font-bold mb-5"
              style={{ color: "var(--qs-primary)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("label", e.currentTarget.textContent?.trim())
              }
            >
              {content.label || "Introduction"}
            </p>

            <h2
              className="text-4xl @md:text-6xl font-black tracking-tight leading-tight mb-6"
              style={{ color: "var(--qs-text)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("title", e.currentTarget.textContent?.trim())
              }
            >
              {content.title || "Simple Powerful Heading"}
            </h2>

            <p
              className="text-lg leading-relaxed max-w-3xl"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("desc", e.currentTarget.textContent?.trim())
              }
            >
              {content.desc ||
                "This section is perfect for simple introductions, mission statements, or short blocks of content."}
            </p>
          </div>
        </Container>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // CARD VARIANT
  // ─────────────────────────────────────────────

  if (variant === "card") {
    return (
      <section
        id={anchorName}
        className="py-24"
        style={{ background: sectionBg }}
      >
        <Container className="max-w-5xl">
          <div
            className="rounded-[36px] border p-8 @md:p-14 text-center"
            style={{
              background: cardBg,
              border: "1px solid var(--qs-border)",
              backdropFilter: "blur(14px)",
            }}
          >
            <p
              className="uppercase tracking-[0.25em] text-xs font-bold mb-5"
              style={{ color: "var(--qs-primary)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("label", e.currentTarget.textContent?.trim())
              }
            >
              {content.label || "Section"}
            </p>

            <h2
              className="text-4xl @md:text-5xl font-black tracking-tight mb-6"
              style={{ color: "var(--qs-text)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("title", e.currentTarget.textContent?.trim())
              }
            >
              {content.title || "Beautiful Text Block"}
            </h2>

            <p
              className="text-lg leading-relaxed max-w-3xl mx-auto"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("desc", e.currentTarget.textContent?.trim())
              }
            >
              {content.desc ||
                "Use this card variant when you want the text to stand out more from the background while keeping the design clean."}
            </p>
          </div>
        </Container>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // SPLIT VARIANT
  // ─────────────────────────────────────────────

  return (
    <section
      id={anchorName}
      className="py-24"
      style={{ background: sectionBg }}
    >
      <Container>
        <div className="grid @md:grid-cols-2 gap-12 items-start">
          <div>
            <p
              className="uppercase tracking-[0.25em] text-xs font-bold mb-5"
              style={{ color: "var(--qs-primary)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("label", e.currentTarget.textContent?.trim())
              }
            >
              {content.label || "Overview"}
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
              {content.title || "Left Aligned Heading"}
            </h2>
          </div>

          <div>
            <p
              className="text-lg leading-relaxed"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("desc", e.currentTarget.textContent?.trim())
              }
            >
              {content.desc ||
                "This split layout works well for storytelling, company philosophy, brand messaging, or detailed explanations."}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};
