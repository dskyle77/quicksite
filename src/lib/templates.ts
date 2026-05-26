/* eslint-disable @typescript-eslint/no-explicit-any */
// @/lib/templates.ts

import templateBuilder from "@/components/siteTemplates/templateBuilder";
import portfolio1 from "@/components/siteTemplates/portfolioOne";
import menuOne from "@/components/siteTemplates/menuOne";
import {
  schemaMap,
  starterMap,
} from "@/components/templateBuilder/contentBlocks";

/* -------------- TEMPLATES TYPES ---------------- */
export interface TemplateProps {
  isEditor: boolean;
  content: AnyObject;
  canCustomize: boolean;
  onUpdate?: (path: string, value: any) => void;
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

export type TemplateContent = {
  meta: {
    title: string;
    image: string;
    category: string;
    description: string;
  };
  config: {
    type: string;
    theme: string;
    canCustomize: boolean;
    isPremium: boolean;
  };
  contentConfig: any;
  starterContent?: (...args: any[]) => any;
};

/* ---------------- REGISTRY ---------------- */

export const templatesRegistry: TemplateContent[] = [
  menuOne,
  portfolio1,
  templateBuilder,
];

export const premiumTemplates: TemplateContent[] = [
  portfolio1,
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

export const isPremiumTemplate = (type: string) =>
  !!premiumTemplates.find((t) => t.config.type === type);

export const buildStarterContent = (
  config: any,
  params: {
    selectedTitle?: string;
    whatsappNumber?: string;
    defaultMessage?: string;
    defaultImage?: string;
  },
) => {
  const content: any = {
    builderConfig: config,
    navbar: starterMap.navbar(params),
    hero: starterMap.hero(params),
    footer: starterMap.footer(params),
  };

  config.sections.forEach((sec: any) => {
    const starterFn = starterMap[sec.type];
    if (starterFn) {
      const contentKey = `${sec.id}${sec.type}`;
      content[contentKey] = starterFn(params);
    }
  });

  return content;
};

export const buildSchema = (
  config: any,
  params: {
    selectedTitle?: string;
    whatsappNumber?: string;
    defaultMessage?: string;
    defaultImage?: string;
  } = {},
  defaultThemeId?: string,
) => {
  const schema: any = {
    theme: defaultThemeId ?? "",
    builderConfig: config,
    navbar: schemaMap.navbar(params),
    hero: schemaMap.hero(params),
    footer: schemaMap.footer(params),
  };

  if (Array.isArray(config.sections)) {
    config.sections.forEach((sec: any) => {
      const schemaFn = schemaMap[sec.type];
      if (schemaFn) {
        const contentKey = `${sec.id}${sec.type}`;
        schema[contentKey] = schemaFn(params);
      }
    });
  }

  return schema;
};
