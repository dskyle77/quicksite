/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { TemplateProps } from "@/lib/templates";
import TemplateBuilder from "@/components/templateBuilder/TemplateBuilder";
import { portfolio3Content } from "./content";

function Template({
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
        customize={false}
      />
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const portfolio3 = {
  ...portfolio3Content,
  template: Template,
};