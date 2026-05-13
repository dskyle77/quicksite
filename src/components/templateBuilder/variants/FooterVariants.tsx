/* eslint-disable @typescript-eslint/no-explicit-any */
// ─── Footer Variants ──────────────────────────────────────────────────────────
// Register new footer variants here. Key must match FooterVariantKey in types.ts.

import {
  TemplateComponentProps,
  VariantRegistry,
  FooterVariantKey,
} from "../types";
import Branding from "@/components/shared/Branding";

// ─── 1. Classic ───────────────────────────────────────────────────────────────
// Brand + copyright left, social links right.

const ClassicFooter = ({
  isEditor,
  content,
  onUpdate,
}: TemplateComponentProps) => {
  const socials: string[] = content?.footer?.socials ?? [
    "GitHub",
    "LinkedIn",
    "Twitter",
    "Dribbble",
  ];
  return (
    <footer
      className="border-t"
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
            {content?.footer?.brand ?? "My Brand"}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--qs-text-muted)" }}>
            {content?.footer?.copyright ??
              `© ${new Date().getFullYear()} All rights reserved.`}
          </p>
          {!isEditor && <Branding />}
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          {socials.map((social, i) => (
            <a
              key={i}
              href="#"
              className="transition-opacity hover:opacity-70"
              contentEditable={isEditor}
              suppressContentEditableWarning
              onBlur={(e) => {
                const next = [...socials];
                next[i] = e.currentTarget.textContent?.trim() || social;
                onUpdate("footer.socials", next);
              }}
            >
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

// ─── 2. Centered ─────────────────────────────────────────────────────────────
// Everything stacked and centered. Good for personal/portfolio sites.

const CenteredFooter = ({
  isEditor,
  content,
  onUpdate,
}: TemplateComponentProps) => (
  <footer
    className="py-20 px-6 text-center"
    style={{ background: "var(--qs-bg-alt)" }}
  >
    <div className="text-3xl mb-6">✦</div>
    <nav className="flex justify-center flex-wrap gap-8 mb-8 font-medium text-sm">
      {["About", "Work", "Contact"].map((label) => (
        <a key={label} href="#" className="hover:opacity-70 transition-opacity">
          {label}
        </a>
      ))}
    </nav>
    <p
      className="text-sm"
      style={{ color: "var(--qs-text-muted)" }}
      contentEditable={isEditor}
      suppressContentEditableWarning
      onBlur={(e) =>
        onUpdate("footer.copyright", e.currentTarget.textContent?.trim())
      }
    >
      {content?.footer?.copyright ??
        `© ${new Date().getFullYear()} All rights reserved.`}
    </p>
    <div className="mt-6 flex justify-center">{!isEditor && <Branding />}</div>
  </footer>
);

// ─── 3. Minimal ───────────────────────────────────────────────────────────────
// Single-line bar — just brand and copyright.

const MinimalFooter = ({ content }: TemplateComponentProps) => (
  <footer
    className="py-6 px-6 border-t flex justify-between items-center text-[10px] uppercase tracking-widest"
    style={{ borderColor: "var(--qs-border)", color: "var(--qs-text-muted)" }}
  >
    <div>{content?.footer?.brand}</div>
    <div>{content?.footer?.copyright}</div>
  </footer>
);

// ─── 4. Columns ───────────────────────────────────────────────────────────────
// Multi-column layout — brand column + link groups. Good for landing pages.

const ColumnsFooter = ({
  isEditor,
  content,
  onUpdate,
}: TemplateComponentProps) => {
  const socials: string[] = content?.footer?.socials ?? [
    "GitHub",
    "LinkedIn",
    "Twitter",
  ];
  return (
    <footer
      className="border-t px-6 py-16"
      style={{
        background: "var(--qs-bg-alt)",
        borderColor: "var(--qs-border)",
      }}
    >
      <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-4">
        {/* Brand Column */}
        <div className="md:col-span-2">
          <p
            className="text-xl font-bold"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("footer.brand", e.currentTarget.textContent?.trim())
            }
          >
            {content?.footer?.brand ?? "My Brand"}
          </p>
          <p
            className="mt-3 text-sm leading-6"
            style={{ color: "var(--qs-text-muted)" }}
          >
            Building great products with care and craft.
          </p>
          {!isEditor && (
            <div className="mt-4">
              <Branding />
            </div>
          )}
        </div>

        {/* Social Links */}
        <div>
          <p
            className="mb-4 text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--qs-text-muted)" }}
          >
            Connect
          </p>
          <div className="flex flex-col gap-2 text-sm">
            {socials.map((s, i) => (
              <a
                key={i}
                href="#"
                className="hover:opacity-70 transition-opacity"
                contentEditable={isEditor}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const next = [...socials];
                  next[i] = e.currentTarget.textContent?.trim() || s;
                  onUpdate("footer.socials", next);
                }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div>
          <p
            className="mb-4 text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--qs-text-muted)" }}
          >
            Legal
          </p>
          <div className="flex flex-col gap-2 text-sm">
            {["Privacy Policy", "Terms of Service"].map((l) => (
              <a
                key={l}
                href="#"
                className="hover:opacity-70 transition-opacity"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        className="mx-auto mt-12 max-w-6xl border-t pt-6 text-xs"
        style={{
          borderColor: "var(--qs-border)",
          color: "var(--qs-text-muted)",
        }}
      >
        {content?.footer?.copyright ??
          `© ${new Date().getFullYear()} All rights reserved.`}
      </div>
    </footer>
  );
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const FooterVariants: VariantRegistry<FooterVariantKey> = {
  classic: ClassicFooter,
  centered: CenteredFooter,
  minimal: MinimalFooter,
  columns: ColumnsFooter,
};
