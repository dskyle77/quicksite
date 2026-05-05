/* eslint-disable @typescript-eslint/no-explicit-any */
import { TemplateProps, TemplateComponentProps } from "@/lib/templates";

import TemplateImage from "@/components/shared/TemplateImage";
import { Navbar, Footer } from "./layout";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";

export default function ProjectsSubPage({
  isEditor,
  content,
  onUpdate,
  slugs,
}: TemplateProps) {
  const handleUpdate = (path: string, value: any) => {
    if (onUpdate) onUpdate(path, value);
  };
  return (
    <>
      <Navbar
        isEditor={isEditor}
        content={content}
        onUpdate={handleUpdate}
        slugs={slugs}
      />
      <Projects isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <Footer isEditor={isEditor} content={content} onUpdate={handleUpdate} />
    </>
  );
}
function Projects({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const projects = content?.pages?.projects ?? [];

  const handleDeleteProject = (indexToDelete: number) => {
    const newProjects = [...projects];
    newProjects.splice(indexToDelete, 1);
    onUpdate("pages.projects", newProjects);
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3
            className="text-3xl font-bold tracking-tight md:text-4xl"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate(
                "pages.projectsHeading",
                e.currentTarget.textContent?.trim(),
              )
            }
          >
            {content?.pages?.projectsHeading ?? "Featured Projects"}
          </h3>
          <p
            className="mt-2 text-base"
            style={{ color: "var(--qs-text-muted)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate(
                "pages.projectsSubheading",
                e.currentTarget.textContent?.trim(),
              )
            }
          >
            {content?.pages?.projectsSubheading ??
              "A selection of work I'm proud of."}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((project: any, i: number) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-3xl transition-transform hover:-translate-y-1"
            style={{
              background: "var(--qs-bg-alt)",
              border: "1px solid var(--qs-border)",
            }}
          >
            {/* Xbutton for deleting project */}
            {isEditor && (
              <div className="absolute top-3 right-3 z-10">
                <Xbutton
                  onClick={() => handleDeleteProject(i)}
                  className="bg-white/80 hover:bg-white shadow-lg"
                  color="red"
                />
              </div>
            )}

            <div className="overflow-hidden">
              <TemplateImage
                source={project.image}
                publicId={project.imagePId}
                isEditor={isEditor}
                onImageChange={(url, publicId) => {
                  const newProjects = [...projects];
                  newProjects[i] = {
                    ...newProjects[i],
                    image: url,
                    imagePId: publicId,
                  };
                  onUpdate("pages.projects", newProjects);
                }}
              />
            </div>

            <div className="p-5">
              <h4
                className="text-lg font-semibold"
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newProjects = [...projects];
                  newProjects[i].title =
                    e.currentTarget.textContent?.trim() || project.title;
                  onUpdate("pages.projects", newProjects);
                }}
              >
                {project.title}
              </h4>

              <p
                className="mt-2 text-sm leading-6"
                style={{ color: "var(--qs-text-muted)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newProjects = [...projects];
                  newProjects[i].desc =
                    e.currentTarget.textContent?.trim() || project.desc;
                  onUpdate("pages.projects", newProjects);
                }}
              >
                {project.desc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag: string, j: number) => (
                  <span key={j}>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        background: "var(--qs-bg)",
                        border: "1px solid var(--qs-border)",
                      }}
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newProjects = [...projects];
                        newProjects[i].tags[j] =
                          e.currentTarget.textContent?.trim() || tag;
                        onUpdate("pages.projects", newProjects);
                      }}
                    >
                      {tag}
                    </span>
                    {isEditor && (
                      <Xbutton
                        onClick={() => {
                          const newProjects = [...projects];
                          const projTags = [...(newProjects[i].tags || [])];
                          projTags.splice(j, 1);
                          newProjects[i].tags = projTags;
                          onUpdate("pages.projects", newProjects);
                        }}
                      />
                    )}
                  </span>
                ))}
                {isEditor && (
                  <AddButton
                    onClick={() => {
                      const newProjects = [...projects];
                      const projTags = [...(newProjects[i].tags || [])];
                      projTags.push("New Tag");
                      newProjects[i].tags = projTags;
                      onUpdate("pages.projects", newProjects);
                    }}
                  >
                    Add Tag
                  </AddButton>
                )}
              </div>
            </div>
          </div>
        ))}
        {isEditor && (
          <AddButton
            onClick={() => {
              const newProjects = [...projects];
              const newProject = {
                title: "New Project",
                desc: "New Project description",
                tags: ["tag1", "tag2", "tag3"],
                image:
                  "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777214672/image_wy9bs5.png",
                imagePId: "",
              };
              newProjects.push(newProject);
              onUpdate("pages.projects", newProjects);
            }}
          >
            Add Project
          </AddButton>
        )}
      </div>
    </section>
  );
}
