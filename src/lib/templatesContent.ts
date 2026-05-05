// @/assets/siteTemplates/contentRegistry.ts

import {
  template1Meta,
  template1StarterContent,
  template1Config,
} from "@/components/siteTemplates/landing-page1/content";
import {
  template2Meta,
  template2StarterContent,
  template2Config,
} from "@/components/siteTemplates/port1/content";
import {
  templateMiniMeta,
  templateMiniConfig,
  templateMiniStarterContent,
} from "@/components/siteTemplates/mini-port/content";

/* This registry contains ONLY data and logic. 
   Safe for use in API Routes (Server Side).
*/
export const contentRegistry = [
  {
    template1Meta,
    config: template1Config,
    starterContent: template1StarterContent,
  },
  {
    template2Meta,
    config: template2Config,
    starterContent: template2StarterContent,
  },
  {
    templateMiniMeta,
    config: templateMiniConfig,
    starterContent: templateMiniStarterContent,
  },
];

export const getTemplateContentByType = (type: string) =>
  contentRegistry.find((t) => t.config.type === type);

export const isValidTemplate = (type: string) =>
  !!getTemplateContentByType(type);
