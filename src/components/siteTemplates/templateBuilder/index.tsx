/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { TemplateProps } from "@/lib/templates";
import TemplateBuilder from "@/components/templateBuilder/TemplateBuilder";
import { templateBuilderContent } from "./content";

function TemplateBuilderTemplate({
  isEditor,
  content,
  onUpdate,
  slugs,
}: TemplateProps) {
  const handleUpdate = (path: string, value: any) => {
    if (onUpdate) onUpdate(path, value);
  };

  // ── Main page ───────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        background: "var(--qs-bg)",
        color: "var(--qs-text)",
        fontFamily: "var(--qs-font)",
      }}
    >
      <TemplateBuilder
        isEditor={isEditor}
        content={content}
        onUpdate={handleUpdate}
        slugs={slugs}
      />
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const templateBuilder = {
  ...templateBuilderContent,
  template: TemplateBuilderTemplate,
};