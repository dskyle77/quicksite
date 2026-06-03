import { SectionVariantRegistry } from "../../types";
import { AboutSection } from "./AboutVariants";
import { SkillsSection } from "./SkillsVariants";
import { ItemsSection } from "./ItemsVariants";
import { MenuSection } from "./MenuVariants";
import { TextSection } from "./TextSection";
import { ExperienceSection } from "./ExperienceVariants";
import { TestimonialsSection } from "./TestimonialsVariants";
import { ContactSection } from "./ContactVariants";
import { FormSection } from "./FormVariants";
import { FeaturesSection } from "./FeaturesVariants";
import { PricingSection } from "./PricingVariants";
import { FaqSection } from "./FaqVariants";
import { CtaSection } from "./CtaVariants";
import { GallerySection } from "./GalleryVariants";

export const SectionVariants: SectionVariantRegistry = {
  about: AboutSection,
  skills: SkillsSection,
  items: ItemsSection,
  menu: MenuSection,
  experience: ExperienceSection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
  form: FormSection,
  text: TextSection,
  features: FeaturesSection,
  pricing: PricingSection,
  faq: FaqSection,
  cta: CtaSection,
  gallery: GallerySection,
};

