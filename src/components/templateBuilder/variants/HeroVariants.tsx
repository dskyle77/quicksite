/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  VariantRegistry,
  HeroVariantKey,
} from "../types";
import { TemplateComponentProps } from "@/lib/templates";

import TemplateImage from "@/components/shared/TemplateImage";
import DynamicHero from "@/components/shared/DynamicHero";
import CtaLink from "@/components/shared/CtaLinkModal";

// All variants below use the `var(--qs-*)` theme as much as possible for backgrounds, text, buttons, borders, accents

// ─── 1. Dynamic ───────────────────────────────────────────────────────────────

const DynamicVariant = (props: TemplateComponentProps) => {
  const { isEditor, content, onUpdate } = props;

  return (
    <DynamicHero
      {...props}
      defaultType={content?.type ?? "background"}
      renderText={(heroType) => (
        <div
          className={
            heroType === "background"
              ? "text-center mx-auto"
              : ""
          }
        >
          {/* Badge */}
          <div
            className="mb-5 inline-flex rounded-full px-4 py-2 text-sm font-medium"
            style={{
              background: "var(--qs-bg-alt)",
              border: "1px solid var(--qs-border)",
              color: "var(--qs-text-muted)",
            }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("badge", e.currentTarget.textContent?.trim())
            }
          >
            {content?.badge ?? "👋 Available for Work"}
          </div>

          <h2
            className={`max-w-xl text-4xl font-bold tracking-tight md:text-6xl ${
              heroType === "background" ? "mx-auto" : ""
            }`}
            style={{
              color: heroType === "background"
                ? "var(--qs-bg-contrast, var(--qs-primary-fg, white))"
                : "var(--qs-text, #222)",
            }}
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("title", e.currentTarget.textContent?.trim())
            }
          >
            {content?.title ?? "Hi, I'm Alex"}
          </h2>

          <p
            className={`mt-6 max-w-xl text-base leading-7 md:text-lg ${
              heroType === "background" ? "mx-auto" : ""
            }`}
            style={
              heroType === "background"
                ? { color: "var(--qs-text-muted, #d1d5db)" }
                : { color: "var(--qs-text-muted, #555)" }
            }
            contentEditable={isEditor}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate("desc", e.currentTarget.textContent?.trim())
            }
          >
            {content?.desc}
          </p>

          <div
            className={`mt-8 flex flex-wrap gap-4 ${
              heroType === "background" ? "justify-center" : ""
            }`}
          >
            <CtaLink
              isEditor={isEditor}
              label={content?.primaryButton ?? "View Work"}
              linkConfig={content?.primaryButtonLink}
              onLabelChange={(v) => onUpdate("primaryButton", v)}
              onLinkChange={(cfg) => onUpdate("primaryButtonLink", cfg)}
              className="rounded-xl px-6 py-3 font-semibold transition-transform hover:scale-[1.02]"
              style={{
                background: "var(--qs-primary)",
                color: "var(--qs-primary-fg)",
              }}
            />
            {content?.secondaryButton && (
              <CtaLink
                isEditor={isEditor}
                label={content?.secondaryButton}
                linkConfig={content?.secondaryButtonLink}
                onLabelChange={(v) => onUpdate("secondaryButton", v)}
                onLinkChange={(cfg) => onUpdate("secondaryButtonLink", cfg)}
                className="rounded-xl px-6 py-3 font-semibold transition-transform hover:scale-[1.02]"
                style={{
                  background: "var(--qs-bg-alt)",
                  color: "var(--qs-text)",
                  border: "1px solid var(--qs-border)",
                }}
              />
            )}
          </div>
        </div>
      )}
    />
  );
};

// ─── 2. Split ─────────────────────────────────────────────────────────────────

const SplitVariant = ({
  isEditor,
  content,
  onUpdate,
}: TemplateComponentProps) => (
  <section
    className="mx-auto max-w-7xl px-6 py-20 md:py-32"
    style={{ background: "var(--qs-bg, white)" }}
  >
    <div className="grid gap-16 md:grid-cols-2 md:items-center">
      <div>
        <span
          className="mb-4 block text-sm font-bold uppercase tracking-widest"
          style={{ color: "var(--qs-primary)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate("badge", e.currentTarget.textContent?.trim())}
        >
          {content?.badge}
        </span>
        <h1
          className="text-5xl font-bold leading-tight md:text-7xl"
          style={{
            color: "var(--qs-text, #18181b)"
          }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate("title", e.currentTarget.textContent?.trim())}
        >
          {content?.title}
        </h1>
        <p
          className="mt-8 text-lg leading-relaxed"
          style={{ color: "var(--qs-text-muted)" }}
          contentEditable={isEditor}
          suppressContentEditableWarning
          onBlur={(e) => onUpdate("desc", e.currentTarget.textContent?.trim())}
        >
          {content?.desc}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <CtaLink
            isEditor={isEditor}
            label={content?.primaryButton}
            className="rounded-lg px-8 py-4 font-bold shadow-lg"
            style={{
              background: "var(--qs-primary)",
              color: "var(--qs-primary-fg)",
            }}
            onLabelChange={(v) => onUpdate("primaryButton", v)}
            linkConfig={content?.primaryButtonLink}
            onLinkChange={(cfg) => onUpdate("primaryButtonLink", cfg)}
          />
          {content?.secondaryButton && (
            <CtaLink
              isEditor={isEditor}
              label={content?.secondaryButton}
              className="rounded-lg px-8 py-4 font-bold"
              style={{
                border: "2px solid var(--qs-border)",
                color: "var(--qs-text)",
                background: "var(--qs-bg-alt, transparent)",
              }}
              onLabelChange={(v) => onUpdate("secondaryButton", v)}
              linkConfig={content?.secondaryButtonLink}
              onLinkChange={(cfg) => onUpdate("secondaryButtonLink", cfg)}
            />
          )}
        </div>
      </div>
      <div
        className="relative aspect-square overflow-hidden rounded-3xl border-8 shadow-2xl"
        style={{ borderColor: "var(--qs-bg-alt)" }}
      >
        <TemplateImage
          source={content?.image1}
          publicId={content?.image1PId}
          isEditor={isEditor}
          onImageChange={(url, pId) =>
            onUpdate(null, { ...content, image1: url, image1PId: pId })
          }
        />
      </div>
    </div>
  </section>
);

// ─── 3. Minimalist ────────────────────────────────────────────────────────────

const MinimalistVariant = ({
  isEditor,
  content,
  onUpdate,
}: TemplateComponentProps) => (
  <section
    className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 text-center"
    style={{ background: "var(--qs-bg, #fff)" }}
  >
    <div
      className="absolute inset-0 -z-10 opacity-20"
      style={{
        backgroundImage:
          "radial-gradient(circle, var(--qs-primary) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
    <h1
      className="text-3xl font-black uppercase italic tracking-tighter md:text-6xl"
      style={{ color: "var(--qs-text, #111)" }}
      contentEditable={isEditor}
      suppressContentEditableWarning
      onBlur={(e) => onUpdate("title", e.currentTarget.textContent?.trim())}
    >
      {content?.title}
    </h1>
    <div className="mt-10 max-w-2xl">
      <p
        className="text-xl leading-relaxed md:text-2xl"
        style={{ color: "var(--qs-text-muted)" }}
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate("desc", e.currentTarget.textContent?.trim())}
      >
        {content?.desc}
      </p>
      <div className="mt-12 flex justify-center gap-6">
        <CtaLink
          isEditor={isEditor}
          label={content?.primaryButton}
          className="border-b-2 pb-1 text-xl font-bold transition-all flex items-center gap-2"
          style={{ borderColor: "var(--qs-primary)", color: "var(--qs-primary)", background: "transparent" }}
          onLabelChange={(v) => onUpdate("primaryButton", v)}
          linkConfig={content?.primaryButtonLink}
          onLinkChange={(cfg) => onUpdate("primaryButtonLink", cfg)}
        />
      </div>
    </div>
  </section>
);

// ─── 4. Centered ─────────────────────────────────────────────────────────────

const CenteredVariant = ({
  isEditor,
  content,
  onUpdate,
}: TemplateComponentProps) => (
  <section
    className="relative flex min-h-[75vh] flex-col items-center justify-center px-6 text-center py-24"
    style={{ background: "var(--qs-bg, #fff)" }}
  >
    {content?.badge && (
      <div
        className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
        style={{
          background: "var(--qs-bg-alt)",
          border: "1px solid var(--qs-border)",
          color: "var(--qs-text-muted)"
        }}
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate("badge", e.currentTarget.textContent?.trim())}
      >
        {content.badge}
      </div>
    )}
    <h1
      className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl"
      style={{ color: "var(--qs-text, #18181b)" }}
      contentEditable={isEditor}
      suppressContentEditableWarning
      onBlur={(e) => onUpdate("title", e.currentTarget.textContent?.trim())}
    >
      {content?.title}
    </h1>
    <p
      className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed md:text-xl"
      style={{ color: "var(--qs-text-muted)" }}
      contentEditable={isEditor}
      suppressContentEditableWarning
      onBlur={(e) => onUpdate("desc", e.currentTarget.textContent?.trim())}
    >
      {content?.desc}
    </p>
    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
      <CtaLink
        isEditor={isEditor}
        label={content?.primaryButton ?? "Get Started Free"}
        linkConfig={content?.primaryButtonLink}
        onLabelChange={(v) => onUpdate("primaryButton", v)}
        onLinkChange={(cfg) => onUpdate("primaryButtonLink", cfg)}
        className="rounded-xl px-8 py-4 text-base font-bold shadow-lg transition-transform hover:scale-[1.02]"
        style={{
          background: "var(--qs-primary)",
          color: "var(--qs-primary-fg)",
        }}
      />
      {content?.secondaryButton && (
        <CtaLink
          isEditor={isEditor}
          label={content.secondaryButton}
          linkConfig={content?.secondaryButtonLink}
          onLabelChange={(v) => onUpdate("secondaryButton", v)}
          onLinkChange={(cfg) => onUpdate("secondaryButtonLink", cfg)}
          className="rounded-xl px-8 py-4 text-base font-semibold transition-all"
          style={{
            color: "var(--qs-text)",
            border: "1px solid var(--qs-border)",
            background: "var(--qs-bg-alt, transparent)",
          }}
        />
      )}
    </div>
  </section>
);

// ─── Registry ─────────────────────────────────────────────────────────────────

export const HeroVariants: VariantRegistry<HeroVariantKey> = {
  dynamic: DynamicVariant,
  split: SplitVariant,
  minimalist: MinimalistVariant,
  centered: CenteredVariant,
  // video: VideoVariant, // ← add when built
};
