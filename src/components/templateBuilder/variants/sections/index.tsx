import { SectionVariantRegistry } from "../../types";
import { AboutSection } from "./AboutVariants";
import { SkillsSection } from "./SkillsVariants";
import { ItemsSection } from "./ItemsVariants";
import { TextSection } from "./TextSection";
import { ExperienceSection } from "./ExperienceVariants";
import { TestimonialsSection } from "./TestimonialsVariants";
import { ContactSection } from "./ContactVariants";
import { FeaturesSection } from "./FeaturesVariants";
import { PricingSection } from "./PricingVariants";
import { FaqSection } from "./FaqVariants";
import { CtaSection } from "./CtaVariants";

export const SectionVariants: SectionVariantRegistry = {
  about: AboutSection,
  skills: SkillsSection,
  items: ItemsSection,
  experience: ExperienceSection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
  text: TextSection,
  features: FeaturesSection,
  pricing: PricingSection,
  faq: FaqSection,
  cta: CtaSection,
};
