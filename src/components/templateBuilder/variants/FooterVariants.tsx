/* eslint-disable @typescript-eslint/no-explicit-any */
// ─── Footer Variants ──────────────────────────────────────────────────────────
// Register new footer variants here. Key must match FooterVariantKey in types.ts.

import { VariantRegistry, FooterVariantKey } from "../types";
import { TemplateComponentProps } from "@/lib/templates";

import EditableLinkButton from "@/components/shared/EditableLink";

import Branding from "@/components/shared/Branding";

// ─── 1. Classic ───────────────────────────────────────────────────────────────
// Brand + copyright left, social links right.

const ClassicFooter = ({
  isEditor,
  content,
  onUpdate,
}: TemplateComponentProps) => {
  const socials = content?.socials ?? [
    { label: "GitHub", linkConfig: { type: "url" as const, url: "" } },
    { label: "LinkedIn", linkConfig: { type: "url" as const, url: "" } },
    { label: "Twitter", linkConfig: { type: "url" as const, url: "" } },
    { label: "Dribbble", linkConfig: { type: "url" as const, url: "" } },
  ];
  return (
    <footer
      className="border-t"
      style={{
        background: "var(--qs-bg-alt)",
        borderColor: "var(--qs-border)",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 @md:flex-row @md:items-center @md:justify-between">
        <div>
          <p
            className="font-semibold"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("brand", e.currentTarget.textContent?.trim())
            }
          >
            {content?.brand ?? "My Brand"}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--qs-text-muted)" }}>
            {content?.copyright ??
              `© ${new Date().getFullYear()} All rights reserved.`}
          </p>
          {!isEditor && <Branding />}
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          {socials.map((social: any, i: any) => (
            <EditableLinkButton
              key={i}
              isEditor={isEditor}
              className="transition-opacity hover:opacity-70"
              noPreview={true}
              label={
                typeof social === "string" ? social : (social?.label ?? "")
              }
              linkConfig={
                typeof social === "string" ? undefined : social?.linkConfig
              }
              onLabelChange={(label) => {
                const next = [...socials];
                next[i] =
                  typeof social === "string"
                    ? { label, linkConfig: { type: "url", url: "" } }
                    : { ...next[i], label };
                onUpdate("socials", next);
              }}
              onLinkChange={(linkConfig) => {
                const next = [...socials];
                next[i] =
                  typeof social === "string"
                    ? { label: social, linkConfig }
                    : { ...next[i], linkConfig };
                onUpdate("socials", next);
              }}
            />
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
      onBlur={(e) => onUpdate("copyright", e.currentTarget.textContent?.trim())}
    >
      {content?.copyright ??
        `© ${new Date().getFullYear()} All rights reserved.`}
    </p>
    <div className="mt-6 flex justify-center">{!isEditor && <Branding />}</div>
  </footer>
);

// ─── 3. Columns ───────────────────────────────────────────────────────────────
// Multi-column layout — brand column + link groups. Good for landing pages.

const ColumnsFooter = ({
  isEditor,
  content,
  onUpdate,
}: TemplateComponentProps) => {
  const socials = content?.socials ?? [
    {
      label: "Twitter",
    },
    {
      label: "LinkedIn",
    },
    {
      label: "GitHub",
    },
  ];
  return (
    <footer
      className="border-t px-6 py-16"
      style={{
        background: "var(--qs-bg-alt)",
        borderColor: "var(--qs-border)",
      }}
    >
      <div className="mx-auto max-w-6xl grid gap-10 @md:grid-cols-4">
        {/* Brand Column */}
        <div className="@md:col-span-2">
          <p
            className="text-xl font-bold"
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("brand", e.currentTarget.textContent?.trim())
            }
          >
            {content?.brand ?? "My Brand"}
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
            {[0, 1, 2].map((n: any) => (
              <EditableLinkButton
                key={n}
                isEditor={isEditor}
                className="hover:opacity-70 transition-opacity"
                noPreview={true}
                label={socials[n]?.label}
                linkConfig={socials[n]?.linkConfig}
                onLabelChange={(label) => {
                  const updtd = [...socials];
                  updtd[n] = {
                    ...updtd[n],
                    label,
                  };
                  onUpdate("socials", updtd);
                }}
                onLinkChange={(linkConfig) => {
                  const updtd = [...socials];
                  updtd[n] = {
                    ...updtd[n],
                    linkConfig,
                  };
                  onUpdate("socials", updtd);
                }}
              />
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
        {content?.copyright ??
          `© ${new Date().getFullYear()} All rights reserved.`}
      </div>
    </footer>
  );
};

// None variant: Renders no footer at all.

const None = () => <div></div>;

// ─── Registry ─────────────────────────────────────────────────────────────────

export const FooterVariants: VariantRegistry<FooterVariantKey> = {
  classic: ClassicFooter,
  centered: CenteredFooter,
  none: None,
  columns: ColumnsFooter,
};
