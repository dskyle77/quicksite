/* eslint-disable @typescript-eslint/no-explicit-any */
import { SectionProps } from "../../types";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";
import Container from "@/components/shared/Container";

const getDefaultExperience = () => ({
  period: "2020 - 2021",
  role: "Job Title",
  company: "Company Name",
  desc: "Short job description or noteworthy achievements.",
});

export const ExperienceSection = ({
  variant,
  isEditor,
  content,
  onUpdate,
  position,
  anchorName,
  path
}: SectionProps) => {
  // Determine if this section is in an even or odd position
  const isEven = position % 2 === 0;
  const sectionBg = isEven ? "var(--qs-bg)" : "var(--qs-bg-alt)";
  const itemBg = isEven ? "var(--qs-bg-alt)" : "var(--qs-bg)";

  const items: any[] = content?.items ?? [];

  const handleAdd = () => {
    const next = [...items, getDefaultExperience()];
    onUpdate("items", next);
  };

  const handleRemove = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    onUpdate("items", next);
  };

  // ── Variant: "timeline" ──
  if (variant === "timeline") {
    return (
      <section
        id={anchorName}
        style={{ background: sectionBg }} // Set section background
      >
        <Container className="py-10 @sm:py-16">
          <div className="mb-8 @sm:mb-10 flex flex-col @sm:flex-row @sm:items-center @sm:justify-between gap-2">
            <div>
              <h3
                className="text-2xl @sm:text-3xl font-bold"
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("heading", e.currentTarget.textContent?.trim())
                }
              >
                {content?.heading ?? "Experience"}
              </h3>
              <p
                className="mt-2 text-sm"
                style={{ color: "var(--qs-text-muted)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("subheading", e.currentTarget.textContent?.trim())
                }
              >
                {content?.subheading}
              </p>
            </div>
            {isEditor && (
              <AddButton
                className="mt-2 @sm:mt-0 ml-0 @sm:ml-2"
                aria-label="Add experience"
                onClick={handleAdd}
              >
                Add
              </AddButton>
            )}
          </div>
          <div
            className="relative pl-4 @sm:pl-8 border-l-2"
            style={{ borderColor: "var(--qs-border)" }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="relative mb-8 @sm:mb-10 group"
                style={{
                  background: i % 2 === 0 ? itemBg : sectionBg,
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  boxShadow: "0 1px 4px 0 rgba(0,0,0,.03)",
                }}
              >
                <div
                  className="absolute -left-6 @sm:-left-[2.65rem] top-1 w-4 h-4 @sm:w-5 @sm:h-5 rounded-full border-2"
                  style={{
                    background: "var(--qs-primary)",
                    borderColor: sectionBg,
                  }}
                />
                {isEditor && (
                  <Xbutton
                    className="absolute right-2 top-2 z-10 opacity-60 hover:opacity-100"
                    aria-label="Remove experience"
                    onClick={() => handleRemove(i)}
                  />
                )}
                <p
                  className="text-[11px] @sm:text-xs font-bold uppercase tracking-widest mb-1"
                  style={{ color: "var(--qs-primary)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const next = [...items];
                    next[i].period =
                      e.currentTarget.textContent?.trim() ?? item.period;
                    onUpdate("items", next);
                  }}
                >
                  {item.period}
                </p>
                <h4
                  className="text-base @sm:text-lg font-bold"
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const next = [...items];
                    next[i].role =
                      e.currentTarget.textContent?.trim() ?? item.role;
                    onUpdate("items", next);
                  }}
                >
                  {item.role}
                </h4>
                <p
                  className="text-xs @sm:text-sm font-medium"
                  style={{ color: "var(--qs-text-muted)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const next = [...items];
                    next[i].company =
                      e.currentTarget.textContent?.trim() ?? item.company;
                    onUpdate("items", next);
                  }}
                >
                  {item.company}
                </p>
                <p
                  className="mt-2 text-xs @sm:text-sm leading-relaxed"
                  style={{ color: "var(--qs-text-muted)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const next = [...items];
                    next[i].desc =
                      e.currentTarget.textContent?.trim() ?? item.desc;
                    onUpdate("items", next);
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  // ── Variant: "card-stack" ──
  if (variant === "card-stack") {
    return (
      <section id={anchorName} style={{ background: sectionBg }}>
        <Container className="py-10 @sm:py-16">
          <div className="mb-8 @sm:mb-10 flex flex-col @sm:flex-row @sm:items-center @sm:justify-between gap-2">
            <div>
              <h3
                className="text-2xl @sm:text-3xl font-bold"
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("heading", e.currentTarget.textContent?.trim())
                }
              >
                {content?.heading ?? "Experience"}
              </h3>
              <p
                className="mt-2 text-sm"
                style={{ color: "var(--qs-text-muted)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("subheading", e.currentTarget.textContent?.trim())
                }
              >
                {content?.subheading}
              </p>
            </div>
            {isEditor && (
              <AddButton
                className="mt-2 @sm:mt-0 ml-0 @sm:ml-2"
                aria-label="Add experience"
                onClick={handleAdd}
              >
                Add
              </AddButton>
            )}
          </div>
          <div className="space-y-4">
            {items.map((item, i) => (
              <div
                key={i}
                className="rounded-xl @sm:rounded-2xl p-4 @sm:p-6 relative group"
                style={{
                  background: i % 2 === 0 ? itemBg : sectionBg,
                  border: "1px solid var(--qs-border)",
                }}
              >
                {isEditor && (
                  <Xbutton
                    className="absolute right-2 top-2 z-10 opacity-60 hover:opacity-100"
                    aria-label="Remove experience"
                    onClick={() => handleRemove(i)}
                  />
                )}
                <div className="flex flex-col gap-1 @sm:flex-row @sm:items-center @sm:justify-between mb-3">
                  <h4
                    className="text-base @sm:text-lg font-bold"
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const next = [...items];
                      next[i].role =
                        e.currentTarget.textContent?.trim() ?? item.role;
                      onUpdate("items", next);
                    }}
                  >
                    {item.role}
                  </h4>
                  <span
                    className="text-[11px] @sm:text-xs font-mono px-2 @sm:px-3 py-[6px] @sm:py-1 rounded-full mt-1 @sm:mt-0"
                    style={{
                      background: i % 2 === 0 ? sectionBg : itemBg,
                      border: "1px solid var(--qs-border)",
                    }}
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const next = [...items];
                      next[i].period =
                        e.currentTarget.textContent?.trim() ?? item.period;
                      onUpdate("items", next);
                    }}
                  >
                    {item.period}
                  </span>
                </div>
                <p
                  className="text-xs @sm:text-sm font-medium mb-2"
                  style={{ color: "var(--qs-primary)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const next = [...items];
                    next[i].company =
                      e.currentTarget.textContent?.trim() ?? item.company;
                    onUpdate("items", next);
                  }}
                >
                  {item.company}
                </p>
                <p
                  className="text-xs @sm:text-sm leading-relaxed"
                  style={{ color: "var(--qs-text-muted)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const next = [...items];
                    next[i].desc =
                      e.currentTarget.textContent?.trim() ?? item.desc;
                    onUpdate("items", next);
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  // ── Variant: "compact-list" ── (Mobile Friendly)
  return (
    <section id={anchorName} style={{ background: sectionBg }}>
      <Container className="py-10 @sm:py-16">
        <div className="mb-8 @sm:mb-10 flex flex-col @sm:flex-row @sm:items-center @sm:justify-between gap-2">
          <h3
            className="text-2xl @sm:text-3xl font-bold"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("heading", e.currentTarget.textContent?.trim())
            }
          >
            {content?.heading ?? "Experience"}
          </h3>
          {isEditor && (
            <AddButton
              className="mt-2 @sm:mt-0 ml-0 @sm:ml-2"
              aria-label="Add experience"
              onClick={handleAdd}
            >
              Add
            </AddButton>
          )}
        </div>
        <div className="space-y-6 @sm:space-y-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="relative group flex flex-col @sm:flex-row gap-3 @sm:gap-8 @sm:items-start p-3 @sm:p-5 bg-opacity-70 rounded-lg border border-solid @sm:border-0 shadow-sm hover:shadow transition-all"
              style={{
         
                borderColor: "var(--qs-border)",
                background: i % 2 === 0 ? itemBg : sectionBg,
              }}
            >
              {isEditor && (
                <Xbutton
                  className="absolute right-1 top-1 z-10 opacity-60 hover:opacity-100"
                  aria-label="Remove experience"
                  onClick={() => handleRemove(i)}
                />
              )}
              <div className="w-full @sm:w-48 shrink-0 flex items-center @sm:block mb-1 @sm:mb-0">
                <span
                  className="inline-block text-[11px] @sm:text-xs font-mono px-3 @sm:px-4 py-1 @sm:py-2 rounded-full"
                  style={{
                    background: i % 2 === 0 ? sectionBg : itemBg,
                    border: "1px solid var(--qs-border)",
                  }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const next = [...items];
                    next[i].period =
                      e.currentTarget.textContent?.trim() ?? item.period;
                    onUpdate("items", next);
                  }}
                >
                  {item.period}
                </span>
              </div>
              <div className="flex-1">
                <h4
                  className="text-base @sm:text-xl font-bold"
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const next = [...items];
                    next[i].role =
                      e.currentTarget.textContent?.trim() ?? item.role;
                    onUpdate("items", next);
                  }}
                >
                  {item.role}
                </h4>
                <p
                  className="text-xs @sm:text-sm font-medium"
                  style={{ color: "var(--qs-primary)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const next = [...items];
                    next[i].company =
                      e.currentTarget.textContent?.trim() ?? item.company;
                    onUpdate("items", next);
                  }}
                >
                  {item.company}
                </p>
                <p
                  className="mt-2 @sm:mt-3 text-xs @sm:text-sm"
                  style={{ color: "var(--qs-text-muted)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const next = [...items];
                    next[i].desc =
                      e.currentTarget.textContent?.trim() ?? item.desc;
                    onUpdate("items", next);
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
