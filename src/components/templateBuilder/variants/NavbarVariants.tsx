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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:px-8">
        {/* Brand */}
        <div className="flex items-center gap-1 sm:gap-3 group cursor-pointer">
          <div className="h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-xl border border-(--qs-border)/30 bg-white/10 backdrop-blur-md shadow-sm transition-all duration-300 group-hover:scale-105 flex items-center justify-center">
            <TemplateImage
              source={content?.logoImage}
              isEditor={isEditor}
              path="navbar.logoImage"
            />
          </div>

          <span
            className="text-md sm:text-xl font-semibold tracking-tighter text-neutral-900 bg-white/80 dark:text-white dark:bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("title", e.currentTarget.textContent?.trim())
            }
          >
            {content?.title}
          </span>
        </div>

        {/* CTA */}
        <EditableLinkButton
          isEditor={isEditor}
          label={content?.ctaButton || "Get In Touch"}
          linkConfig={content?.ctaButtonLink}
          onLabelChange={(v) => onUpdate("ctaButton", v)}
          onLinkChange={(v) => onUpdate("ctaButtonLink", v)}
          noPreview
          className="rounded-lg bg-(--qs-primary) px-2 py-2 text-xs sm:text-sm font-semibold text-(--qs-bg-alt)"
        />
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-10">
        
        {/* Brand Pill */}
        <div className="rounded-full bg-neutral-900/10 dark:bg-white/10 hover:bg-neutral-900/15 dark:hover:bg-white/15 border border-neutral-900/5 dark:border-white/10 backdrop-blur-md px-4 py-1.5 transition-all">
          <span
            className="text-sm sm:text-lg font-bold tracking-[2px] sm:tracking-[3px] text-[var(--qs-primary-alt)] uppercase block outline-none"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) => onUpdate("title", e.currentTarget.textContent?.trim())}
          >
            {content?.title || "STUDIO"}
          </span>
        </div>

        {/* CTA Pill */}
        <div className="rounded-full bg-neutral-900/10 dark:bg-white/10 hover:bg-neutral-900/15 dark:hover:bg-white/15 border border-neutral-900/5 dark:border-white/10 backdrop-blur-md px-5 py-1.5 transition-all">
          <EditableLinkButton
            isEditor={isEditor}
            label={content?.ctaButton || "Let's Talk"}
            linkConfig={content?.ctaButtonLink}
            onLabelChange={(v) => onUpdate("ctaButton", v)}
            onLinkChange={(v) => onUpdate("ctaButtonLink", v)}
            noPreview
            className="text-xs sm:text-sm font-semibold tracking-wide text-[var(--qs-primary-alt)] relative block after:absolute after:-bottom-0.5 after:left-0 after:h-[1.5px] after:w-0 after:bg-[var(--qs-primary-alt)] after:transition-all hover:after:w-full"
          />
        </div>

      </div>
    </NavbarShell>
  );
};

const None = () => {
  return null;
};

export const NavbarVariants = {
  classic: ClassicNavbar,
  minimal: MinimalNavbar,
  none: None,
};
