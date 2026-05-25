/* eslint-disable @typescript-eslint/no-explicit-any */
import { SectionProps } from "../../types";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";
import Container from "@/components/shared/Container";

export const SkillsSection = ({
  variant,
  isEditor,
  content,
  onUpdate,
  position,
  anchorName,
  path
}: SectionProps) => {
  // Use even/odd position to set section background
  const isEven = position % 2 === 0;
  const sectionBg = isEven ? "var(--qs-bg)" : "var(--qs-bg-alt)";
  // For compatibility with @file_context_0, use "skills" and "skillTags".
  const items: any[] = content?.items ?? [];
  const tags: string[] = content?.skillTags ?? [];

  // ── Variant: "grid" ──
  if (variant === "grid") {
    return (
      <section id={anchorName} style={{ background: sectionBg }}>
        <Container className="py-16">
          <div className="mb-12 text-center">
            <h3
              className="text-3xl font-bold"
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("heading", e.currentTarget.textContent?.trim())
              }
            >
              {content?.heading ?? "Skills & Expertise"}
            </h3>
            <p
              className="mt-4 text-base"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("subheading", e.currentTarget.textContent?.trim())
              }
            >
              {content?.subheading ??
                "Technologies and tools I use to bring ideas to life."}
            </p>
          </div>
          <div
            className="rounded-3xl p-6"
            style={{
              background: isEven ? "var(--qs-bg-alt)" : "var(--qs-bg)",
              border: "1px solid var(--qs-border)",
            }}
          >
            <div className="flex flex-col gap-5">
              {items.map((skill: any, i: number) => (
                <div key={i} className="flex">
                  <div className="w-full">
                    <div className="mb-2 flex justify-between text-sm">
                      <span
                        className="font-medium"
                        contentEditable={isEditor}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newSkills = [...items];
                          newSkills[i].name =
                            e.currentTarget.textContent?.trim() || skill.name;
                          onUpdate("items", newSkills);
                        }}
                      >
                        {skill.name}
                      </span>
                      <span>
                        {isEditor ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="font-medium w-14 bg-transparent border-b border-primary focus:outline-none text-right"
                            value={skill.level}
                            onChange={(e) => {
                              const newSkills = [...items];
                              const val = Math.max(
                                0,
                                Math.min(
                                  100,
                                  parseInt(e.target.value, 10) || 0,
                                ),
                              );
                              newSkills[i].level = val;
                              onUpdate("items", newSkills);
                            }}
                          />
                        ) : (
                          <span className="font-medium">{skill.level}</span>
                        )}
                        %
                      </span>
                    </div>
                    <div
                      className="h-2 w-full overflow-hidden rounded-full"
                      style={{ background: "var(--qs-border)" }}
                    >
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${skill.level}%`,
                          background: "var(--qs-primary)",
                        }}
                      />
                    </div>
                  </div>
                  {isEditor && (
                    <Xbutton
                      onClick={() => {
                        const newSkills = [...items];
                        newSkills.splice(i, 1);
                        onUpdate("items", newSkills);
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            {isEditor && (
              <AddButton
                onClick={() => {
                  const newSkills = [
                    ...items,
                    { name: "New Skill", level: 50 },
                  ];
                  onUpdate("items", newSkills);
                }}
              >
                Add Skill
              </AddButton>
            )}
          </div>
        </Container>
      </section>
    );
  }

  // ── Variant: "tags" ──
  if (variant === "tags") {
    return (
      <section
        id={anchorName}
        style={{ background: sectionBg }}
        className="relative"
      >
        <Container className="py-20">
          {/* Header */}
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h3
              className="text-3xl @md:text-4xl font-bold tracking-tight"
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("heading", e.currentTarget.textContent?.trim())
              }
            >
              {content?.heading ?? "Skills & Expertise"}
            </h3>

            <p
              className="mt-3 text-sm @md:text-base opacity-70 leading-relaxed"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("subheading", e.currentTarget.textContent?.trim())
              }
            >
              {content?.subheading ?? "Technologies and tools I work with"}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-3 @md:gap-4">
            {tags.map((tag: string, i: number) => (
              <div key={i} className="group relative">
                <span
                  className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium
                border transition-all duration-200
                hover:scale-[1.05] hover:shadow-md active:scale-95
                backdrop-blur-sm"
                  style={{
                    background:
                      i % 2 === 0 ? "var(--qs-bg-alt)" : "var(--qs-bg)",
                    border: "1px solid var(--qs-border)",
                  }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newTags = [...tags];
                    newTags[i] = e.currentTarget.textContent?.trim() || tag;
                    onUpdate("skillTags", newTags);
                  }}
                >
                  {tag}
                </span>

                {/* delete button (editor only) */}
                {isEditor && (
                  <button
                    onClick={() => {
                      const newTags = [...tags];
                      newTags.splice(i, 1);
                      onUpdate("skillTags", newTags);
                    }}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100
                  transition bg-red-500 text-white text-xs w-5 h-5 rounded-full
                  flex items-center justify-center shadow"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add button */}
          {isEditor && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => onUpdate("skillTags", [...tags, "New Skill"])}
                className="px-5 py-2 rounded-full border border-dashed
              text-sm opacity-70 hover:opacity-100 hover:scale-105
              transition"
              >
                + Add Skill
              </button>
            </div>
          )}
        </Container>
      </section>
    );
  }

  // ── Variant: "icons-list" ──
  return (
    <section id={anchorName} style={{ background: sectionBg }}>
      <Container className="py-20">
        {/* Header */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <h3
            className="text-3xl @md:text-4xl font-bold tracking-tight"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("heading", e.currentTarget.textContent?.trim())
            }
          >
            {content?.heading ?? "Skills & Expertise"}
          </h3>

          <p
            className="mt-4 text-base opacity-70 leading-relaxed"
            style={{ color: "var(--qs-text-muted)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("subheading", e.currentTarget.textContent?.trim())
            }
          >
            {content?.subheading ??
              "Technologies and tools I use to bring ideas to life."}
          </p>
        </div>

        {/* Grid */}
        <div className="grid @md:grid-cols-2 gap-6 @md:gap-8">
          {items.map((skill: any, i: number) => (
            <div
              key={i}
              className="group relative rounded-2xl border p-5 @md:p-6
            transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              style={{
                background: "var(--qs-card-bg)",
                border: "1px solid var(--qs-border)",
              }}
            >
              {/* Delete (editor only) */}
              {isEditor && (
                <button
                  onClick={() => {
                    const newSkills = [...items];
                    newSkills.splice(i, 1);
                    onUpdate("items", newSkills);
                  }}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100
                transition bg-red-500 text-white text-xs w-6 h-6 rounded-full
                flex items-center justify-center shadow"
                >
                  ×
                </button>
              )}

              <div className="flex gap-4 items-start">
                {/* Icon */}
                <div
                  className="text-3xl w-12 h-12 flex items-center justify-center
                rounded-xl border shrink-0"
                  style={{
                    border: "1px solid var(--qs-border)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newSkills = [...items];
                    newSkills[i].icon =
                      e.currentTarget.textContent?.trim() || skill.icon;
                    onUpdate("items", newSkills);
                  }}
                >
                  {skill.icon ?? "⚡"}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div
                    className="text-lg @md:text-xl font-semibold"
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newSkills = [...items];
                      newSkills[i].name =
                        e.currentTarget.textContent?.trim() || skill.name;
                      onUpdate("items", newSkills);
                    }}
                  >
                    {skill.name}
                  </div>

                  <div
                    className="text-sm mt-1 opacity-70 leading-relaxed"
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newSkills = [...items];
                      newSkills[i].desc =
                        e.currentTarget.textContent?.trim() || skill.desc;
                      onUpdate("items", newSkills);
                    }}
                  >
                    {skill.desc}
                  </div>

                  {/* Level */}
                  {typeof skill.level !== "undefined" && (
                    <div className="mt-4 flex items-center gap-3">
                      <div className="w-full h-2 rounded-full overflow-hidden bg-black/10">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${skill.level}%`,
                            background: "var(--qs-primary, #6366f1)",
                          }}
                        />
                      </div>

                      <div className="text-xs font-medium opacity-70 w-10 text-right">
                        {isEditor ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="w-12 bg-transparent border-b text-right outline-none"
                            value={skill.level}
                            onChange={(e) => {
                              const newSkills = [...items];
                              const val = Math.max(
                                0,
                                Math.min(
                                  100,
                                  parseInt(e.target.value, 10) || 0,
                                ),
                              );
                              newSkills[i].level = val;
                              onUpdate("items", newSkills);
                            }}
                          />
                        ) : (
                          skill.level
                        )}
                        %
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add */}
        {isEditor && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => {
                onUpdate("items", [
                  ...items,
                  { name: "New Skill", desc: "", icon: "⚡", level: 50 },
                ]);
              }}
              className="px-5 py-2 rounded-full border border-dashed
            text-sm opacity-70 hover:opacity-100 hover:scale-105 transition"
            >
              + Add Skill
            </button>
          </div>
        )}
      </Container>
    </section>
  );
};


export type SkillsSectionVariants = "grid" | "tags" | "icons-list"
export const SkillsVariantList: SkillsSectionVariants[] = ["grid", "tags", "icons-list"];