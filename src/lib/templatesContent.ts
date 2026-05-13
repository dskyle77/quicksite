// @/lib/templatesContent.ts

import { template1Content } from "@/components/siteTemplates/landing-page1/content";
import { landingPage2Content } from "@/components/siteTemplates/landing-page2/content";
import { portfolio1Content } from "@/components/siteTemplates/portfolio1/content";
import { portfolio2Content } from "@/components/siteTemplates/portfolio2/content";
import { templateBuilderContent } from "@/components/siteTemplates/templateBuilder/content"; // ← new

/* This registry contains ONLY data and logic.
   Safe for use in API Routes (Server Side).
*/
export const contentRegistry = [
  template1Content,
  landingPage2Content,
  portfolio1Content,
  portfolio2Content,
  templateBuilderContent, // ← new
];

export const getTemplateContentByType = (type: string) =>
  contentRegistry.find((t) => t.config.type === type);

export const isValidTemplate = (type: string) =>
  !!getTemplateContentByType(type);