import { VariantRegistry } from "../types";
import { TemplateComponentProps } from "@/lib/templates";

import Container from "@/components/shared/Container";
import EditableLinkButton from "@/components/shared/EditableLink";
import TemplateImage from "@/components/shared/TemplateImage";
import { cn } from "@/lib/utils";

export type HeroVariantKey =
  | "background"
  | "split"
  | "minimalist"
  | "default"
  | "centered"
  | "none";

// ─── 1. Background ───────────────────────────────────────────────────────────

const BackgroundVariant = (props: TemplateComponentProps) => {
  const { isEditor, content, onUpdate } = props;

  // Helper to keep the JSX clean and dry for editable elements
  const editableProps = (field: string) => ({
    contentEditable: isEditor,
    suppressContentEditableWarning: true,
    onBlur: (e: React.FocusEvent<HTMLElement>) =>
      onUpdate(field, e.currentTarget.textContent?.trim() || ""),
  });

  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-linear-to-b from-(--qs-bg,#fff) to-(--qs-bg-alt,#f7f7f7) text-center">
      {/* Background Image Component */}
      <TemplateImage
        variant="background"
        source={content?.image1}
        path="hero.image1"
        isEditor={isEditor}
      >
 

        {/* Inner Content Container */}
        <div
          className={cn(
            "relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-4 py-16 @sm:px-8 @md:py-32 pt-20",
          )}
        >
          {/* Badge */}
          <div
            {...editableProps("badge")}
            className="mb-6 inline-flex scale-100 rounded-full border border-(--qs-primary) bg-(--qs-bg-alt,rgba(255,255,255,0.9)) px-4 py-1.5 text-xs font-semibold text-(--qs-primary) shadow-sm backdrop-blur-sm transition-all duration-200 hover:scale-105 @sm:text-sm"
          >
            {content?.badge ?? "👋 Available for Work"}
          </div>

          {/* Heading */}
          <h1
            {...editableProps("title")}
            className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white drop-shadow-md leading-tight outline-none @sm:text-6xl @md:text-7xl"
          >
            {content?.title}
          </h1>

          {/* Description */}
          <p
            {...editableProps("desc")}
            className="mx-auto mt-6 max-w-2xl rounded-2xl border border-white/10 bg-black/20 px-6 py-4.5 text-base font-normal leading-relaxed text-gray-200 backdrop-blur-md outline-none @sm:text-lg @md:text-xl"
          >
            {content?.desc ??
              "Crafting digital experiences with precision and purpose."}
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 @sm:w-auto @sm:flex-row">
            <EditableLinkButton
              isEditor={isEditor}
              label={content?.primaryButton ?? "View Work"}
              linkConfig={content?.primaryButtonLink}
              onLabelChange={(v) => onUpdate("primaryButton", v)}
              onLinkChange={(cfg) => onUpdate("primaryButtonLink", cfg)}
              className="w-full rounded-xl bg-(--qs-primary) px-8 py-4 text-base font-bold text-(--qs-primary-fg) shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,0,0,0.2)] active:translate-y-0 @sm:w-auto text-center"
            />

            {content?.secondaryButton && (
              <EditableLinkButton
                isEditor={isEditor}
                label={content?.secondaryButton}
                linkConfig={content?.secondaryButtonLink}
                onLabelChange={(v) => onUpdate("secondaryButton", v)}
                onLinkChange={(cfg) => onUpdate("secondaryButtonLink", cfg)}
                className="w-full rounded-xl border border-(--qs-border) bg-(--qs-bg-alt,transparent) px-8 py-4 text-base font-semibold text-(--qs-text) backdrop-blur-sm transition-all duration-200 hover:bg-white/10 active:scale-98 @sm:w-auto text-center"
              />
            )}
          </div>
        </div>
      </TemplateImage>
    </section>
  );
};

// ─── 2. Split ─────────────────────────────────────────────────────────────────

const SplitVariant = ({
  isEditor,
  content,
  onUpdate,
}: TemplateComponentProps) => {
  const editableProps = (field: string) => ({
    contentEditable: isEditor,
    suppressContentEditableWarning: true,
    onBlur: (e: React.FocusEvent<HTMLElement>) =>
      onUpdate(field, e.currentTarget.textContent?.trim() || ""),
  });

  return (
    <section
      className="px-4 @sm:px-6 py-12 pt-16 @sm:py-20 @md:py-32"
      style={{
        background:
          "linear-gradient(130deg, var(--qs-bg) 50%, var(--qs-primary) 120%)",
      }}
    >
      <Container>
        <div className="grid gap-10 @md:gap-16 grid-cols-1 @md:grid-cols-2 items-center pt-10">
          <div className="text-center @md:text-left flex flex-col items-center @md:items-start">
            <span
              className="mb-4 block text-xs @sm:text-sm font-bold uppercase tracking-widest text-(--qs-primary)"
              {...editableProps("badge")}
            >
              {content?.badge}
            </span>
            <h1
              className="text-3xl @sm:text-5xl @lg:text-6xl font-bold leading-tight tracking-tight text-(--qs-text)"
              {...editableProps("title")}
            >
              {content?.title}
            </h1>
            <p
              className="mt-6 text-base @sm:text-lg leading-relaxed max-w-xl text-(--qs-text-muted)"
              {...editableProps("desc")}
            >
              {content?.desc}
            </p>
            <div className="mt-8 @sm:mt-10 flex flex-col @sm:flex-row gap-4 w-full @sm:w-auto justify-center @md:justify-start">
              <EditableLinkButton
                isEditor={isEditor}
                label={content?.primaryButton}
                className="w-full @sm:w-auto text-center rounded-lg px-8 py-4 font-bold shadow-lg bg-(--qs-primary) text-(--qs-primary-fg)"
                onLabelChange={(v) => onUpdate("primaryButton", v)}
                linkConfig={content?.primaryButtonLink}
                onLinkChange={(cfg) => onUpdate("primaryButtonLink", cfg)}
              />
              {content?.secondaryButton && (
                <EditableLinkButton
                  isEditor={isEditor}
                  label={content?.secondaryButton}
                  className="w-full @sm:w-auto text-center rounded-lg px-8 py-4 font-bold border-2 border-(--qs-border) text-(--qs-text) bg-(--qs-bg-alt,transparent)"
                  onLabelChange={(v) => onUpdate("secondaryButton", v)}
                  linkConfig={content?.secondaryButtonLink}
                  onLinkChange={(cfg) => onUpdate("secondaryButtonLink", cfg)}
                />
              )}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl @sm:rounded-3xl border-4 @sm:border-0 shadow-2xl w-full max-w-lg @md:max-w-none mx-auto border-(--qs-bg-alt)">
            <TemplateImage
              source={content?.image1}
              path={"hero.image1"}
              isEditor={isEditor}
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

// ─── 3. Minimalist ────────────────────────────────────────────────────────────

const MinimalistVariant = ({
  isEditor,
  content,
  onUpdate,
}: TemplateComponentProps) => (
  <section
    className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 @sm:px-6 text-center py-16 @md:py-24"
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
      className="text-3xl @sm:text-5xl @md:text-6xl @lg:text-7xl font-black uppercase italic tracking-tighter w-full max-w-4xl"
      style={{ color: "var(--qs-text, #111)" }}
      contentEditable={isEditor}
      suppressContentEditableWarning
      onBlur={(e) => onUpdate("title", e.currentTarget.textContent?.trim())}
    >
      {content?.title}
    </h1>
    <div className="mt-8 @sm:mt-10 max-w-2xl w-full">
      <p
        className="text-lg @sm:text-xl @md:text-2xl leading-relaxed"
        style={{ color: "var(--qs-text-muted)" }}
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate("desc", e.currentTarget.textContent?.trim())}
      >
        {content?.desc}
      </p>
      <div className="mt-10 @sm:mt-12 flex flex-col @sm:flex-row justify-center gap-4 @sm:gap-6 w-full @sm:w-auto">
        <EditableLinkButton
          isEditor={isEditor}
          label={content?.primaryButton}
          className="border-b-2 pb-1 text-lg @sm:text-xl font-bold transition-all flex items-center justify-center gap-2"
          style={{
            borderColor: "var(--qs-primary)",
            color: "var(--qs-primary)",
            background: "transparent",
          }}
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
    className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 @sm:px-6 text-center py-16 @md:py-24"
    style={{
      background:
        "linear-gradient(to bottom, var(--qs-primary, #fff) 0%, var(--qs-bg, #f7f7fa) 60%)",
    }}
  >
    {content?.badge && (
      <div
        className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs @sm:text-sm font-medium"
        style={{
          background: "var(--qs-bg-alt)",
          border: "1px solid var(--qs-border)",
          color: "var(--qs-text-muted)",
        }}
        contentEditable={isEditor}
        suppressContentEditableWarning
        onBlur={(e) => onUpdate("badge", e.currentTarget.textContent?.trim())}
      >
        {content.badge}
      </div>
    )}
    <h1
      className="max-w-4xl text-3xl @sm:text-5xl @md:text-7xl font-bold tracking-tight"
      style={{ color: "var(--qs-text, #18181b)" }}
      contentEditable={isEditor}
      suppressContentEditableWarning
      onBlur={(e) => onUpdate("title", e.currentTarget.textContent?.trim())}
    >
      {content?.title}
    </h1>
    <p
      className="mx-auto mt-6 max-w-2xl text-base @sm:text-lg @md:text-xl leading-relaxed"
      style={{ color: "var(--qs-text-muted)" }}
      contentEditable={isEditor}
      suppressContentEditableWarning
      onBlur={(e) => onUpdate("desc", e.currentTarget.textContent?.trim())}
    >
      {content?.desc}
    </p>
    <div className="mt-8 @sm:mt-10 flex flex-col @sm:flex-row items-center @sm:justify-center gap-4 w-full @sm:w-auto">
      <EditableLinkButton
        isEditor={isEditor}
        label={content?.primaryButton ?? "Get Started Free"}
        linkConfig={content?.primaryButtonLink}
        onLabelChange={(v) => onUpdate("primaryButton", v)}
        onLinkChange={(cfg) => onUpdate("primaryButtonLink", cfg)}
        className="w-full @sm:w-auto text-center rounded-xl px-8 py-4 text-base font-bold shadow-lg transition-transform hover:scale-[1.02]"
        style={{
          background: "var(--qs-primary)",
          color: "var(--qs-primary-fg)",
        }}
      />
      {content?.secondaryButton && (
        <EditableLinkButton
          isEditor={isEditor}
          label={content.secondaryButton}
          linkConfig={content?.secondaryButtonLink}
          onLabelChange={(v) => onUpdate("secondaryButton", v)}
          onLinkChange={(cfg) => onUpdate("secondaryButtonLink", cfg)}
          className="w-full @sm:w-auto text-center rounded-xl px-8 py-4 text-base font-semibold transition-all"
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

// ─── 5. Default ─────────────────────────────────────────────────────────────
// const DefaultVariant = ({
//   isEditor,
//   content,
//   onUpdate,
// }: TemplateComponentProps) => {
//   const editableProps = (field: string) => ({
//     contentEditable: isEditor,
//     suppressContentEditableWarning: true,
//     onBlur: (e: React.FocusEvent<HTMLElement>) =>
//       onUpdate(field, e.currentTarget.textContent?.trim() || ""),
//   });

//   return (
//     <section
//       className="relative flex min-h-[85vh] flex-col overflow-hidden px-4 py-20 text-left @sm:px-20 @md:py-32"
//       style={{
//          background:
//           "linear-gradient(130deg, var(--qs-bg) 50%, var(--qs-primary) 120%)",
//       }}
//     >
//       <div className="relative z-10 flex w-full max-w-3xl flex-col items-start">
//         {/* Glassmorphism Badge */}
//         {content?.badge && (
//           <div
//             {...editableProps("badge")}
//             className="mb-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-(--qs-text) shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-md outline-none transition-all duration-300 dark:border-white/10 dark:bg-black/30 @sm:text-sm"
//           >
//             {content.badge}
//           </div>
//         )}
//         {/* Title */}
//         <h1
//           {...editableProps("title")}
//           className="text-(--qs-text) py-2 text-4xl font-extrabold tracking-tight outline-none @sm:text-6xl @md:text-7xl leading-tight text-left w-full"
//         >
//           {content?.title}
//         </h1>
//         {/* Description */}
//         <p
//           {...editableProps("desc")}
//           className="mt-6 max-w-2xl text-base leading-relaxed text-(--qs-text) opacity-80 outline-none @sm:text-xl text-left w-full"
//         >
//           {content?.desc}
//         </p>
//         {/* Dynamic CTAs */}
//         <div className="mt-10 flex w-full flex-col items-start justify-start gap-4 @sm:w-auto @sm:flex-row">
//           <EditableLinkButton
//             isEditor={isEditor}
//             label={content?.primaryButton ?? "Get Started"}
//             linkConfig={content?.primaryButtonLink}
//             onLabelChange={(v) => onUpdate("primaryButton", v)}
//             onLinkChange={(cfg) => onUpdate("primaryButtonLink", cfg)}
//             className="w-full rounded-xl bg-(--qs-primary) px-8 py-4 text-base font-bold text-(--qs-primary-fg) shadow-[0_10px_25px_-5px_rgba(var(--qs-primary),0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 @sm:w-auto text-left"
//             style={{
//               background: "var(--qs-primary)",
//               color: "var(--qs-primary-fg)",
//             }}
//           />

//           {content?.secondaryButton && (
//             <EditableLinkButton
//               isEditor={isEditor}
//               label={content.secondaryButton}
//               linkConfig={content?.secondaryButtonLink}
//               onLabelChange={(v) => onUpdate("secondaryButton", v)}
//               onLinkChange={(cfg) => onUpdate("secondaryButtonLink", cfg)}
//               className="w-full rounded-xl border border-(--qs-border) bg-white/20 px-8 py-4 text-base font-semibold text-(--qs-text) backdrop-blur-xs transition-all duration-200 hover:bg-white/40 active:scale-95 dark:bg-black/20 dark:hover:bg-black/40 @sm:w-auto text-left"
//             />
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

const DefaultVariant = ({
  isEditor,
  content,
  onUpdate,
}: TemplateComponentProps) => {
  const editableProps = (field: string) => ({
    contentEditable: isEditor,
    suppressContentEditableWarning: true,
    onBlur: (e: React.FocusEvent<HTMLElement>) =>
      onUpdate(field, e.currentTarget.textContent?.trim() || ""),
  });

  return (
    <section
      className="px-4 @sm:px-6 py-12 pt-16 @sm:py-20 @md:py-32"
      style={{
        background:
          "linear-gradient(130deg, var(--qs-bg) 50%, var(--qs-primary) 120%)",
      }}
    >
      <Container>
        <div className="grid gap-10 @md:gap-16 grid-cols-1 @md:grid-cols-2 items-center pt-10">
          <div className="text-center @md:text-left flex flex-col items-center @md:items-start">
            <span
              className="mb-4 block text-xs @sm:text-sm font-bold uppercase tracking-widest text-(--qs-primary)"
              {...editableProps("badge")}
            >
              {content?.badge}
            </span>
            <h1
              className="text-3xl @sm:text-5xl @lg:text-6xl font-bold leading-tight tracking-tight text-(--qs-text)"
              {...editableProps("title")}
            >
              {content?.title}
            </h1>
            <p
              className="mt-6 text-base @sm:text-lg leading-relaxed max-w-xl text-(--qs-text-muted)"
              {...editableProps("desc")}
            >
              {content?.desc}
            </p>
            <div className="mt-8 @sm:mt-10 flex flex-col @sm:flex-row gap-4 w-full @sm:w-auto justify-center @md:justify-start">
              <EditableLinkButton
                isEditor={isEditor}
                label={content?.primaryButton}
                className="w-full @sm:w-auto text-center rounded-lg px-8 py-4 font-bold shadow-lg bg-(--qs-primary) text-(--qs-primary-fg)"
                onLabelChange={(v) => onUpdate("primaryButton", v)}
                linkConfig={content?.primaryButtonLink}
                onLinkChange={(cfg) => onUpdate("primaryButtonLink", cfg)}
              />
              {content?.secondaryButton && (
                <EditableLinkButton
                  isEditor={isEditor}
                  label={content?.secondaryButton}
                  className="w-full @sm:w-auto text-center rounded-lg px-8 py-4 font-bold border-2 border-(--qs-border) text-(--qs-text) bg-(--qs-bg-alt,transparent)"
                  onLabelChange={(v) => onUpdate("secondaryButton", v)}
                  linkConfig={content?.secondaryButtonLink}
                  onLinkChange={(cfg) => onUpdate("secondaryButtonLink", cfg)}
                />
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

const None = () => null;

// ─── Registry ─────────────────────────────────────────────────────────────────

export const HeroVariants: VariantRegistry<HeroVariantKey> = {
  background: BackgroundVariant,
  default: DefaultVariant,
  split: SplitVariant,
  minimalist: MinimalistVariant,
  centered: CenteredVariant,
  none: None,
};

export const HeroVariantList: HeroVariantKey[] = [
  "background",
  "default",
  "centered",
  "minimalist",
  "split",
  "none",
];
