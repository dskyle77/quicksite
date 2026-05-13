/* eslint-disable @typescript-eslint/no-explicit-any */
import { SectionProps } from "../../types";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";

export const SkillsSection = ({
  variant,
  isEditor,
  content,
  onUpdate,
  position
}: SectionProps) => {
  // Use even/odd position to set section background
  const isEven = position % 2 === 0;
  const sectionBg = isEven
    ? "var(--qs-bg)"
    : "var(--qs-bg-alt)";
  // For compatibility with @file_context_0, use "skills" and "skillTags".
  const items: any[] = content?.items ?? [];
  const tags: string[] = content?.skillTags ?? [];

  // ── Variant: "grid" ──
  if (variant === "grid") {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16" id="skills" style={{ background: sectionBg }}>
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
            background: isEven ? "var(--qs-bg-alt)" : "var(--qs-bg)", // Inverse so both backgrounds alternate
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
                              Math.min(100, parseInt(e.target.value, 10) || 0),
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
                const newSkills = [...items, { name: "New Skill", level: 50 }];
                onUpdate("items", newSkills);
              }}
            >
              Add Skill
            </AddButton>
          )}
        </div>
      </section>
    );
  }

  // ── Variant: "tags" ──
  if (variant === "tags") {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16" id="skills" style={{ background: sectionBg }}>
        <div className="mb-10 text-center">
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
            className="mt-2 text-sm"
            style={{ color: "var(--qs-text-muted)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("subheading", e.currentTarget.textContent?.trim())
            }
          >
            {content?.subheading ?? ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          {tags.map((tag: string, i: number) => (
            <div key={i} className="flex items-center gap-1">
              <span
                className="rounded-xl px-3 py-2 text-sm font-medium"
                style={{
                  background: isEven ? "var(--qs-bg-alt)" : "var(--qs-bg)",
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
              {isEditor && (
                <Xbutton
                  onClick={() => {
                    const newTags = [...tags];
                    newTags.splice(i, 1);
                    onUpdate("skillTags", newTags);
                  }}
                />
              )}
            </div>
          ))}
        </div>
        {isEditor && (
          <AddButton
            onClick={() => {
              onUpdate("skillTags", [...tags, "New Tag"]);
            }}
          >
            Add Tag
          </AddButton>
        )}
      </section>
    );
  }

  // ── Variant: "icons-list" ──
  return (
    <section className="mx-auto max-w-6xl px-4 py-16" id="skills" style={{ background: sectionBg }}>
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
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
        {items.map((skill: any, i: number) => (
          <div key={i} className="flex gap-5 items-start">
            <div
              className="text-4xl shrink-0 w-12 flex items-center justify-center"
              contentEditable={isEditor}
              suppressContentEditableWarning
              style={{ minHeight: "2.5rem" }}
              onBlur={(e) => {
                const newSkills = [...items];
                newSkills[i].icon =
                  e.currentTarget.textContent?.trim() || skill.icon;
                onUpdate("items", newSkills);
              }}
            >
              {skill.icon ?? "⚡"}
            </div>
            <div className="flex-1">
              <div
                className="font-semibold text-xl"
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
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-sm"
                  style={{ color: "var(--qs-text-muted)" }}
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
                </span>
                {typeof skill.level !== "undefined" && (
                  <span
                    className="ml-2 flex items-center text-xs"
                    style={{ color: "var(--qs-text-muted)" }}
                  >
                    {isEditor ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="ml-0 w-12 bg-transparent border-b border-primary focus:outline-none text-right"
                        value={skill.level}
                        onChange={(e) => {
                          const newSkills = [...items];
                          const val = Math.max(
                            0,
                            Math.min(100, parseInt(e.target.value, 10) || 0),
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
                )}
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
              { name: "New Skill", desc: "", level: 50 },
            ];
            onUpdate("items", newSkills);
          }}
        >
          Add Skill
        </AddButton>
      )}
    </section>
  );
};
