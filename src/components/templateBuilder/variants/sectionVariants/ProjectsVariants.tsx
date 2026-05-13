/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { SectionProps } from "../../types";
import TemplateImage from "@/components/shared/TemplateImage";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";

type ProjectItem = {
  title: string;
  desc: string;
  tags?: string[];
  image?: string;
  imagePId?: string;
  previewLink?: string;
};

export const ProjectsSection = ({
  variant,
  isEditor,
  content,
  onUpdate,
  position,
}: SectionProps) => {
  const heading = content?.heading;
  const subheading = content?.subheading;

  const items: ProjectItem[] = content?.items || [];

  const isEven = position % 2 === 0;

  const sectionBg = isEven
    ? "linear-gradient(135deg, var(--qs-bg) 0%, var(--qs-bg-alt) 100%)"
    : "linear-gradient(135deg, var(--qs-bg-alt) 0%, var(--qs-bg) 100%)";

  const cardBg = isEven ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)";

  const updateProjects = (next: ProjectItem[]) => {
    onUpdate("items", next);
  };

  const handleDelete = (idx: number) => {
    const next = [...items];
    next.splice(idx, 1);
    updateProjects(next);
  };

  const handleAdd = () => {
    updateProjects([
      ...items,
      {
        title: "New Project",
        desc: "Project description goes here.",
        tags: ["React"],
        image:
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        previewLink: "",
      },
    ]);
  };

  const updateProject = (idx: number, key: keyof ProjectItem, value: any) => {
    const next = [...items];

    next[idx] = {
      ...next[idx],
      [key]: value,
    };

    updateProjects(next);
  };

  const SectionHeader = () => (
    <div className="mb-14 text-center">
      <h2
        className="text-4xl md:text-5xl font-black tracking-tight"
        style={{ color: "var(--qs-text)" }}
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) =>
          onUpdate("heading", e.currentTarget.textContent?.trim())
        }
      >
        {heading ?? "Projects"}
      </h2>

        <p
          className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed"
          style={{ color: "var(--qs-text-muted)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("subheading", e.currentTarget.textContent?.trim())
          }
        >
          {subheading ?? "Add a short subheading here"}
     
        </p>
    </div>
  );

  // ─────────────────────────────────────────────
  // LIST VARIANT
  // ─────────────────────────────────────────────

  if (variant === "list") {
    return (
      <section
        className="py-24"
        style={{ background: sectionBg }}
        id="projects"
      >
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader />

          <div className="space-y-14">
            {items.map((proj, i) => (
              <div
                key={i}
                className="relative grid gap-10 rounded-[32px] border p-6 md:grid-cols-2 md:p-8"
                style={{
                  background: cardBg,
                  border: "1px solid var(--qs-border)",
                }}
              >
                {isEditor && (
                  <div className="absolute top-4 right-4 z-20">
                    <Xbutton onClick={() => handleDelete(i)} color="red" />
                  </div>
                )}

                <div className="overflow-hidden rounded-3xl">
                  <TemplateImage
                    source={proj.image}
                    publicId={proj.imagePId}
                    isEditor={isEditor}
                    onImageChange={(url, pId) => {
                      updateProject(i, "image", url);
                      updateProject(i, "imagePId", pId);
                    }}
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <h3
                    className="text-3xl font-black"
                    style={{ color: "var(--qs-text)" }}
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateProject(
                        i,
                        "title",
                        e.currentTarget.textContent?.trim(),
                      )
                    }
                  >
                    {proj.title}
                  </h3>

                  <p
                    className="mt-5 text-lg leading-relaxed"
                    style={{ color: "var(--qs-text-muted)" }}
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateProject(
                        i,
                        "desc",
                        e.currentTarget.textContent?.trim(),
                      )
                    }
                  >
                    {proj.desc}
                  </p>

                  {/* Skills/tags editable add/remove section */}
                  {!!proj.tags?.length && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {proj.tags.map((tag, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <span
                            className="rounded-full px-4 py-2 text-sm font-medium"
                            style={{
                              background: "var(--qs-bg)",
                              border: "1px solid var(--qs-border)",
                              color: "var(--qs-text)",
                            }}
                            contentEditable={isEditor}
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const next = [...(proj.tags || [])];
                              next[j] =
                                e.currentTarget.textContent?.trim() ?? tag;
                              updateProject(i, "tags", next);
                            }}
                          >
                            {tag}
                          </span>
                          {isEditor && (
                            <Xbutton
                              onClick={() => {
                                const next = [...(proj.tags || [])];
                                next.splice(j, 1);
                                updateProject(i, "tags", next);
                              }}
                              color="red"
                            />
                          )}
                        </div>
                      ))}

                      {isEditor && (
                        <AddButton
                          onClick={() => {
                            updateProject(i, "tags", [
                              ...(proj.tags || []),
                              "New Tag",
                            ]);
                          }}
                        >
                          + Tag
                        </AddButton>
                      )}
                    </div>
                  )}
                  {/* Show add button even if no tags yet */}
                  {isEditor && (!proj.tags || proj.tags.length === 0) && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <AddButton
                        onClick={() => {
                          updateProject(i, "tags", [
                            ...(proj.tags || []),
                            "New Tag",
                          ]);
                        }}
                      >
                        + Tag
                      </AddButton>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isEditor && (
            <div className="mt-12 flex justify-center">
              <AddButton onClick={handleAdd}>Add Project</AddButton>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // CARD GRID VARIANT
  // ─────────────────────────────────────────────

  if (variant === "card-grid") {
    return (
      <section
        className="py-24"
        style={{ background: sectionBg }}
        id="projects"
      >
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader />

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {items.map((proj, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-[32px] border transition-all duration-300 hover:-translate-y-2"
                style={{
                  background: cardBg,
                  border: "1px solid var(--qs-border)",
                }}
              >
                {isEditor && (
                  <div className="absolute top-4 right-4 z-20">
                    <Xbutton onClick={() => handleDelete(i)} color="red" />
                  </div>
                )}

                <div className="overflow-hidden">
                  <TemplateImage
                    source={proj.image}
                    publicId={proj.imagePId}
                    isEditor={isEditor}
                    onImageChange={(url, pId) => {
                      updateProject(i, "image", url);
                      updateProject(i, "imagePId", pId);
                    }}
                  />
                </div>

                <div className="p-6">
                  <h3
                    className="text-2xl font-bold"
                    style={{ color: "var(--qs-text)" }}
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateProject(
                        i,
                        "title",
                        e.currentTarget.textContent?.trim(),
                      )
                    }
                  >
                    {proj.title}
                  </h3>

                  <p
                    className="mt-4 text-sm leading-7"
                    style={{ color: "var(--qs-text-muted)" }}
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateProject(
                        i,
                        "desc",
                        e.currentTarget.textContent?.trim(),
                      )
                    }
                  >
                    {proj.desc}
                  </p>

                  {!!proj.tags?.length && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {proj.tags.map((tag, j) => (
                        <div key={j} className="flex items-center gap-1">
                          <span
                            className="rounded-full px-3 py-1 text-xs font-semibold"
                            style={{
                              background: "var(--qs-bg)",
                              border: "1px solid var(--qs-border)",
                              color: "var(--qs-text)",
                            }}
                            contentEditable={isEditor}
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const next = [...(proj.tags || [])];

                              next[j] =
                                e.currentTarget.textContent?.trim() ?? tag;

                              updateProject(i, "tags", next);
                            }}
                          >
                            {tag}
                          </span>

                          {isEditor && (
                            <Xbutton
                              onClick={() => {
                                const next = [...(proj.tags || [])];

                                next.splice(j, 1);

                                updateProject(i, "tags", next);
                              }}
                              color="red"
                            />
                          )}
                        </div>
                      ))}

                      {isEditor && (
                        <AddButton
                          onClick={() => {
                            updateProject(i, "tags", [
                              ...(proj.tags || []),
                              "New Tag",
                            ]);
                          }}
                        >
                          + Tag
                        </AddButton>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isEditor && (
            <div className="mt-12 flex justify-center">
              <AddButton onClick={handleAdd}>Add Project</AddButton>
            </div>
          )}
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────
  // MASONRY VARIANT
  // ─────────────────────────────────────────────

  return (
    <section className="py-24" style={{ background: sectionBg }} id="projects">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader />

        <div className="columns-1 gap-8 space-y-8 md:columns-2 xl:columns-3">
          {items.map((proj, i) => (
            <div
              key={i}
              className="relative mb-8 break-inside-avoid overflow-hidden rounded-[32px] border"
              style={{
                background: cardBg,
                border: "1px solid var(--qs-border)",
              }}
            >
              {isEditor && (
                <div className="absolute top-4 right-4 z-20">
                  <Xbutton onClick={() => handleDelete(i)} color="red" />
                </div>
              )}

              <TemplateImage
                source={proj.image}
                publicId={proj.imagePId}
                isEditor={isEditor}
                onImageChange={(url, pId) => {
                  updateProject(i, "image", url);
                  updateProject(i, "imagePId", pId);
                }}
              />

              <div className="p-6">
                <h3
                  className="text-2xl font-bold"
                  style={{ color: "var(--qs-text)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    updateProject(
                      i,
                      "title",
                      e.currentTarget.textContent?.trim(),
                    )
                  }
                >
                  {proj.title}
                </h3>

                <p
                  className="mt-4 text-sm leading-7"
                  style={{ color: "var(--qs-text-muted)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    updateProject(
                      i,
                      "desc",
                      e.currentTarget.textContent?.trim(),
                    )
                  }
                >
                  {proj.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {isEditor && (
          <div className="mt-12 flex justify-center">
            <AddButton onClick={handleAdd}>Add Project</AddButton>
          </div>
        )}
      </div>
    </section>
  );
};
