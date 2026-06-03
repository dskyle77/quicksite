// src/lib/templates.ts
// UPDATED — add eventSite, digitalStore, portfolioTwo to registry

/* eslint-disable @typescript-eslint/no-explicit-any */

import templateBuilder from "@/components/siteTemplates/custom";
import portfolio1 from "@/components/siteTemplates/portfolioOne";
import portfolioTwo from "@/components/siteTemplates/portfolioTwo";
import menuOne from "@/components/siteTemplates/menuOne";
import eventSite from "@/components/siteTemplates/eventSite";
import digitalStore from "@/components/siteTemplates/digitalStore";
import landingPage from "@/components/siteTemplates/landingPage";
import landingPage2 from "@/components/siteTemplates/landingPage2";

// New Templates
import restaurant from "@/components/siteTemplates/restaurant";
import fashion from "@/components/siteTemplates/fashion";
import beauty from "@/components/siteTemplates/beauty";
import photographer from "@/components/siteTemplates/photographer";
import professional from "@/components/siteTemplates/professional";
import events from "@/components/siteTemplates/events";
import realEstate from "@/components/siteTemplates/real-estate";
import store from "@/components/siteTemplates/store";

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
  hasNavbar: boolean
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
  restaurant,
  fashion,
  beauty,
  photographer,
  professional,
  events,
  realEstate,
  store,
  landingPage,
  landingPage2,
  menuOne,
  eventSite,
  digitalStore,
  portfolio1,
  portfolioTwo,
  templateBuilder,
];

export const premiumTemplates: TemplateContent[] = [templateBuilder];

export const templatesCategories = Array.from(
  new Set(
    templatesRegistry
      .map((t: any) => t.meta?.category)
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
