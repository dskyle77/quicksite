import { SectionProps } from "../../types";

export const CtaSection = ({
  content,
  isEditor,
  onUpdate,
  variant,
  position,
}: SectionProps) => {
  const isEven = position % 2 === 0;
  const sectionBg = isEven ? "var(--qs-bg)" : "var(--qs-bg-alt)";
  const headingClass =
    variant === "simple"
      ? "text-xl font-bold mb-2"
      : variant === "banner"
        ? "text-3xl font-extrabold mb-3"
        : "text-2xl font-bold mb-3";
  const buttonClass =
    variant === "simple"
      ? "bg-black text-white px-5 py-2 rounded-xl font-semibold"
      : variant === "banner"
        ? "bg-primary text-primary-fg px-8 py-3 rounded-lg font-bold"
        : "bg-primary text-primary-fg px-7 py-2.5 rounded-lg font-semibold";
  const sectionCommon =
    variant === "simple" ? "py-6" : variant === "banner" ? "py-14" : "py-12";
  const sectionStyle = {
    background:
      variant === "banner"
        ? sectionBg // Use theme even for banner instead of hardcoded
        : sectionBg,
  };
  const textColor =
    variant === "simple"
      ? "text-[var(--qs-text)]"
      : variant === "banner"
        ? "text-[var(--qs-text)]"
        : "text-[var(--qs-text)]";
  const subheadingClass =
    variant === "banner"
      ? "mb-6 text-base opacity-80"
      : variant === "simple"
        ? "mb-3 opacity-80"
        : "mb-4 opacity-80";
  const containerMaxWidth =
    variant === "simple"
      ? "max-w-xl"
      : variant === "banner"
        ? "max-w-3xl"
        : "max-w-lg";

  if (variant === "banner") {
    return (
      <section className={`${sectionCommon}`} style={sectionStyle}>
        <div className={`${containerMaxWidth} mx-auto px-4 text-center`}>
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
          <p
            className={subheadingClass}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("subheading", e.currentTarget.textContent?.trim())
            }
          >
            {content?.subheading}
          </p>
          <button
            className={buttonClass}
            style={{
              background: "var(--qs-primary)",
              color: "var(--qs-primary-fg)",
            }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("primaryButton", e.currentTarget.textContent?.trim())
            }
          >
            {content?.primaryButton ?? "Request a Demo"}
          </button>
        </div>
      </section>
    );
  }
  if (variant === "simple") {
    // Minimal CTA
    return (
      <section className={sectionCommon} style={sectionStyle}>
        <div className={`${containerMaxWidth} mx-auto px-4 text-center`}>
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
          <button
            className={buttonClass}
            style={{
              background: "var(--qs-primary)",
              color: "var(--qs-primary-fg)",
            }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("primaryButton", e.currentTarget.textContent?.trim())
            }
          >
            {content?.primaryButton ?? "Contact Us"}
          </button>
        </div>
      </section>
    );
  }
  // Default
  return (
    <section className={sectionCommon} style={sectionStyle}>
      <div className={`${containerMaxWidth} mx-auto px-4 text-center`}>
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
        <p
          className={subheadingClass}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("subheading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.subheading}
        </p>
        <button
          className={buttonClass}
          style={{
            background: "var(--qs-primary)",
            color: "var(--qs-primary-fg)",
          }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("primaryButton", e.currentTarget.textContent?.trim())
          }
        >
          {content?.primaryButton ?? "Get in Touch"}
        </button>
      </div>
    </section>
  );
};
