/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  builderConfigStarter,
  starterMap,
  schemaMap,
} from "@/components/templateBuilder/contentBlocks";
import { variantOptions } from "@/components/templateBuilder/variantOptions";

const getStarterContent = (params: {
  selectedTitle?: string;
  whatsappNumber?: string;
  defaultMessage?: string;
  defaultImage?: string;
}) => {
  const config = builderConfigStarter();

  const content: any = {
    builderConfig: config,
    navbar: starterMap.navbar(params),
    hero: starterMap.hero(params),
    footer: starterMap.footer(params),
  };

  config.sections.forEach((sec) => {
    const starterFn = starterMap[sec.type];
    if (starterFn) {
      const contentKey = `${sec.id}${sec.type}`;
      content[contentKey] = starterFn(params);
    }
  });

  return content;
};

const getSchema = (params: {
  selectedTitle?: string;
  whatsappNumber?: string;
  defaultMessage?: string;
  defaultImage?: string;
}) => {
  const config = builderConfigStarter();

  const schema: any = {
    builderConfig: {
      _note: `AI: Use valid variant keys from ${JSON.stringify(variantOptions)} for navbar, hero, footer and sections.`,
      navbar: "classic | glass | centered",
      hero: "dynamic | split | minimalist | centered",
      footer: "classic | centered | minimal | columns",
      sections: config.sections.map((sec) => ({
        id: sec.id,
        type: sec.type,
        variant: "Pick a valid variant",
        enabled: true,
      })),
    },
    navbar: schemaMap.navbar(params),
    hero: schemaMap.hero(params),
    footer: schemaMap.footer(params),
  };

  // Inject scoped schemas for AI to fill
  config.sections.forEach((sec) => {
    const schemaFn = schemaMap[sec.type];
    if (schemaFn) {
      const contentKey = `${sec.id}${sec.type}`;
      schema[contentKey] = schemaFn(params);
    }
  });

  return schema;
};

export const templateBuilderContent = {
  meta: {
    title: "Custom",
    image: "/ti/builder.png",
    category: "custom",
    description:
      "Fully dynamic template builder supporting multiple section instances.",
  },
  config: {
    type: "template-builder",
    theme: "warm",
  },
  getSchema,
  getStarterContent,
};
