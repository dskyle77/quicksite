import { SectionProps } from "../../types";
import Container from "@/components/shared/Container";
import EditableLinkButton from "@/components/shared/EditableLink";

// Utility: Render subheading only if present and styled
function CtaSubheading({
  subheading,
  subheadingClass,
  isEditor,
  onUpdate,

}: {
  subheading?: string;
  subheadingClass: string;
  isEditor: boolean;
  onUpdate: (key: string, value: string | undefined) => void;
}) {
  if (!subheading) return null;
  return (
    <p
      className={subheadingClass}
      style={{ color: "var(--qs-text-muted)" }}
      contentEditable={isEditor}
      suppressContentEditableWarning
      onBlur={e => onUpdate("subheading", e.currentTarget.textContent?.trim())}
    >
      {subheading}
    </p>
  );
}

export const CtaSection = ({
  content,
  isEditor,
  onUpdate,
  variant,
  position,
  anchorName,
}: SectionProps) => {
  const isEven = position % 2 === 0;
  const sectionBg = isEven ? "var(--qs-bg)" : "var(--qs-bg-alt)";
  const sectionCommon =
    variant === "simple"
      ? "py-8"
      : variant === "banner"
      ? "py-20"
      : "py-14";
  const containerMaxWidth =
    variant === "simple"
      ? "max-w-xl"
      : variant === "banner"
      ? "max-w-3xl"
      : "max-w-xl";

  // Headings
  const headingClass =
    variant === "simple"
      ? "text-2xl @md:text-3xl font-extrabold mb-2 tracking-tight"
      : variant === "banner"
      ? "text-4xl @md:text-5xl font-black mb-3 tracking-tight"
      : "text-3xl @md:text-4xl font-bold mb-3";
  const subheadingClass =
    variant === "banner"
      ? "mb-7 text-lg @md:text-xl opacity-80"
      : variant === "simple"
      ? "mb-4 text-base opacity-80"
      : "mb-4 text-base opacity-80";
  const textColor = "text-[var(--qs-text)]";

  // Buttons
  const buttonClass =
    variant === "simple"
      ? "inline-block bg-[var(--qs-primary)] text-[var(--qs-primary-fg)] px-6 py-2.5 rounded-xl font-semibold shadow hover:shadow-lg transition-colors duration-150 focus:outline-none focus:ring focus:ring-primary/30"
      : variant === "banner"
      ? "inline-block bg-[var(--qs-primary)] text-[var(--qs-primary-fg)] px-10 py-3.5 @md:px-14 @md:py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30"
      : "inline-block bg-[var(--qs-primary)] text-[var(--qs-primary-fg)] px-7 py-2.5 rounded-lg font-semibold shadow hover:shadow-lg transition-colors duration-150 focus:outline-none focus:ring focus:ring-primary/30";

  const sectionStyle = {
    background: sectionBg,
  };

  // Given content structure expected for buttons
  // For consistent API with CtaLink, follow NavbarVariants usage:
  // <CtaLink
  //    isEditor={isEditor}
  //    label={content?.ctaButton ?? "Hire Me"}
  //    linkConfig={content?.ctaButtonLink}
  //    onLabelChange={v => onUpdate("ctaButton", v)}
  //    onLinkChange={cfg => onUpdate("ctaButtonLink", cfg)}
  //    className="..."
  //    style={{ ... }}
  // />
  // We'll set the defaultText through label fallback.

  // Banner Variant
  if (variant === "banner") {
    return (
      <section className={sectionCommon} style={sectionStyle} id={anchorName}>
        <Container className={`${containerMaxWidth} px-4`}>
          <div className="text-center flex flex-col items-center gap-4">
            <h2
              className={`${headingClass} ${textColor}`}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("heading", e.currentTarget.textContent?.trim())
              }
            >
              {content?.heading ?? "Ready to get started?"}
            </h2>
            <CtaSubheading
              subheading={content?.subheading}
              subheadingClass={subheadingClass}
              isEditor={isEditor}
              onUpdate={onUpdate}
            />
            <EditableLinkButton
              isEditor={isEditor}
              label={content?.primaryButton ?? "Request a Demo"}
              linkConfig={content?.primaryLink}
              onLabelChange={v => onUpdate("primaryButton", v)}
              onLinkChange={cfg => onUpdate("primaryLink", cfg)}
              className={buttonClass}
              style={{
                minWidth: 170,
              }}
            />
          </div>
        </Container>
      </section>
    );
  }

  // Minimal/simple Variant
  if (variant === "simple") {
    return (
      <section className={sectionCommon} style={sectionStyle} id={anchorName}>
        <Container className={`${containerMaxWidth} px-4`}>
          <div className="text-center flex flex-col items-center gap-2">
            <h2
              className={`${headingClass} ${textColor}`}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("heading", e.currentTarget.textContent?.trim())
              }
            >
              {content?.heading ?? "Let's Talk"}
            </h2>
            <EditableLinkButton
              isEditor={isEditor}
              label={content?.primaryButton ?? "Contact Us"}
              linkConfig={content?.primaryLink}
              onLabelChange={v => onUpdate("primaryButton", v)}
              onLinkChange={cfg => onUpdate("primaryLink", cfg)}
              className={buttonClass}
              style={{
                minWidth: 150,
              }}
            />
          </div>
        </Container>
      </section>
    );
  }

  // Default Variant
  return (
    <section className={sectionCommon} style={sectionStyle} id={anchorName}>
      <Container className={`${containerMaxWidth} px-4`}>
        <div className="text-center flex flex-col items-center gap-4">
          <h2
            className={`${headingClass} ${textColor}`}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("heading", e.currentTarget.textContent?.trim())
            }
          >
            {content?.heading ?? "Interested? Let's Chat!"}
          </h2>
          <CtaSubheading
            subheading={content?.subheading}
            subheadingClass={subheadingClass}
            isEditor={isEditor}
            onUpdate={onUpdate}
          />
          <EditableLinkButton
            isEditor={isEditor}
            label={content?.primaryButton ?? "Get in Touch"}
            linkConfig={content?.primaryLink}
            onLabelChange={v => onUpdate("primaryButton", v)}
            onLinkChange={cfg => onUpdate("primaryLink", cfg)}
            className={buttonClass}
            style={{
              minWidth: 160,
            }}
          />
        </div>
      </Container>
    </section>
  );
};
