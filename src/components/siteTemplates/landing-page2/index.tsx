/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { TemplateProps } from "@/lib/templates";
import { landingPage2Content } from "./content";
import Home from "./home";

function LandingPage2({
  isEditor,
  content,
  onUpdate,
  slugs,
}: TemplateProps) {
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

export const landingPage2 = {
  ...landingPage2Content,
  template: LandingPage2,
};
