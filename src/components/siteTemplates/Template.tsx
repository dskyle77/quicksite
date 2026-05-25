/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { TemplateProps } from "@/lib/templates";
import TemplateBuilder from "@/components/templateBuilder/TemplateBuilder";
import { useSiteContext } from "@/context/SiteContext";

export default function Template({
  isEditor,
  content,
  onUpdate,
  canCustomize,
}: TemplateProps) {
  const handleUpdate = (path: string, value: any) => {
    if (onUpdate) onUpdate(path, value);
  };

  const { slugs } = useSiteContext();

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
        customize={canCustomize}
      />
    </div>
  );
}
