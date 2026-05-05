/* eslint-disable @typescript-eslint/no-explicit-any */
import { TemplateProps, TemplateComponentProps } from "@/lib/templates";
import { Navbar, Footer } from "./layout";
import TemplateImage from "@/components/shared/TemplateImage";
import CtaLink from "@/components/shared/CtaLinkModal";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";

function Hero({ isEditor, content, onUpdate }: TemplateComponentProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <div
            className="mb-5 inline-flex rounded-full px-4 py-2 text-sm font-medium"
            style={{
              background: "var(--qs-bg-alt)",
              border: "1px solid var(--qs-border)",
              color: "var(--qs-text-muted)",
            }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("hero.badge", e.currentTarget.textContent?.trim())
            }
          >
            {content?.hero?.badge ?? "👋 Available for Work"}
          </div>

          <h2
            className="max-w-xl text-4xl font-bold tracking-tight md:text-6xl"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("hero.title", e.currentTarget.textContent?.trim())
            }
          >
            {content?.hero?.title ?? "Hi, I'm Alex — Creative Developer"}
          </h2>

          <p
            className="mt-6 max-w-xl text-base leading-7 md:text-lg"
            style={{ color: "var(--qs-text-muted)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("hero.desc", e.currentTarget.textContent?.trim())
            }
          >
            {content?.hero?.desc ??
              "I craft beautiful digital experiences — from sleek web apps to polished mobile products. Let's build something extraordinary together."}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <CtaLink
              isEditor={isEditor}
              label={content?.hero?.primaryButton ?? "View My Work"}
              linkConfig={content?.hero?.primaryButtonLink}
              onLabelChange={(v) => onUpdate("hero.primaryButton", v)}
              onLinkChange={(cfg) => onUpdate("hero.primaryButtonLink", cfg)}
              className="rounded-xl px-6 py-3 font-semibold transition-transform hover:scale-[1.02] inline-block"
              style={{
                background: "var(--qs-primary)",
                color: "var(--qs-primary-fg)",
              }}
            />

            <CtaLink
              isEditor={isEditor}
              label={content?.hero?.secondaryButton ?? "Download CV"}
              linkConfig={content?.hero?.secondaryButtonLink}
              onLabelChange={(v) => onUpdate("hero.secondaryButton", v)}
              onLinkChange={(cfg) => onUpdate("hero.secondaryButtonLink", cfg)}
              className="rounded-xl px-6 py-3 font-semibold transition-transform hover:scale-[1.02] inline-block"
              style={{
                background: "var(--qs-bg-alt)",
                color: "var(--qs-text)",
                border: "1px solid var(--qs-border)",
              }}
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <span style={{ color: "var(--qs-text-muted)" }}>
              ✓ 3+ Years Experience
            </span>
            <span style={{ color: "var(--qs-text-muted)" }}>
              ✓ 20+ Projects Delivered
            </span>
            <span style={{ color: "var(--qs-text-muted)" }}>
              ✓ Open to Remote
            </span>
          </div>
        </div>

        <div className="relative">
          <TemplateImage
            source={content.hero.image1}
            publicId={content?.hero?.image1PId}
            isEditor={isEditor}
            onImageChange={(url, publicId) => {
              onUpdate("hero", {
                ...content.hero,
                image1: url,
                image1PId: publicId,
              });
            }}
          />
        </div>
      </div>
    </section>
  );
}

function About({ isEditor, content, onUpdate }: TemplateComponentProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16" id="about">
      <div
        className="rounded-3xl p-8 md:p-12"
        style={{
          background: "var(--qs-bg-alt)",
          border: "1px solid var(--qs-border)",
        }}
      >
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative">
            <TemplateImage
              source={content?.about?.image1}
              publicId={content?.about?.image1PId}
              isEditor={isEditor}
              onImageChange={(url, publicId) => {
                onUpdate("about", {
                  ...content.about,
                  image1: url,
                  image1PId: publicId,
                });
              }}
            />
          </div>

          <div>
            <p
              className="mb-3 text-sm font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("about.label", e.currentTarget.textContent?.trim())
              }
            >
              {content?.about?.label ?? "About Me"}
            </p>

            <h3
              className="text-3xl font-bold tracking-tight md:text-4xl"
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("about.title", e.currentTarget.textContent?.trim())
              }
            >
              {content?.about?.title ?? "Turning Ideas Into Reality"}
            </h3>

            <p
              className="mt-4 leading-7"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("about.desc", e.currentTarget.textContent?.trim())
              }
            >
              {content?.about?.desc ??
                "I'm a passionate full-stack developer with a love for clean code and thoughtful design. With experience across a wide range of industries, I bring both technical depth and creative thinking to every project."}
            </p>

            <p
              className="mt-3 leading-7"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("about.desc2", e.currentTarget.textContent?.trim())
              }
            >
              {content?.about?.desc2 ??
                "When I'm not coding, you'll find me exploring new technologies, contributing to open source, or enjoying a great cup of coffee."}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                {
                  label: content?.about?.stat1Label ?? "Projects Done",
                  value: content?.about?.stat1Value ?? "20+",
                },
                {
                  label: content?.about?.stat2Label ?? "Happy Clients",
                  value: content?.about?.stat2Value ?? "15+",
                },
                {
                  label: content?.about?.stat3Label ?? "Years Experience",
                  value: content?.about?.stat3Value ?? "3+",
                },
                {
                  label: content?.about?.stat4Label ?? "Awards",
                  value: content?.about?.stat4Value ?? "5",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4"
                  style={{
                    background: "var(--qs-bg)",
                    border: "1px solid var(--qs-border)",
                  }}
                >
                  <div
                    className="text-2xl font-bold"
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdate(
                        `about.stat${i + 1}Value`,
                        e.currentTarget.textContent?.trim(),
                      )
                    }
                  >
                    {item.value}
                  </div>
                  <div
                    className="mt-1 text-xs"
                    style={{ color: "var(--qs-text-muted)" }}
                    contentEditable={isEditor}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      onUpdate(
                        `about.stat${i + 1}Label`,
                        e.currentTarget.textContent?.trim(),
                      )
                    }
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const skills = content?.skills ?? [
    { name: "React / Next.js", level: "95" },
    { name: "TypeScript", level: "90" },
    { name: "Node.js", level: "85" },
    { name: "UI/UX Design", level: "80" },
    { name: "PostgreSQL", level: "75" },
    { name: "DevOps / Docker", level: "70" },
  ];

  const tags = content?.skillTags ?? [
    "JavaScript",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Tailwind CSS",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "Git",
    "Figma",
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16" id="skills">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h3
          className="text-3xl font-bold tracking-tight md:text-4xl"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("skillsHeading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.skillsHeading ?? "Skills & Expertise"}
        </h3>
        <p
          className="mt-4 text-base"
          style={{ color: "var(--qs-text-muted)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("skillsSubheading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.skillsSubheading ??
            "Technologies and tools I use to bring ideas to life."}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div
          className="rounded-3xl p-6"
          style={{
            background: "var(--qs-bg-alt)",
            border: "1px solid var(--qs-border)",
          }}
        >
          <div className="flex flex-col gap-5">
            {skills.map((skill: any, i: number) => (
              <div key={i} className="flex">
                <div className="w-full">
                  <div className="mb-2 flex justify-between text-sm">
                    <span
                      className="font-medium"
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newSkills = [...skills];
                        newSkills[i].name =
                          e.currentTarget.textContent?.trim() || skill.name;
                        onUpdate("skills", newSkills);
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
                            const newSkills = [...skills];
                            const val = Math.max(
                              0,
                              Math.min(100, parseInt(e.target.value, 10) || 0),
                            );
                            newSkills[i].level = val;
                            onUpdate("skills", newSkills);
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
                      const newSkills = [...skills];
                      newSkills.splice(i, 1);
                      onUpdate("skills", newSkills);
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {isEditor && (
            <AddButton
              onClick={() => {
                const newSkills = [...skills, { name: "New Skill", level: 50 }];
                onUpdate("skills", newSkills);
              }}
            >
              Add Skill
            </AddButton>
          )}
        </div>

        <div
          className="rounded-3xl p-6"
          style={{
            background: "var(--qs-bg-alt)",
            border: "1px solid var(--qs-border)",
          }}
        >
          <p
            className="mb-4 text-sm font-medium uppercase tracking-[0.15em]"
            style={{ color: "var(--qs-text-muted)" }}
          >
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-4">
            {tags.map((tag: string, i: number) => (
              <div key={i} className="flex items-center gap-1">
                <span
                  className="rounded-xl px-3 py-2 text-sm font-medium"
                  style={{
                    background: "var(--qs-bg)",
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
        </div>
      </div>
    </section>
  );
}

function Projects({
  isEditor,
  content,
  onUpdate,
  slugs,
}: TemplateComponentProps) {
  const projects = content?.pages?.projects ?? [];
  const projectsCount = content?.projectsCount ?? 3;
  const toDisplay = projects.slice(0, projectsCount);

  const slug = slugs?.slug;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3
            className="text-3xl font-bold tracking-tight md:text-4xl"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("projectsHeading", e.currentTarget.textContent?.trim())
            }
          >
            {content?.projectsHeading ?? "Featured Projects"}
          </h3>
          <p
            className="mt-2 text-base"
            style={{ color: "var(--qs-text-muted)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate(
                "projectsSubheading",
                e.currentTarget.textContent?.trim(),
              )
            }
          >
            {content?.projectsSubheading ?? "A selection of work I'm proud of."}
          </p>
          {isEditor && (
            <div className="mt-3 flex items-center gap-2">
              <label
                htmlFor="home-project-count"
                className="text-xs font-medium"
                style={{ color: "var(--qs-text-muted)" }}
              >
                Show
              </label>
              <input
                id="home-project-count"
                type="number"
                min={1}
                max={projects.length || 1}
                value={projectsCount}
                onChange={(e) => {
                  const value = e.target.value;
                  onUpdate("projectsCount", value);
                }}
                onBlur={(e) => {
                  const value = Math.max(
                    1,
                    Math.min(Number(e.target.value), projects.length || 1),
                  );
                  onUpdate("projectsCount", value);
                }}
                className="w-14 rounded border px-2 py-1 text-xs"
                style={{
                  border: "1px solid var(--qs-border)",
                  background: "var(--qs-bg)",
                  color: "var(--qs-text)",
                }}
              />
              <span
                className="text-xs"
                style={{ color: "var(--qs-text-muted)" }}
              >
                project{projectsCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <a
          href={`/${isEditor ? "editor" : "s"}/${slug}/projects`}
          className="rounded-xl px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-70 inline-block"
          style={{
            background: "var(--qs-bg-alt)",
            color: "var(--qs-text)",
            border: "1px solid var(--qs-border)",
          }}
        >
          All projects →
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {toDisplay.map((project: any, i: number) => (
          <div
            key={i}
            className="group overflow-hidden rounded-3xl transition-transform hover:-translate-y-1"
            style={{
              background: "var(--qs-bg-alt)",
              border: "1px solid var(--qs-border)",
            }}
          >
            <div className="overflow-hidden">
              <TemplateImage
                source={project.image}
                publicId={project.imagePId}
                isEditor={false}
              />
            </div>

            <div className="p-5">
              <h4 className="text-lg font-semibold">{project.title}</h4>

              <p
                className="mt-2 text-sm leading-6"
                style={{ color: "var(--qs-text-muted)" }}
              >
                {project.desc}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag: string, j: number) => (
                  <span
                    key={j}
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      background: "var(--qs-bg)",
                      border: "1px solid var(--qs-border)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const experiences = content?.experience ?? [
    {
      role: "Senior Frontend Developer",
      company: "TechVenture Inc.",
      period: "2022 – Present",
      desc: "Led the redesign of the core product UI, improving user engagement by 40%. Mentored junior developers and established frontend architecture standards.",
    },
    {
      role: "Full Stack Developer",
      company: "Digital Agency Co.",
      period: "2020 – 2022",
      desc: "Delivered 10+ client projects across fintech, e-commerce, and SaaS verticals. Built RESTful APIs and responsive web applications.",
    },
    {
      role: "Junior Developer",
      company: "Startup Studio",
      period: "2019 – 2020",
      desc: "Contributed to MVP development for three early-stage startups. Gained hands-on experience in agile workflows and rapid prototyping.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h3
          className="text-3xl font-bold tracking-tight md:text-4xl"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("experienceHeading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.experienceHeading ?? "Work Experience"}
        </h3>
        <p
          className="mt-4 text-base"
          style={{ color: "var(--qs-text-muted)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate(
              "experienceSubheading",
              e.currentTarget.textContent?.trim(),
            )
          }
        >
          {content?.experienceSubheading ??
            "My professional journey and the impact I've made along the way."}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {experiences.map((exp: any, i: number) => (
          <div
            key={i}
            className="rounded-3xl p-6 transition-transform hover:-translate-y-[2px] md:p-8"
            style={{
              background: "var(--qs-bg-alt)",
              border: "1px solid var(--qs-border)",
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h4
                  className="text-lg font-semibold"
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newExp = [...experiences];
                    newExp[i].role =
                      e.currentTarget.textContent?.trim() || exp.role;
                    onUpdate("experience", newExp);
                  }}
                >
                  {exp.role}
                </h4>
                <p
                  className="mt-1 text-sm font-medium"
                  style={{ color: "var(--qs-primary)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newExp = [...experiences];
                    newExp[i].company =
                      e.currentTarget.textContent?.trim() || exp.company;
                    onUpdate("experience", newExp);
                  }}
                >
                  {exp.company}
                </p>
              </div>

              <span
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  background: "var(--qs-bg)",
                  border: "1px solid var(--qs-border)",
                  color: "var(--qs-text-muted)",
                }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newExp = [...experiences];
                  newExp[i].period =
                    e.currentTarget.textContent?.trim() || exp.period;
                  onUpdate("experience", newExp);
                }}
              >
                {exp.period}
              </span>
            </div>

            <p
              className="mt-4 text-sm leading-7"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newExp = [...experiences];
                newExp[i].desc =
                  e.currentTarget.textContent?.trim() || exp.desc;
                onUpdate("experience", newExp);
              }}
            >
              {exp.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const testimonials = content?.testimonials ?? [
    {
      quote:
        "Alex delivered an exceptional product — clean code, beautiful UI, and shipped ahead of schedule. Would hire again without hesitation.",
      name: "Sarah Johnson",
      role: "CEO, TechStart",
    },
    {
      quote:
        "Working with Alex was a game-changer. He understood our vision immediately and turned it into a product our users love.",
      name: "Michael Chen",
      role: "Founder, Creative Studio",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h3
          className="text-3xl font-bold tracking-tight md:text-4xl"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("testimonialsHeading", e.currentTarget.textContent?.trim())
          }
        >
          {content?.testimonialsHeading ?? "Kind Words"}
        </h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((item: any, i: number) => (
          <blockquote
            key={i}
            className="rounded-3xl p-6"
            style={{
              background: "var(--qs-bg-alt)",
              border: "1px solid var(--qs-border)",
            }}
          >
            <div
              className="mb-4 text-2xl"
              style={{ color: "var(--qs-primary)" }}
            >
              ❝
            </div>
            <p
              className="text-lg leading-8"
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate(
                  `testimonials.${i}.quote`,
                  e.currentTarget.textContent?.trim(),
                )
              }
            >
              {item.quote}
            </p>
            <footer className="mt-5 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  background: "var(--qs-primary)",
                  color: "var(--qs-primary-fg)",
                }}
              >
                {item.name?.[0] ?? "A"}
              </div>
              <div>
                <div
                  className="font-semibold"
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdate(
                      `testimonials.${i}.name`,
                      e.currentTarget.textContent?.trim(),
                    )
                  }
                >
                  {item.name}
                </div>
                <div
                  className="text-sm"
                  style={{ color: "var(--qs-text-muted)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    onUpdate(
                      `testimonials.${i}.role`,
                      e.currentTarget.textContent?.trim(),
                    )
                  }
                >
                  {item.role}
                </div>
              </div>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function Contact({ isEditor, content, onUpdate }: TemplateComponentProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20" id="contact">
      <div
        className="rounded-4xl px-6 py-12 text-center md:px-10"
        style={{
          background: "var(--qs-primary)",
          color: "var(--qs-primary-fg)",
        }}
      >
        <div className="mx-auto mb-2 text-4xl">🤝</div>

        <h3
          className="text-3xl font-bold tracking-tight md:text-5xl"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("contact.title", e.currentTarget.textContent?.trim())
          }
        >
          {content?.contact?.title ?? "Let's Work Together"}
        </h3>

        <p
          className="mx-auto mt-4 max-w-2xl text-base md:text-lg"
          style={{ opacity: 0.92 }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate("contact.desc", e.currentTarget.textContent?.trim())
          }
        >
          {content?.contact?.desc ??
            "Have a project in mind? I'd love to hear about it. Let's chat and see how I can help."}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <CtaLink
            isEditor={isEditor}
            label={content?.contact?.primaryButton ?? "Send a Message"}
            linkConfig={content?.contact?.primaryButtonLink}
            onLabelChange={(v) => onUpdate("contact.primaryButton", v)}
            onLinkChange={(cfg) => onUpdate("contact.primaryButtonLink", cfg)}
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition-transform hover:scale-[1.02] inline-block"
          />

          <CtaLink
            isEditor={isEditor}
            label={content?.contact?.secondaryButton ?? "Schedule a Call"}
            linkConfig={content?.contact?.secondaryButtonLink}
            onLabelChange={(v) => onUpdate("contact.secondaryButton", v)}
            onLinkChange={(cfg) => onUpdate("contact.secondaryButtonLink", cfg)}
            className="rounded-xl px-6 py-3 font-semibold transition-transform hover:scale-[1.02] inline-block"
            style={{
              background: "transparent",
              color: "var(--qs-primary-fg)",
              border: "2px solid var(--qs-primary-fg)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default function Home({
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
      <Hero isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <About isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <Skills isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <Projects
        isEditor={isEditor}
        content={content}
        onUpdate={handleUpdate}
        slugs={slugs}
      />
      <Experience
        isEditor={isEditor}
        content={content}
        onUpdate={handleUpdate}
      />
      <Testimonials
        isEditor={isEditor}
        content={content}
        onUpdate={handleUpdate}
      />
      <Contact isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <Footer isEditor={isEditor} content={content} onUpdate={handleUpdate} />
    </>
  );
}
