import { builderConfig } from "@/components/templateBuilder/configs";
import { TemplateContent } from "@/lib/templates";

const templateBuilderContent: TemplateContent = {
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
    isPremium: true

  },
  contentConfig: builderConfig,
};

export default templateBuilderContent;
