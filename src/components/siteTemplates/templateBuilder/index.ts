import { builderConfig } from "@/components/templateBuilder/configs";

const templateBuilderContent = {
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
    canCustomize: true
  },
  contentConfig: builderConfig,
};

export default templateBuilderContent;
