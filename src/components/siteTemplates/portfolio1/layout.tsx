/* eslint-disable @typescript-eslint/no-explicit-any */
import { TemplateComponentProps } from "@/lib/templates";
import CtaLink from "@/components/shared/CtaLinkModal";
import Branding from "@/components/shared/Branding";

export function Navbar({ isEditor, content, onUpdate, slugs }: TemplateComponentProps) {
  const slug = slugs?.slug;
  const base = (isEditor ? "/editor/" : "/s/") + slug;

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: "color-mix(in srgb, var(--qs-bg) 85%, transparent)",
        borderBottom: "1px solid var(--qs-border)",
      }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <span
          className="text-base font-bold tracking-tight"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate("navbar.title", e.currentTarget.textContent?.trim())}
        >
          {content?.navbar?.title ?? "Jane Doe"}
        </span>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href={`${base}#about`} style={{ color: "var(--qs-text-muted)" }} className="hover:opacity-100 transition-opacity">
            About
          </a>
          <a href={`${base}#work`} style={{ color: "var(--qs-text-muted)" }} className="hover:opacity-100 transition-opacity">
            Work
          </a>
          <a href={`${base}#contact`} style={{ color: "var(--qs-text-muted)" }} className="hover:opacity-100 transition-opacity">
            Contact
          </a>
        </nav>

        <CtaLink
          isEditor={isEditor}
          label={content?.navbar?.ctaButton ?? "Hire Me"}
          linkConfig={content?.navbar?.ctaButtonLink}
          onLabelChange={(v) => onUpdate("navbar.ctaButton", v)}
          onLinkChange={(cfg) => onUpdate("navbar.ctaButtonLink", cfg)}
          className="rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:scale-[1.02] inline-block"
          style={{ background: "var(--qs-primary)", color: "var(--qs-primary-fg)" }}
        />
      </div>
    </header>
  );
}

export function Footer({ isEditor, content, onUpdate }: TemplateComponentProps) {
  const socials = content?.footer?.socials ?? [
    { label: "Twitter", url: "#" },
    { label: "GitHub", url: "#" },
    { label: "LinkedIn", url: "#" },
  ];

  return (
    <footer
      className="border-t mt-8"
      style={{ background: "var(--qs-bg-alt)", borderColor: "var(--qs-border)" }}
    >
      <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p
            className="font-semibold text-sm"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate("footer.name", e.currentTarget.textContent?.trim())}
          >
            {content?.footer?.name ?? "Jane Doe"}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--qs-text-muted)" }}>
            {content?.footer?.copyright ?? `© ${new Date().getFullYear()}`}
          </p>
          {!isEditor && <Branding />}
        </div>

        <div className="flex items-center gap-5">
          {socials.map((s: any, i: number) => (
            <a
              key={i}
              href={isEditor ? "#" : s.url}
              className="text-sm transition-opacity hover:opacity-70"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) => {
                const updated = [...socials];
                updated[i] = { ...updated[i], label: e.currentTarget.textContent?.trim() || s.label };
                onUpdate("footer.socials", updated);
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}