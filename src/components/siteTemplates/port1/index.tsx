/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { TemplateProps } from "@/lib/templates";
import {
  template2StarterContent,
  template2Config,
  template2Meta,
} from "./content";
import { Navbar, Footer } from "./layout";

import Home from "./home";
import Projects from "./projects";

// ─── Root Template ────────────────────────────────────────────────────────────

export default function Template2({
  isEditor,
  content,
  onUpdate,
  slugs,
}: TemplateProps) {
  const handleUpdate = (path: string, value: any) => {
    if (onUpdate) onUpdate(path, value);
  };
  const subslug = slugs?.subslug;

  if (!subslug) {
    // Default: render the full homepage
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

  const Subpage = template2Subpages[subslug as keyof typeof template2Subpages];

  // Render a registered subpage component if it exists
  if (Subpage) {
    return (
      <div
        className="min-h-screen"
        style={{
          background: "var(--qs-bg)",
          color: "var(--qs-text)",
          fontFamily: "var(--qs-font)",
        }}
      >
        <Subpage
          isEditor={isEditor}
          content={content}
          onUpdate={onUpdate}
          slugs={slugs}
        />
      </div>
    );
  }

  // 404-style fallback: subslug provided but no matching page/component
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--qs-bg)",
        color: "var(--qs-text)",
        fontFamily: "var(--qs-font)",
      }}
    >
      <Navbar
        isEditor={isEditor}
        content={content}
        onUpdate={handleUpdate}
        slugs={slugs}
      />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-40 text-center">
        <div className="text-5xl">📄</div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight">
          Page not found
        </h2>
        <p className="mt-4" style={{ color: "var(--qs-text-muted)" }}>
          No page exists at this URL yet.
        </p>
      </div>
      <Footer isEditor={isEditor} content={content} onUpdate={handleUpdate} />
    </div>
  );
}

const template2Subpages = {
  projects: Projects,
};

export const template2 = {
  meta: template2Meta,
  config: template2Config,
  template: Template2,
  starterContent: template2StarterContent,
};
