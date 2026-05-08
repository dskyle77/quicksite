/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { TemplateComponentProps } from "@/lib/templates";
import CtaLink from "@/components/shared/CtaLinkModal";
import Branding from "@/components/shared/Branding";

export function Navbar({
  isEditor,
  content,
  onUpdate,
  slugs,
}: TemplateComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const slug = slugs?.slug;

  const buildLink = (
    value: string,
    slug?: string,
    type: "section" | "page" = "section",
  ) => {
    if (!slug) return "#";
    const base = (isEditor ? "/editor/" : "/s/") + slug;
    return type === "section" ? `${base}#${value}` : `${base}/${value}`;
  };

  const links = [
    { title: "About", link: buildLink("about", slug) },
    { title: "Skills", link: buildLink("skills", slug) },
    { title: "Projects", link: buildLink("projects", slug, "page") },
    { title: "Contact", link: buildLink("contact", slug) },
  ];

  return (
    <header
      className={`${!isEditor && "sticky top-0"} z-50 transition-all duration-300`}
      style={{
        background: "color-mix(in srgb, var(--qs-bg-alt) 95%, transparent)",
        borderBottom: "1px solid var(--qs-border)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold shrink-0"
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
            className="text-base font-bold tracking-tight md:text-xl"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("navbar.title", e.currentTarget.textContent?.trim())
            }
          >
            {content?.navbar?.title ?? "My Portfolio"}
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.link}
              className="rounded-xl px-4 py-2 font-medium transition-colors hover:bg-(--qs-primary) hover:text-(--qs-primary-fg)"
              style={{ color: "var(--qs-text-muted)" }}
            >
              {link.title}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* CTA - Hidden on mobile, shown on SM+ */}
          <div className="hidden sm:block">
            <CtaLink
              isEditor={isEditor}
              label={content?.navbar?.ctaButton ?? "Hire Me"}
              linkConfig={content?.navbar?.ctaButtonLink}
              onLabelChange={(v) => onUpdate("navbar.ctaButton", v)}
              onLinkChange={(cfg) => onUpdate("navbar.ctaButtonLink", cfg)}
              className="rounded-xl px-5 py-2 text-sm font-bold transition-all active:scale-95"
              style={{
                background: "var(--qs-primary)",
                color: "var(--qs-primary-fg)",
              }}
            />
          </div>

          {/* Mobile Dropdown Wrapper */}
          <div className="relative md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors active:bg-black/5"
              style={{ color: "var(--qs-text)" }}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Anchored Select Menu */}
            <div
              className={`absolute right-0 mt-2 w-48 origin-top-right overflow-hidden rounded-2xl border shadow-xl transition-all duration-200 ${
                isOpen
                  ? "scale-100 opacity-100 translate-y-0"
                  : "scale-95 opacity-0 -translate-y-2 pointer-events-none"
              }`}
              style={{
                background: "var(--qs-bg)",
                borderColor: "var(--qs-border)",
              }}
            >
              <div className="flex flex-col p-1.5">
                {links.map((link, i) => (
                  <a
                    key={i}
                    href={link.link}
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-(--qs-primary) hover:text-(--qs-primary-fg)"
                    style={{ color: "var(--qs-text)" }}
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
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
