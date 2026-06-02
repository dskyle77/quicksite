import { builderConfig } from "@/components/templateBuilder/configs";
import { TemplateContent } from "@/lib/templates";

const customContent: TemplateContent = {
  meta: {
    title: "Custom",
    image: "/ti/builder.png",
    category: "custom",
    description:
      "Fully dynamic template builder supporting multiple section instances.",
  },
  config: {
    type: "custom",
    theme: "warm",
    canCustomize: true,
    isPremium: false

  },
  contentConfig: builderConfig,
};

export default customContent;
