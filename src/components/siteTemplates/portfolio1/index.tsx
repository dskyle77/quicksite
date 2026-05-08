/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { TemplateProps } from "@/lib/templates";
import { portfolio1Content } from "./content";
import Home from "./home";

function Portfolio1({ isEditor, content, onUpdate, slugs }: TemplateProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--qs-bg)",
        color: "var(--qs-text)",
        fontFamily: "var(--qs-font)",
      }}
    >
      <Home
        isEditor={isEditor}
        content={content}
        onUpdate={onUpdate}
        slugs={slugs}
      />
    </div>
  );
}

export const portfolio1 = {
  ...portfolio1Content,
  template: Portfolio1,
};
