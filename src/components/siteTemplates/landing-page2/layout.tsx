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

  const buildLink = (value: string, slug?: string) => {
    if (!slug) return "#";
    const base = (isEditor ? "/editor/" : "/s/") + slug;
    return `${base}#${value}`;
  };

  const links = [
    { title: "Features", link: buildLink("features", slug) },
    { title: "How It Works", link: buildLink("how-it-works", slug) },
    { title: "Pricing", link: buildLink("pricing", slug) },
    { title: "FAQ", link: buildLink("faq", slug) },
  ];

  return (
    <header
      className={`${!isEditor && "sticky top-0"} z-50 transition-all duration-300`}
      style={{
        background: "color-mix(in srgb, var(--qs-bg) 95%, transparent)",
        borderBottom: "1px solid var(--qs-border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
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
            {content?.navbar?.logo ?? "◈"}
          </div>
          <h1
            className="text-base font-bold tracking-tight md:text-lg"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("navbar.title", e.currentTarget.textContent?.trim())
            }
          >
            {content?.navbar?.title ?? "LaunchPad"}
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.link}
              className="rounded-xl px-4 py-2 font-medium transition-colors hover:bg-(--qs-bg-alt)"
              style={{ color: "var(--qs-text-muted)" }}
            >
              {link.title}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <CtaLink
              isEditor={isEditor}
              label={content?.navbar?.ctaButton ?? "Get Started"}
              linkConfig={content?.navbar?.ctaButtonLink}
              onLabelChange={(v) => onUpdate("navbar.ctaButton", v)}
              onLinkChange={(cfg) => onUpdate("navbar.ctaButtonLink", cfg)}
              className="rounded-xl px-5 py-2 text-sm font-bold transition-all active:scale-95 hover:opacity-90"
              style={{
                background: "var(--qs-primary)",
                color: "var(--qs-primary-fg)",
              }}
            />
          </div>

          {/* Mobile Menu */}
          <div className="relative md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors active:bg-black/5"
              style={{ color: "var(--qs-text)" }}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div
              className={`absolute right-0 mt-2 w-52 origin-top-right overflow-hidden rounded-2xl border shadow-xl transition-all duration-200 ${
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
                <div className="px-3 pb-2 pt-1">
                  <CtaLink
                    isEditor={isEditor}
                    label={content?.navbar?.ctaButton ?? "Get Started"}
                    linkConfig={content?.navbar?.ctaButtonLink}
                    onLabelChange={(v) => onUpdate("navbar.ctaButton", v)}
                    onLinkChange={(cfg) =>
                      onUpdate("navbar.ctaButtonLink", cfg)
                    }
                    className="block w-full rounded-xl px-4 py-2.5 text-sm font-bold text-center transition-all active:scale-95"
                    style={{
                      background: "var(--qs-primary)",
                      color: "var(--qs-primary-fg)",
                    }}
                  />
                </div>
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
  const columns = content?.footer?.columns ?? [
    {
      heading: "Product",
      links: ["Features", "Pricing", "Changelog", "Roadmap"],
    },
    {
      heading: "Company",
      links: ["About", "Blog", "Careers", "Press"],
    },
    {
      heading: "Legal",
      links: ["Privacy", "Terms", "Security"],
    },
  ];

  const socials = content?.footer?.socials ?? ["Twitter", "GitHub", "LinkedIn"];

  return (
    <footer
      className="border-t"
      style={{
        background: "var(--qs-bg-alt)",
        borderColor: "var(--qs-border)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
                style={{
                  background: "var(--qs-primary)",
                  color: "var(--qs-primary-fg)",
                }}
              >
                {content?.navbar?.logo ?? "◈"}
              </div>
              <span
                className="font-bold"
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate("footer.brand", e.currentTarget.textContent?.trim())
                }
              >
                {content?.footer?.brand ?? "LaunchPad"}
              </span>
            </div>
            <p
              className="text-sm leading-6"
              style={{ color: "var(--qs-text-muted)" }}
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate("footer.tagline", e.currentTarget.textContent?.trim())
              }
            >
              {content?.footer?.tagline ??
                "The fastest way to go from idea to product."}
            </p>
            <div className="mt-4 flex gap-4 text-sm">
              {socials.map((social: string, i: number) => (
                <a
                  key={i}
                  href="#"
                  className="transition-opacity hover:opacity-70"
                  style={{ color: "var(--qs-text-muted)" }}
                  contentEditable={isEditor}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newSocials = [...socials];
                    newSocials[i] =
                      e.currentTarget.textContent?.trim() || social;
                    onUpdate("footer.socials", newSocials);
                  }}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col: any, ci: number) => (
            <div key={ci}>
              <h4
                className="mb-4 text-sm font-semibold uppercase tracking-wider"
                style={{ color: "var(--qs-text)" }}
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newCols = [...columns];
                  newCols[ci].heading =
                    e.currentTarget.textContent?.trim() || col.heading;
                  onUpdate("footer.columns", newCols);
                }}
              >
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link: string, li: number) => (
                  <li key={li}>
                    <a
                      href="#"
                      className="text-sm transition-opacity hover:opacity-70"
                      style={{ color: "var(--qs-text-muted)" }}
                      contentEditable={isEditor}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newCols = [...columns];
                        newCols[ci].links[li] =
                          e.currentTarget.textContent?.trim() || link;
                        onUpdate("footer.columns", newCols);
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm md:flex-row"
          style={{
            borderColor: "var(--qs-border)",
            color: "var(--qs-text-muted)",
          }}
        >
          <p
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("footer.copyright", e.currentTarget.textContent?.trim())
            }
          >
            {content?.footer?.copyright ??
              `© ${new Date().getFullYear()} All rights reserved.`}
          </p>
          {!isEditor && <Branding />}
        </div>
      </div>
    </footer>
  );
}
