import React from "react";
import { TemplateComponentProps } from "@/lib/templates";
import EditableLinkButton from "@/components/shared/EditableLink";
import TemplateImage from "@/components/shared/TemplateImage";

// ─────────────────────────────────────────────
// BASE SHELL
// ─────────────────────────────────────────────

const NavbarShell = ({ children }: { children: React.ReactNode }) => (
  <header className="absolute top-0 left-0 right-0 z-30 w-full bg-transparent border-b border-white/10">
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
}: TemplateComponentProps) => {
  return (
    <NavbarShell>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="h-10 w-10 overflow-hidden rounded-2xl border border-(--qs-border)/30 bg-white/10 backdrop-blur-md shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-white/15 flex items-center justify-center">
            <TemplateImage
              source={content?.logoImage}
              isEditor={isEditor}
              path="navbar.logoImage"
            />
          </div>

          <span
            className="text-2xl font-semibold tracking-tighter text-(--qs-primary) drop-shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-1.5 py-0.5"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("title", e.currentTarget.textContent?.trim())
            }
          >
            {content?.title || "Portfolio"}
          </span>
        </div>

        {/* CTA Button */}
        <div>
          <EditableLinkButton
            isEditor={isEditor}
            label={content?.ctaButton || "Get In Touch"}
            linkConfig={content?.ctaButtonLink}
            onLabelChange={(v) => onUpdate("ctaButton", v)}
            onLinkChange={(v) => onUpdate("ctaButtonLink", v)}
            noPreview
            className="rounded-xl bg-(--qs-primary) px-6 py-2.5 text-sm font-semibold text-(--qs-bg-alt) shadow-lg shadow-black/10 transition-all duration-200 hover:bg-(--qs-secondary) hover:shadow-xl active:scale-[0.985]"
          />
        </div>
      </div>
    </NavbarShell>
  );
};

const MinimalNavbar = ({
  isEditor,
  content,
  onUpdate,
}: TemplateComponentProps) => {
  return (
    <NavbarShell>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        {/* Brand */}
        <span
          className="text-xl font-bold tracking-[3px] text-(--qs-text) uppercase transition-all hover:opacity-80 focus:outline-none focus:ring-1 focus:ring-(--qs-primary)/30 rounded px-2 py-1"
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate("title", e.currentTarget.textContent?.trim())}
        >
          {content?.title || "STUDIO"}
        </span>

        {/* Minimal CTA */}
        <div>
          <EditableLinkButton
            isEditor={isEditor}
            label={content?.ctaButton || "Let's Talk"}
            linkConfig={content?.ctaButtonLink}
            onLabelChange={(v) => onUpdate("ctaButton", v)}
            onLinkChange={(v) => onUpdate("ctaButtonLink", v)}
            noPreview
            className="text-base font-medium text-(--qs-text) transition-all hover:opacity-80 relative after:absolute after:bottom-[-2px] after:left-0 after:h-[1.5px] after:w-0 after:bg-(--qs-primary) after:transition-all hover:after:w-full"
          />
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
