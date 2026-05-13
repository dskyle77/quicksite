import { SectionVariantRegistry } from "../../types";
import { AboutSection } from "./AboutVariants";
import { SkillsSection } from "./SkillsVariants";
import { ProjectsSection } from "./ProjectsVariants";
import { ExperienceSection } from "./ExperienceVariants";
import { TestimonialsSection } from "./TestimonialsVariants";
import { ContactSection } from "./ContactVariants";
import { FeaturesSection } from "./FeaturesVariants";
import { PricingSection } from "./PricingVariants";
import { FaqSection } from "./FaqVariants";
import { CtaSection } from "./CtaVariants";

export const SectionVariants: Partial<SectionVariantRegistry> = {
  about: AboutSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  experience: ExperienceSection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
  features: FeaturesSection,
  pricing: PricingSection,
  faq: FaqSection,
  cta: CtaSection,
};