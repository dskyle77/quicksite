/* eslint-disable @typescript-eslint/no-explicit-any */
import { portfolioConfig } from "@/components/templateBuilder/configs";
import {
  buildStarterContent,
  buildSchema,
} from "@/components/templateBuilder/contentBlocks";

// getStarterContent and getSchema extracted from builder functions
const getStarterContent = (params: {
  selectedTitle?: string;
  whatsappNumber?: string;
  defaultMessage?: string;
  defaultImage?: string;
}) => buildStarterContent({ config: portfolioConfig(), params });

const getSchema = (params: {
  selectedTitle?: string;
  whatsappNumber?: string;
  defaultMessage?: string;
  defaultImage?: string;
}) => buildSchema({ config: portfolioConfig(), params });

export const portfolio3Content = {
  meta: {
    title: "Portfolio 3",
    image: "/ti/builder.png",
    category: "portfolio-3",
    description:
      "Fully dynamic template builder supporting multiple section instances.",
  },
  config: {
    type: "portfolio-3",
    theme: "warm",
  },
  getSchema,
  getStarterContent,
};
