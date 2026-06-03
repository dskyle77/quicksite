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
  isPreview,
  hasNavbar
}: TemplateProps & { isPreview: boolean }) {
  const handleUpdate = (path: string, value: any) => {
    if (onUpdate) onUpdate(path, value);
  };

  const { value } = useSiteContext();
  const { slugs } = value;

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
        isPreview={isPreview}
        isEditor={isEditor}
        content={content}
        onUpdate={handleUpdate}
        slugs={slugs}
        customize={canCustomize}
        hasNavbar={hasNavbar}
      />
    </div>
  );
}
