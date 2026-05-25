/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, Settings2, Plus, Trash2 } from "lucide-react";

import { TemplateComponentProps } from "@/lib/templates";
import EditableLinkButton from "@/components/shared/EditableLink";
import TemplateImage from "@/components/shared/TemplateImage";

// ─────────────────────────────────────────────
// CONFIG & TYPES
// ─────────────────────────────────────────────

const ANCHOR_OPTIONS = ["about", "skills", "projects", "experience", "contact"];
const NAV_LIMIT = 4;

type NavLink = {
  label: string;
  type: "anchor" | "external";
  anchor?: string;
  href?: string;
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const buildHref = ({
  slug,
  link,
  isEditor,
}: {
  slug?: string;
  link: NavLink;
  isEditor?: boolean;
}) => {
  if (link.type === "external") return link.href || "#";
  if (!link.anchor) return "#";
  return isEditor ? `/editor/${slug}#${link.anchor}` : `#${link.anchor}`;
};

const useNavbarLinks = (content: any, onUpdate: any) => {
  const links: NavLink[] = (content?.links || []).slice(0, NAV_LIMIT);

  const updateLink = (index: number, patch: Partial<NavLink>) => {
    const next = [...links];
    next[index] = { ...next[index], ...patch };
    onUpdate("links", next);
  };

  const removeLink = (index: number) => {
    const next = links.filter((_, i) => i !== index);
    onUpdate("links", next);
  };

  const addLink = () => {
    if (links.length >= NAV_LIMIT) return;
    onUpdate("links", [
      ...links,
      { label: "New Link", type: "anchor", anchor: "about" },
    ]);
  };

  return { links, updateLink, removeLink, addLink };
};

// ─────────────────────────────────────────────
// CENTERED PORTAL EDITOR
// ─────────────────────────────────────────────

const NavEditorPortal = ({
  links,
  updateLink,
  removeLink,
  addLink,
  onClose,
}: any) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Centered Modal */}
      <div className="relative w-full max-w-md rounded-3xl border border-neutral-300 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold">Navigation Menu</h4>
            <p className="text-xs opacity-50">
              Limit: {links.length} / {NAV_LIMIT} links
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2 hover:scale-110 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {links.map((link: NavLink, i: number) => (
            <div
              key={i}
              className="group relative space-y-3 rounded-2xl bg-gray-100 p-4 border border-neutral-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold border border-neutral-300">
                  {i + 1}
                </div>
                <input
                  className="flex-1 bg-transparent text-sm font-bold focus:text-blue-600 border-2 border-black"
                  value={link.label}
                  placeholder="Link Label"
                  onChange={(e) => updateLink(i, { label: e.target.value })}
                />
                <button
                  onClick={() => removeLink(i)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider opacity-40 font-bold">
                    Type
                  </label>
                  <select
                    value={link.type}
                    onChange={(e) =>
                      updateLink(i, {
                        type: e.target.value as any,
                        anchor: "about",
                        href: "",
                      })
                    }
                    className="w-full rounded-lg border border-neutral-200 bg-white p-2 text-xs outline-none"
                  >
                    <option value="anchor">Page Section</option>
                    <option value="external">External Link</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider opacity-40 font-bold">
                    Target
                  </label>
                  {link.type === "anchor" ? (
                    <select
                      value={link.anchor || ""}
                      onChange={(e) =>
                        updateLink(i, { anchor: e.target.value })
                      }
                      className="w-full rounded-lg border border-neutral-200 bg-white p-2 text-xs outline-none"
                    >
                      {ANCHOR_OPTIONS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={link.href || ""}
                      onChange={(e) => updateLink(i, { href: e.target.value })}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-neutral-200 bg-white p-2 text-xs outline-none"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

          {links.length < NAV_LIMIT && (
            <button
              onClick={addLink}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-200 py-4 text-sm font-bold opacity-60 hover:opacity-100 hover:bg-gray-100 transition-all"
            >
              <Plus size={18} /> Add New Link
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-black py-3 text-sm font-bold text-white dark:bg-white dark:text-black hover:opacity-90 transition"
        >
          Done
        </button>
      </div>
    </div>,
    document.body,
  );
};

// ─────────────────────────────────────────────
// BASE SHELL
// ─────────────────────────────────────────────

const NavbarShell = ({
  children,
  isEditor,
}: {
  children: React.ReactNode;
  isEditor?: boolean;
}) => (
  <header
    className={`${!isEditor ? "sticky top-0 z-50" : ""} border-b backdrop-blur-md bg-(--qs-bg)/95 border-(--qs-border)`}
  >
    {children}
  </header>
);

// ─────────────────────────────────────────────
// VARIANTS
// ─────────────────────────────────────────────

const ClassicNavbar = ({
  isEditor,
  content,
  onUpdate,
  slugs,
}: TemplateComponentProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const { links, updateLink, removeLink, addLink } = useNavbarLinks(
    content,
    onUpdate,
  );

  return (
    <NavbarShell isEditor={isEditor}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 overflow-hidden rounded-md border border-(--qs-border) flex justify-center items-center">
            <TemplateImage
              source={content?.logoImage}
              isEditor={isEditor}
              path={"navbar.logoImage"}
            />
          </div>
          <span
            className="text-sm font-bold tracking-tight"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("title", e.currentTarget.textContent?.trim())
            }
          >
            {content?.title || "Portfolio"}
          </span>
        </div>

        {/* Links */}
        <nav className="hidden items-center gap-6 @md:flex">
          {links.map((link, i) => (
            <Link
              key={i}
              href={buildHref({ link, slug: slugs?.slug, isEditor })}
              className="text-sm font-medium opacity-70 transition hover:opacity-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* UI Actions */}
        <div className="flex items-center gap-4">
          {isEditor && (
            <>
              <button
                onClick={() => setEditorOpen(true)}
                className="flex items-center gap-2 rounded-full bg-(--qs-primary) px-4 py-2 text-xs font-bold text-white shadow-lg hover:brightness-110 transition"
              >
                <Settings2 size={14} /> Edit Menu
              </button>
              {editorOpen && (
                <NavEditorPortal
                  links={links}
                  updateLink={updateLink}
                  removeLink={removeLink}
                  addLink={addLink}
                  onClose={() => setEditorOpen(false)}
                />
              )}
            </>
          )}

          <div className="hidden @sm:block">
            <EditableLinkButton
              isEditor={isEditor}
              label={content?.ctaButton || "Contact"}
              linkConfig={content?.ctaButtonLink}
              onLabelChange={(v) => onUpdate("ctaButton", v)}
              onLinkChange={(v) => onUpdate("ctaButtonLink", v)}
            />
          </div>

          <button
            className="@md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t p-8 @md:hidden flex flex-col gap-6 bg-(--qs-bg) animate-in slide-in-from-top duration-300">
          {links.map((link, i) => (
            <Link
              key={i}
              href={buildHref({ link, slug: slugs?.slug })}
              className="text-2xl font-bold tracking-tight"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </NavbarShell>
  );
};

const MinimalNavbar = ({
  isEditor,
  content,
  onUpdate,
  slugs,
}: TemplateComponentProps) => {
  const [editorOpen, setEditorOpen] = useState(false);
  const { links, updateLink, removeLink, addLink } = useNavbarLinks(
    content,
    onUpdate,
  );

  return (
    <NavbarShell isEditor={isEditor}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
        <span
          className="text-xl font-black italic tracking-tighter"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate("title", e.currentTarget.textContent?.trim())}
        >
          {content?.title || "MINML"}
        </span>

        <div className="flex items-center gap-8">
          <nav className="hidden @md:flex items-center gap-8">
            {links.map((link, i) => (
              <Link
                key={i}
                href={buildHref({ link, slug: slugs?.slug, isEditor })}
                className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 border-l border-(--qs-border) pl-8">
            {isEditor && (
              <button
                onClick={() => setEditorOpen(true)}
                className="p-2 opacity-50 hover:opacity-100 hover:rotate-90 transition-all duration-300"
              >
                <Settings2 size={20} />
              </button>
            )}
            {editorOpen && (
              <NavEditorPortal
                links={links}
                updateLink={updateLink}
                removeLink={removeLink}
                addLink={addLink}
                onClose={() => setEditorOpen(false)}
              />
            )}
            <EditableLinkButton
              isEditor={isEditor}
              label={content?.ctaButton || "Hire"}
              linkConfig={content?.ctaButtonLink}
              onLabelChange={(v) => onUpdate("ctaButton", v)}
              onLinkChange={(v) => onUpdate("ctaButtonLink", v)}
            />
          </div>
        </div>
      </div>
    </NavbarShell>
  );
};

const None = () => null;

export const NavbarVariants = {
  classic: ClassicNavbar,
  minimal: MinimalNavbar,
  none: None,
};
