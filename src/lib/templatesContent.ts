// @/lib/templatesContent.ts

import { portfolio3Content } from "@/components/siteTemplates/portfolio3/content";
import { templateBuilderContent } from "@/components/siteTemplates/templateBuilder/content"; // ← new

/* This registry contains ONLY data and logic.
   Safe for use in API Routes (Server Side).
*/
export const contentRegistry = [
  portfolio3Content,
  templateBuilderContent,
];

export const getTemplateContentByType = (type: string) =>
  contentRegistry.find((t) => t.config.type === type);

export const isValidTemplate = (type: string) =>
  !!getTemplateContentByType(type);