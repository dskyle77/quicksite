/* eslint-disable react-hooks/static-components */

import { SectionProps } from "../../types";
import TemplateImage from "@/components/shared/TemplateImage";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";
import Container from "@/components/shared/Container";
import EditableLinkButton from "@/components/shared/EditableLink";
import { LinkConfig } from "@/components/shared/EditableLink";

type ProjectItem = {
  title: string;
  desc: string;
  tags?: string[];
  image?: string;
  imagePId?: string;
  projectBtnLabel?: string;
  projectBtnLink?: LinkConfig;
};

export const ProjectsSection = ({
  variant,
  isEditor,
  content,
  onUpdate,
  position,
  anchorName,
  path,
}: SectionProps) => {
  const items: ProjectItem[] = content?.items || [];
  const isEven = position % 2 === 0;

  const sectionBg = isEven ? "var(--qs-bg)" : "var(--qs-bg-alt)";
  const cardBg = isEven ? "var(--qs-card-bg)" : "var(--qs-card-bg-alt)";

  const update = (next: ProjectItem[]) => onUpdate("items", next);

  const updateOne = (i: number, changes: Partial<ProjectItem>) => {
    const next = [...items];
    next[i] = { ...next[i], ...changes };
    update(next);
  };

  const remove = (i: number) => {
    const next = [...items];
    next.splice(i, 1);
    update(next);
  };

  const add = () => {
    update([
      ...items,
      {
        title: "New Project",
        desc: "Project description...",
        tags: ["React"],
        image:
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        projectBtnLabel: "View Project",
        projectBtnLink: { type: "url", url: "" },
      },
    ]);
  };

  const Header = () => (
    <div className="text-center mb-14">
      <h2
        className="text-4xl @md:text-5xl font-black tracking-tight"
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate("heading", e.currentTarget.textContent?.trim())}
      >
        {content?.heading ?? "Projects"}
      </h2>

      <p
        className="mt-5 max-w-2xl mx-auto text-lg opacity-70"
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) =>
          onUpdate("subheading", e.currentTarget.textContent?.trim())
        }
      >
        {content?.subheading ?? "Showcase of my recent work"}
      </p>
    </div>
  );

  const addTag = (i: number) => {
    updateOne(i, {
      tags: [...(items[i].tags || []), "New Tag"],
    });
  };

  const removeTag = (i: number, j: number) => {
    const next = [...(items[i].tags || [])];
    next.splice(j, 1);
    updateOne(i, { tags: next });
  };

  const updateTag = (i: number, j: number, value: string) => {
    const next = [...(items[i].tags || [])];
    next[j] = value;
    updateOne(i, { tags: next });
  };

  // ───────────────────────── LIST ─────────────────────────
  if (variant === "list") {
    return (
      <section id={anchorName} style={{ background: sectionBg }}>
        <Container className="py-24">
          <Header />

          <div className="space-y-12">
            {items.map((p, i) => (
              <div
                key={i}
                className="relative grid @md:grid-cols-2 gap-10 p-8 rounded-3xl border transition"
                style={{
                  background: cardBg,
                  border: "1px solid var(--qs-border)",
                }}
              >
                {isEditor && (
                  <div className="absolute top-4 right-4">
                    <Xbutton onClick={() => remove(i)} color="red" />
                  </div>
                )}

                <div className="rounded-2xl overflow-hidden">
                  <TemplateImage
                    source={p.image}
                    path={path + `.items.${i}.image`}
                    isEditor={isEditor}
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <h3
                    className="text-3xl font-bold"
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateOne(i, {
                        title: e.currentTarget.textContent?.trim(),
                      })
                    }
                  >
                    {p.title}
                  </h3>

                  <p
                    className="mt-4 opacity-70 leading-7"
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateOne(i, {
                        desc: e.currentTarget.textContent?.trim(),
                      })
                    }
                  >
                    {p.desc}
                  </p>

                  {!!p.tags?.length && (
                    <div className="mt-5 flex flex-wrap gap-2 items-center">
                      {p.tags.map((t, j) => (
                        <div key={j} className="flex items-center gap-1">
                          <span
                            className="px-3 py-1 text-xs rounded-full border outline-none"
                            contentEditable={isEditor}
                            suppressContentEditableWarning
                            style={{
                              background: "var(--qs-bg)",
                              border: "1px solid var(--qs-border)",
                            }}
                            onBlur={(e) =>
                              updateTag(
                                i,
                                j,
                                e.currentTarget.textContent?.trim() || t,
                              )
                            }
                          >
                            {t}
                          </span>

                          {isEditor && (
                            <button
                              onClick={() => removeTag(i, j)}
                              className="w-5 h-5 text-xs rounded-full bg-red-500 text-white flex items-center justify-center"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}

                      {isEditor && (
                        <button
                          onClick={() => addTag(i)}
                          className="px-3 py-1 text-xs rounded-full border border-dashed opacity-70 hover:opacity-100 transition"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  )}

                  <div className="mt-7">
                    <EditableLinkButton
                      isEditor={isEditor}
                      label={p.projectBtnLabel ?? "View Project"}
                      linkConfig={p.projectBtnLink}
                      onLabelChange={(v) =>
                        updateOne(i, { projectBtnLabel: v })
                      }
                      onLinkChange={(cfg) =>
                        updateOne(i, { projectBtnLink: cfg })
                      }
                      className="rounded-lg px-4 py-2 font-semibold transition-transform hover:scale-[1.02]"
                      style={{
                        background: "var(--qs-primary)",
                        color: "var(--qs-primary-fg)",
                        marginTop: 0,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isEditor && (
            <div className="mt-12 flex justify-center">
              <AddButton onClick={add}>Add Project</AddButton>
            </div>
          )}
        </Container>
      </section>
    );
  }

  // ───────────────────────── GRID ─────────────────────────
  return (
    <section id={anchorName} style={{ background: sectionBg }}>
      <Container className="py-24">
        <Header />

        <div className="grid @md:grid-cols-2 @xl:grid-cols-3 gap-8">
          {items.map((p, i) => (
            <div
              key={i}
              className="relative rounded-3xl border overflow-hidden hover:-translate-y-1 transition"
              style={{
                background: cardBg,
                border: "1px solid var(--qs-border)",
              }}
            >
              {isEditor && (
                <div className="absolute top-3 right-3 z-10">
                  <Xbutton onClick={() => remove(i)} color="red" />
                </div>
              )}

              <TemplateImage
                source={p.image}
                isEditor={isEditor}
                path={path + `.items.${i}.image`}
              />

              <div className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-bold">{p.title}</h3>

                <p className="mt-3 text-sm opacity-70">{p.desc}</p>

                {!!p.tags?.length && (
                  <div className="mt-5 flex flex-wrap gap-2 items-center">
                    {p.tags.map((t, j) => (
                      <div key={j} className="flex items-center gap-1">
                        <span
                          className="px-3 py-1 text-xs rounded-full border outline-none"
                          contentEditable={isEditor}
                          suppressContentEditableWarning
                          style={{
                            background: "var(--qs-bg)",
                            border: "1px solid var(--qs-border)",
                          }}
                          onBlur={(e) =>
                            updateTag(
                              i,
                              j,
                              e.currentTarget.textContent?.trim() || t,
                            )
                          }
                        >
                          {t}
                        </span>

                        {isEditor && (
                          <button
                            onClick={() => removeTag(i, j)}
                            className="w-5 h-5 text-xs rounded-full bg-red-500 text-white flex items-center justify-center"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}

                    {isEditor && (
                      <button
                        onClick={() => addTag(i)}
                        className="px-3 py-1 text-xs rounded-full border border-dashed opacity-70 hover:opacity-100 transition"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-7">
                  <EditableLinkButton
                    isEditor={isEditor}
                    label={p.projectBtnLabel ?? "View Project"}
                    linkConfig={p.projectBtnLink}
                    onLabelChange={(v) => updateOne(i, { projectBtnLabel: v })}
                    onLinkChange={(cfg) =>
                      updateOne(i, { projectBtnLink: cfg })
                    }
                    className="rounded-lg px-4 py-2 font-semibold transition-transform hover:scale-[1.02]"
                    style={{
                      background: "var(--qs-primary)",
                      color: "var(--qs-primary-fg)",
                      marginTop: 0,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {isEditor && (
          <div className="mt-12 flex justify-center">
            <AddButton onClick={add}>Add Project</AddButton>
          </div>
        )}
      </Container>
    </section>
  );
};
