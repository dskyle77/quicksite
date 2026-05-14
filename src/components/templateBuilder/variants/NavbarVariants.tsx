/* eslint-disable @typescript-eslint/no-explicit-any */
// ─── Navbar Variants ──────────────────────────────────────────────────────────

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Zap, User, Code } from "lucide-react";
import { TemplateComponentProps } from "@/lib/templates";
import {
  VariantRegistry,
  NavbarVariantKey,
} from "../types";
import CtaLink from "@/components/shared/CtaLinkModal";
import TemplateImage from "@/components/shared/TemplateImage";

// ─── Link Builders ────────────────────────────────────────────────────────────

const buildAnchorLink = (value: string, slug?: string, isEditor?: boolean) => {
  if (!slug) return "#";
  return isEditor ? `/editor/${slug}#${value}` : `${slug}#${value}`;
};

const buildSubPageLink = (slug?: string, subPage = "", forEditor = false) =>
  slug
    ? forEditor
      ? `/editor/${slug}?sp=${subPage}`
      : `/${slug}/${subPage}`
    : "#";

// ─── 1. Classic ───────────────────────────────────────────────────────────────
// Simple top bar with logo left, links center, CTA right.

const ClassicNavbar = ({
  isEditor,
  content,
  onUpdate,
  slugs,
}: TemplateComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const slug = slugs?.slug;

  const links = [
    { title: "About", href: buildAnchorLink("about", slug, isEditor) },
    { title: "Skills", href: buildAnchorLink("skills", slug, isEditor) },
    { title: "Projects", href: buildAnchorLink("projects", slug, isEditor) },
    { title: "Contact", href: buildAnchorLink("contact", slug, isEditor) },
  ];

  return (
    <header
      className={`${!isEditor && "sticky top-0"} z-50 transition-all`}
      style={{
        background: "color-mix(in srgb, var(--qs-bg-alt) 95%, transparent)",
        borderBottom: "1px solid var(--qs-border)",
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
              onUpdate("logo", e.currentTarget.textContent?.trim())
            }
          >
            {content?.logo ?? "✦"}
          </div>
          <span
            className="text-base font-bold tracking-tight md:text-xl"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("title", e.currentTarget.textContent?.trim())
            }
          >
            {content?.title ?? "My Portfolio"}
          </span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {links.map((l, i) => (
            <Link
              key={i}
              href={l.href}
              className="rounded-xl px-4 py-2 font-medium transition-colors hover:bg-(--qs-primary) hover:text-(--qs-primary-fg)"
              style={{ color: "var(--qs-text-muted)" }}
            >
              {l.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <CtaLink
              isEditor={isEditor}
              label={content?.ctaButton ?? "Hire Me"}
              linkConfig={content?.ctaButtonLink}
              onLabelChange={(v) => onUpdate("ctaButton", v)}
              onLinkChange={(cfg) => onUpdate("ctaButtonLink", cfg)}
              className="rounded-xl px-5 py-2 text-sm font-bold transition-all active:scale-95"
              style={{
                background: "var(--qs-primary)",
                color: "var(--qs-primary-fg)",
              }}
            />
          </div>

          <div className="relative md:hidden z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div
              className={`absolute right-0 mt-2 w-48 origin-top-right overflow-hidden rounded-2xl border shadow-xl transition-all duration-200 ${
                isOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
              style={{
                background: "var(--qs-bg)",
                borderColor: "var(--qs-border)",
              }}
            >
              <div className="flex flex-col p-1.5">
                {links.map((l, i) => (
                  <Link
                    key={i}
                    href={l.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-(--qs-primary) hover:text-(--qs-primary-fg)"
                  >
                    {l.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const LogoNavbar = ({
  isEditor,
  content,
  onUpdate,
  slugs,
}: TemplateComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const slug = slugs?.slug;

  const links = [
    { title: "About", href: buildAnchorLink("about", slug, isEditor) },
    { title: "Skills", href: buildAnchorLink("skills", slug, isEditor) },
    { title: "Projects", href: buildAnchorLink("projects", slug, isEditor) },
    { title: "Contact", href: buildAnchorLink("contact", slug, isEditor) },
  ];

  return (
    <header
      className={`${!isEditor && "sticky top-0"} z-50 transition-all`}
      style={{
        background: "color-mix(in srgb, var(--qs-bg-alt) 95%, transparent)",
        borderBottom: "1px solid var(--qs-border)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo section with image logo */}
        <div className="flex items-center gap-3">
          <div className="shrink-0 h-10 w-10 rounded-xl overflow-hidden bg-(--qs-primary) flex items-center justify-center">
            <TemplateImage
              isEditor={isEditor}
              source={content?.logoImage}
              publicId={content?.logoPId}
              alt="logo"
              onImageChange={(url, pId) =>
                onUpdate(null, {
                  ...content,
                  logoImage: url,
                  logoPId: pId,
                })
              }
            />
          </div>
          <span
            className="text-base font-bold tracking-tight md:text-xl"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("title", e.currentTarget.textContent?.trim())
            }
          >
            {content?.title ?? "My Portfolio"}
          </span>
        </div>
        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {links.map((l, i) => (
            <Link
              key={i}
              href={l.href}
              className="rounded-xl px-4 py-2 font-medium transition-colors hover:bg-(--qs-primary) hover:text-(--qs-primary-fg)"
              style={{ color: "var(--qs-text-muted)" }}
            >
              {l.title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <CtaLink
              isEditor={isEditor}
              label={content?.ctaButton ?? "Hire Me"}
              linkConfig={content?.ctaButtonLink}
              onLabelChange={(v) => onUpdate("ctaButton", v)}
              onLinkChange={(cfg) => onUpdate("ctaButtonLink", cfg)}
              className="rounded-xl px-5 py-2 text-sm font-bold transition-all active:scale-95"
              style={{
                background: "var(--qs-primary)",
                color: "var(--qs-primary-fg)",
              }}
            />
          </div>
          <div className="relative md:hidden z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div
              className={`absolute right-0 mt-2 w-48 origin-top-right overflow-hidden rounded-2xl border shadow-xl transition-all duration-200 ${
                isOpen
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
              style={{
                background: "var(--qs-bg)",
                borderColor: "var(--qs-border)",
              }}
            >
              <div className="flex flex-col p-1.5">
                {links.map((l, i) => (
                  <Link
                    key={i}
                    href={l.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-(--qs-primary) hover:text-(--qs-primary-fg)"
                  >
                    {l.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// ─── 2. Glass Floating ────────────────────────────────────────────────────────

const GlassFloatingNavbar = ({
  isEditor,
  content,
  onUpdate,
  slugs,
}: TemplateComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const slug = slugs?.slug;

  const navLinks = [
    {
      title: "About",
      href: buildAnchorLink("about", slug, isEditor),
      icon: <User size={14} />,
    },
    {
      title: "Projects",
      href: buildAnchorLink("projects", slug, isEditor),
      icon: <Code size={14} />,
    },
    {
      title: "Experience",
      href: buildAnchorLink("experience", slug, isEditor),
      icon: <Zap size={14} />,
    },
  ];

  return (
    <nav
      className={`${isEditor ? "" : "fixed top-6 left-0 right-0 z-100"} px-4`}
    >
      <div
        className="mx-auto max-w-5xl rounded-full backdrop-blur-md shadow-2xl px-6 py-3"
        style={{
          background: "color-mix(in srgb, var(--qs-bg) 80%, transparent)",
          border: "1px solid var(--qs-border)",
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-xl font-bold tracking-tighter"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("title", e.currentTarget.textContent?.trim())
            }
          >
            {content?.title ?? "PORTFOLIO"}
          </span>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l, i) => (
              <Link
                key={i}
                href={l.href}
                className="flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity"
              >
                {l.icon} {l.title}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <CtaLink
              isEditor={isEditor}
              label={content?.ctaButton ?? "Let's Talk"}
              linkConfig={content?.ctaButtonLink}
              onLabelChange={(v) => onUpdate("ctaButton", v)}
              onLinkChange={(cfg) => onUpdate("ctaButtonLink", cfg)}
              className="rounded-full px-5 py-2 text-sm font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                background: "var(--qs-primary)",
                color: "var(--qs-primary-fg)",
              }}
            />
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isOpen && (
          <div className="mt-4 flex flex-col gap-4 pb-4 md:hidden">
            {navLinks.map((l, i) => (
              <Link
                key={i}
                href={l.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium"
              >
                {l.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

// ─── 3. Centered ─────────────────────────────────────────────────────────────
// Centered logo + links, minimal — good for landing pages.

const CenteredNavbar = ({
  isEditor,
  content,
  onUpdate,
  slugs,
}: TemplateComponentProps) => {
  const slug = slugs?.slug;
  return (
    <header
      className={`${!isEditor && "sticky top-0"} z-50`}
      style={{
        borderBottom: "1px solid var(--qs-border)",
        background: "var(--qs-bg)",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-4 md:flex-row md:justify-between">
        <span
          className="text-xl font-bold"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate("title", e.currentTarget.textContent?.trim())}
        >
          {content?.title ?? "Brand"}
        </span>
        <nav className="flex gap-6 text-sm font-medium">
          {["Features", "Pricing", "About", "Blog"].map((label) => (
            <Link
              key={label}
              href="#"
              style={{ color: "var(--qs-text-muted)" }}
              className="hover:opacity-100 opacity-70 transition-opacity"
            >
              {label}
            </Link>
          ))}
        </nav>
        <CtaLink
          isEditor={isEditor}
          label={content?.ctaButton ?? "Get Started"}
          linkConfig={content?.ctaButtonLink}
          onLabelChange={(v) => onUpdate("ctaButton", v)}
          onLinkChange={(cfg) => onUpdate("ctaButtonLink", cfg)}
          className="rounded-xl px-5 py-2 text-sm font-bold"
          style={{
            background: "var(--qs-primary)",
            color: "var(--qs-primary-fg)",
          }}
        />
      </div>
    </header>
  );
};

// ─── Registry ─────────────────────────────────────────────────────────────────
// Add new variants here. Key must match NavbarVariantKey in types.ts.

export const NavbarVariants: VariantRegistry<NavbarVariantKey> = {
  classic: ClassicNavbar,
  glass: GlassFloatingNavbar,
  logo: LogoNavbar,
  centered: CenteredNavbar,
};
