// @/assets/siteTemplates/contentRegistry.ts

import { template1Content } from "@/components/siteTemplates/landing-page1/content";
import { template2Content } from "@/components/siteTemplates/port1/content";
import { templateMiniContent } from "@/components/siteTemplates/mini-port/content";

/* This registry contains ONLY data and logic. 
   Safe for use in API Routes (Server Side).
*/
export const contentRegistry = [
  template1Content,
  template2Content,
  templateMiniContent,
];

export const getTemplateContentByType = (type: string) =>
  contentRegistry.find((t) => t.config.type === type);

export const isValidTemplate = (type: string) =>
  !!getTemplateContentByType(type);
