/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { TemplateProps } from "@/lib/templates";
import { template1Content } from "./content";
import Home from "./HomePage";

export default function Template1({
  isEditor,
  content,
  onUpdate,
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
      <Home isEditor={isEditor} content={content} onUpdate={onUpdate} />
    </div>
  );
}

export const template1 = {
  ...template1Content,
  template: Template1,
};
