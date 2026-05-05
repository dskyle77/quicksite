/* eslint-disable @typescript-eslint/no-explicit-any */
import { TemplateComponentProps } from "@/lib/templates";
import CtaLink from "@/components/shared/CtaLinkModal";
import Branding from "@/components/shared/Branding";

export function Navbar({
  isEditor,
  content,
  onUpdate,
  slugs,
}: TemplateComponentProps) {
  type LinkType = "section" | "page";

  const buildLink = (
    value: string,
    slug?: string,
    type: LinkType = "section",
  ) => {
    if (!slug) return "#";

    const base = (isEditor ? "/editor/" : "/s/") + slug;

    if (type === "section") {
      return `${base}#${value}`;
    }

    if (type === "page") {
      return `${base}/${value}`;
    }

    return base;
  };

  const slug = slugs?.slug;

  const links = [
    { title: "About", link: buildLink("about", slug) },
    { title: "Skills", link: buildLink("skills", slug) },
    { title: "Projects", link: buildLink("projects", slug, "page") },
    { title: "Contact", link: buildLink("contact", slug) },
  ];

  return (
    <header
      className={`${!isEditor && "sticky top-0"} z-50 backdrop-blur-md`}
      style={{
        background: "color-mix(in srgb, var(--qs-bg-alt) 88%, transparent)",
        borderBottom: "1px solid var(--qs-border)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-xl font-bold"
            style={{
              background: "var(--qs-primary)",
              color: "var(--qs-primary-fg)",
            }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("navbar.logo", e.currentTarget.textContent?.trim())
            }
          >
            {content?.navbar?.logo ?? "✦"}
          </div>

          <h1
            className="text-lg font-bold tracking-tight md:text-xl"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("navbar.title", e.currentTarget.textContent?.trim())
            }
          >
            {content?.navbar?.title ?? "My Portfolio"}
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-2 text-sm">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.link}
              className="relative rounded-xl px-3 py-2 font-medium transition-all duration-150 hover:text-(--qs-primary-fg) focus:outline-none focus:ring-2 focus:ring-(--qs-primary)"
              style={{
                color: "var(--qs-text-muted)",
              }}
            >
              {link.title}
            </a>
          ))}
        </nav>

        <CtaLink
          isEditor={isEditor}
          label={content?.navbar?.ctaButton ?? "Hire Me"}
          linkConfig={content?.navbar?.ctaButtonLink}
          onLabelChange={(v) => onUpdate("navbar.ctaButton", v)}
          onLinkChange={(cfg) => onUpdate("navbar.ctaButtonLink", cfg)}
          className="rounded-xl px-4 py-2 text-sm font-semibold transition-transform hover:scale-[1.02] inline-block"
          style={{
            background: "var(--qs-primary)",
            color: "var(--qs-primary-fg)",
          }}
        />
      </div>
    </header>
  );
}
export function Footer({
  isEditor,
  content,
  onUpdate,
}: TemplateComponentProps) {
  const socials = content?.footer?.socials ?? [
    "GitHub",
    "LinkedIn",
    "Twitter",
    "Dribbble",
  ];

  return (
    <footer
      className="mt-8 border-t"
      style={{
        background: "var(--qs-bg-alt)",
        borderColor: "var(--qs-border)",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p
            className="font-semibold"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("footer.brand", e.currentTarget.textContent?.trim())
            }
          >
            {content?.footer?.brand ?? "Alex Morgan"}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--qs-text-muted)" }}>
            {content?.footer?.copyright ??
              `© ${new Date().getFullYear()} All rights reserved.`}
          </p>
          {/* Branding */}
          {!isEditor && <Branding />}
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          {socials.map((social: string, i: number) => (
            <a
              key={i}
              href="#"
              className="transition-opacity hover:opacity-70"
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) => {
                const newSocials = [...socials];
                newSocials[i] = e.currentTarget.textContent?.trim() || social;
                onUpdate("footer.socials", newSocials);
              }}
            >
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
