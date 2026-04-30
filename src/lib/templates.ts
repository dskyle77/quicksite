/* eslint-disable @typescript-eslint/no-explicit-any */
// @/assets/siteTemplates/templatesRegistry.tsx

import { template1 } from "@/components/siteTemplates/template_1/index";
import { template2 } from "@/components/siteTemplates/template_2/index";
import { template3 } from "@/components/siteTemplates/landing-page-2";

/* -------------- TEMPLATES TYPES ---------------- */
export interface TemplateProps {
  isEditor: boolean;
  content: AnyObject;
  onUpdate?: (path: string, value: any) => void;
  slugs?: Record<string, string>;
}

export interface TemplateComponentProps {
  isEditor: boolean;
  content: AnyObject;
  onUpdate: (path: string, value: any) => void;
  slugs?: Record<string, string>;
}
/* ---------------- TYPES ---------------- */

type AnyObject = Record<string, any>;

/* ---------------- REGISTRY ---------------- */

export const templatesRegistry = [template1, template2];

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
