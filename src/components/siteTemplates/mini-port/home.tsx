/* eslint-disable @typescript-eslint/no-explicit-any */
import { TemplateProps, TemplateComponentProps } from "@/lib/templates";
import { Navbar, Footer } from "./layout";
import TemplateImage from "@/components/shared/TemplateImage";
import CtaLink from "@/components/shared/CtaLinkModal";
import { AddButton, Xbutton } from "@/components/shared/ActionButtons";

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero({ isEditor, content, onUpdate }: TemplateComponentProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 md:pt-28 md:pb-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p
            className="text-sm font-medium uppercase tracking-[0.2em] mb-4"
            style={{ color: "var(--qs-primary)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate("hero.role", e.currentTarget.textContent?.trim())}
          >
            {content?.hero?.role ?? "Designer & Developer"}
          </p>

          <h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate("hero.name", e.currentTarget.textContent?.trim())}
          >
            {content?.hero?.name ?? "Jane Doe"}
          </h1>

          <p
            className="mt-5 text-base md:text-lg leading-7"
            style={{ color: "var(--qs-text-muted)" }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate("hero.tagline", e.currentTarget.textContent?.trim())}
          >
            {content?.hero?.tagline ?? "I craft clean, purposeful digital products that people enjoy using."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink
              isEditor={isEditor}
              label={content?.hero?.primaryButton ?? "See My Work"}
              linkConfig={content?.hero?.primaryButtonLink}
              onLabelChange={(v) => onUpdate("hero.primaryButton", v)}
              onLinkChange={(cfg) => onUpdate("hero.primaryButtonLink", cfg)}
              className="rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.02] inline-block"
              style={{ background: "var(--qs-primary)", color: "var(--qs-primary-fg)" }}
            />
            <CtaLink
              isEditor={isEditor}
              label={content?.hero?.secondaryButton ?? "Get in Touch"}
              linkConfig={content?.hero?.secondaryButtonLink}
              onLabelChange={(v) => onUpdate("hero.secondaryButton", v)}
              onLinkChange={(cfg) => onUpdate("hero.secondaryButtonLink", cfg)}
              className="rounded-full px-6 py-3 text-sm font-semibold inline-block"
              style={{
                background: "var(--qs-bg-alt)",
                color: "var(--qs-text)",
                border: "1px solid var(--qs-border)",
              }}
            />
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute inset-0 rounded-3xl -rotate-2 scale-[1.02]"
            style={{ background: "var(--qs-primary)", opacity: 0.08 }}
          />
          <div className="relative overflow-hidden rounded-3xl">
            <TemplateImage
              source={content?.hero?.image1}
              publicId={content?.hero?.image1PId}
              isEditor={isEditor}
              onImageChange={(url, publicId) => {
                onUpdate("hero", { ...content.hero, image1: url, image1PId: publicId });
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────

function About({ isEditor, content, onUpdate }: TemplateComponentProps) {
  return (
    <section
      id="about"
      className="mx-auto max-w-5xl px-6 py-16"
    >
      <div
        className="rounded-3xl p-8 md:p-12"
        style={{ background: "var(--qs-bg-alt)", border: "1px solid var(--qs-border)" }}
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
          style={{ color: "var(--qs-text-muted)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate("about.heading", e.currentTarget.textContent?.trim())}
        >
          {content?.about?.heading ?? "About Me"}
        </p>
        <p
          className="text-xl md:text-2xl leading-8 font-medium max-w-2xl"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate("about.body", e.currentTarget.textContent?.trim())}
        >
          {content?.about?.body ?? "I'm a designer and developer focused on making things simple, functional, and beautiful."}
        </p>
      </div>
    </section>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────

function Projects({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const projects = content?.projects ?? [];

  return (
    <section id="work" className="mx-auto max-w-5xl px-6 py-16">
      <h2
        className="text-2xl md:text-3xl font-bold mb-10"
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate("projectsHeading", e.currentTarget.textContent?.trim())}
      >
        {content?.projectsHeading ?? "Selected Work"}
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((p: any, i: number) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl transition-transform hover:-translate-y-1"
            style={{ background: "var(--qs-bg-alt)", border: "1px solid var(--qs-border)" }}
          >
            {isEditor && (
              <div className="absolute top-3 right-3 z-10">
                <Xbutton
                  onClick={() => {
                    const updated = [...projects];
                    updated.splice(i, 1);
                    onUpdate("projects", updated);
                  }}
                  className="bg-white/80 hover:bg-white shadow"
                  color="red"
                />
              </div>
            )}

            <div className="overflow-hidden aspect-video">
              <TemplateImage
                source={p.image}
                publicId={p.imagePId}
                isEditor={isEditor}
                onImageChange={(url, publicId) => {
                  const updated = [...projects];
                  updated[i] = { ...updated[i], image: url, imagePId: publicId };
                  onUpdate("projects", updated);
                }}
              />
            </div>

            <div className="p-5">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1"
                style={{ color: "var(--qs-primary)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const updated = [...projects];
                  updated[i].category = e.currentTarget.textContent?.trim() || p.category;
                  onUpdate("projects", updated);
                }}
              >
                {p.category}
              </p>
              <h3
                className="font-bold text-base"
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const updated = [...projects];
                  updated[i].title = e.currentTarget.textContent?.trim() || p.title;
                  onUpdate("projects", updated);
                }}
              >
                {p.title}
              </h3>
              <p
                className="mt-2 text-sm leading-6"
                style={{ color: "var(--qs-text-muted)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const updated = [...projects];
                  updated[i].desc = e.currentTarget.textContent?.trim() || p.desc;
                  onUpdate("projects", updated);
                }}
              >
                {p.desc}
              </p>
            </div>
          </div>
        ))}

        {isEditor && (
          <AddButton
            onClick={() => {
              onUpdate("projects", [
                ...projects,
                {
                  title: "New Project",
                  category: "Category",
                  desc: "Describe your project here.",
                  image: "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777214672/image_wy9bs5.png",
                  imagePId: "",
                  link: {},
                },
              ]);
            }}
          >
            Add Project
          </AddButton>
        )}
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────

function Contact({ isEditor, content, onUpdate }: TemplateComponentProps) {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
      <div
        className="rounded-3xl px-8 py-14 text-center"
        style={{ background: "var(--qs-primary)", color: "var(--qs-primary-fg)" }}
      >
        <h2
          className="text-3xl md:text-4xl font-bold"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate("contact.heading", e.currentTarget.textContent?.trim())}
        >
          {content?.contact?.heading ?? "Let's Work Together"}
        </h2>
        <p
          className="mt-3 text-base max-w-md mx-auto"
          style={{ opacity: 0.85 }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate("contact.subheading", e.currentTarget.textContent?.trim())}
        >
          {content?.contact?.subheading ?? "Open to freelance projects, full-time roles, and interesting collabs."}
        </p>
        <CtaLink
          isEditor={isEditor}
          label={content?.contact?.primaryButton ?? "Send a Message"}
          linkConfig={content?.contact?.primaryButtonLink}
          onLabelChange={(v) => onUpdate("contact.primaryButton", v)}
          onLinkChange={(cfg) => onUpdate("contact.primaryButtonLink", cfg)}
          className="mt-8 inline-block rounded-full bg-white px-7 py-3 text-sm font-bold transition-transform hover:scale-[1.02]"
          style={{ color: "var(--qs-primary)" }}
        />
      </div>
    </section>
  );
}

// ── Home (assembled) ──────────────────────────────────────────────────────────

export default function Home({ isEditor, content, onUpdate, slugs }: TemplateProps) {
  const handleUpdate = (path: string, value: any) => {
    if (onUpdate) onUpdate(path, value);
  };
  return (
    <>
      <Navbar isEditor={isEditor} content={content} onUpdate={handleUpdate} slugs={slugs} />
      <Hero isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <About isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <Projects isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <Contact isEditor={isEditor} content={content} onUpdate={handleUpdate} />
      <Footer isEditor={isEditor} content={content} onUpdate={handleUpdate} />
    </>
  );
}