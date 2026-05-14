/* eslint-disable @typescript-eslint/no-explicit-any */
// @/lib/templates.ts

import { templateBuilder } from "@/components/siteTemplates/templateBuilder"; // ← new
import { portfolio3 } from "@/components/siteTemplates/portfolio3"; // ← new

/* -------------- TEMPLATES TYPES ---------------- */
export interface TemplateProps {
  isEditor: boolean;
  content: AnyObject;
  onUpdate?: (path: string, value: any) => void;
  slugs?: Record<string, string>;
  isCustomDomain?: boolean;
}

export interface TemplateComponentProps {
  isEditor: boolean;
  content: AnyObject;
  onUpdate: (path: string | null, value: any) => void;
  slugs?: Record<string, string>;
}
/* ---------------- TYPES ---------------- */

type AnyObject = Record<string, any>;

/* ---------------- REGISTRY ---------------- */

export const templatesRegistry = [
  portfolio3,
  templateBuilder,
];

export const templatesCategories = Array.from(
  new Set(
    templatesRegistry
      .map((t: any) => t.category)
      .filter((category) => !!category),
  ),
);

export const getTemplateByType = (type: string) =>
  templatesRegistry.find((t) => t.config.type === type);

export const isValidTemplate = (type: string) => !!getTemplateByType(type);
