/* eslint-disable @typescript-eslint/no-explicit-any */
import { TemplateComponentProps } from "@/lib/templates";
// ─── Template Builder — Core Types ────────────────────────────────────────────
// This file is the single source of truth for all builder configuration shapes.
// Adding a new block type? Add its variant keys here, then register the
// component in the variants files — nothing else needs to change.

import React from "react";
import { LinkConfig } from "../shared/EditableLink";

// ─── Shared Component Interface ───────────────────────────────────────────────

export type SectionProps = TemplateComponentProps & {
  variant?: SectionVariantKey;
  position: number;
  anchorName: string;
  path: string;
};

// ─── Block Variant Keys ───────────────────────────────────────────────────────
// Each union represents the available style variants for that block.
// Extend these as you add new variants to the variant files.

export type NavbarVariantKey = "classic" | "minimal";
export type HeroVariantKey =
  | "background" 
  | "split" 
  | "minimalist" 
  | "centered"
  | "none"

export type FooterVariantKey = "classic" | "centered" | "none" | "columns";

export type SectionType =
  | "about"
  | "skills"
  | "items"
  | "menu"
  | "experience"
  | "testimonials"
  | "contact"
  | "faq"
  | "pricing"
  | "cta"
  | "text"
  | "features"
  | "team"
  | "gallery";

export type SectionVariantKey =
  | "default"
  | "split"
  | "grid"
  | "list"
  | "card"
  | "carousel"
  | "timeline"
  | "cards"
  | "minimal"
  | "centered"
  | "card-stats"
  | "tags"
  | "icons"
  | "compact"
  | "minimal-left"
  | "banner"
  | "form"
  | "simple"
  | "numbered"
  | "accordion"
  | "highlight-top"
  | "card-stack"
  | "card-grid";

// ─── Section Config ───────────────────────────────────────────────────────────

export interface SectionConfig {
  /** Unique ID — used as React key and for reordering */
  id: string;
  /** Which section component to render */
  type: SectionType;
  /** Which visual variant of that section to render */
  variant: SectionVariantKey;
  /** Toggle visibility without removing from config */
  enabled: boolean;
  /** Optional override title shown in the editor sidebar */
  label?: string;

  anchorName: string;
}

// ─── Theme Config ─────────────────────────────────────────────────────────────

export interface ThemeConfig {
  /** Maps to --qs-primary CSS variable */
  primaryColor?: string;
  /** Controls global border-radius feel */
  borderRadius?: "none" | "md" | "full";
  /** Controls global font family */
  fontFamily?: string;
}

// ─── Builder Config ───────────────────────────────────────────────────────────
// This is what you store per-template to describe its layout + variants.

export interface BuilderConfig {
  /** Which navbar variant to render */
  navbar: NavbarVariantKey;
  /** Which hero variant to render */
  hero: HeroVariantKey;
  /** Which footer variant to render */
  footer: FooterVariantKey;
  /** Ordered list of content sections (rendered top-to-bottom) */
  sections: SectionConfig[];
  /** Optional theme overrides */
  theme?: ThemeConfig;
}

// ─── Variant Component Registry Shape ─────────────────────────────────────────
// Each variant file exports a Record<string, React.FC<TemplateComponentProps>>.
// Section variants also receive `variant` as a prop for internal switching.

export type VariantRegistry<K extends string = string> = Record<
  K,
  React.FC<TemplateComponentProps>
>;

export type SectionVariantRegistry = Record<
  SectionType,
  React.FC<
    TemplateComponentProps & {
      variant: SectionVariantKey;
      position: number;
      anchorName: string;
      path: string;
    }
  >
>;

// ─── Schema / Starter Content Helpers ────────────────────────────────────────
// Each template's content.ts exports these two functions.
// getSchema → empty structure (used by AI to know what to fill)
// getStarterContent → pre-filled defaults (used when creating a new site)

export interface SchemaParams {
  selectedTitle?: string;
  whatsappNumber: string;
  defaultImage?: string;
  
}

export type GetSchema = (params: SchemaParams) => Record<string, any>;
export type GetStarterContent = (params: SchemaParams) => Record<string, any>;

// ─── Block-Level Content Schemas ─────────────────────────────────────────────
// These describe the content shape for each block type.
// Import and use inside getSchema / getStarterContent to keep them DRY.

export interface NavbarContent {
  logo: string;
  title: string;
  ctaButton: string;
  ctaButtonLink: Record<string, any>;
  links: Record<string, string>[];
}

export interface HeroContent {
  type?: string;
  badge?: string;
  title: string;
  desc: string;
  image1?: string;
  image1PId?: string;
  primaryButton: string;
  primaryButtonLink: Record<string, any>;
  secondaryButton?: string;
  secondaryButtonLink?: Record<string, any>;
}

export interface AboutContent {
  label?: string;
  title: string;
  desc: string;
  desc2?: string;
  image1?: string;
  image1PId?: string;
  stat1Value?: string;
  stat1Label?: string;
  stat2Value?: string;
  stat2Label?: string;
  stat3Value?: string;
  stat3Label?: string;
  stat4Value?: string;
  stat4Label?: string;
}

export interface SkillItem {
  name: string;
  level: string | number;
  icon?: string;
  desc?: string;
}

export interface MenuItem{
  title: string;
  desc: string;
  price?: string;
  tags?: string[];
  image?: string;
  imagePId?: string;
  btnLabel?: string;
  menuBtnLink?: LinkConfig;
};

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  desc: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
}
export interface TextContent {
  title: string;
  label: string;
  desc: string;
}
export interface ContactContent {
  title: string;
  desc: string;
  email: string;
  phone?: string;
  location: string;
  primaryButton: string;
  primaryButtonLink: Record<string, any>;
  secondaryButton?: string;
  secondaryButtonLink?: Record<string, any>;
}

export interface FooterContent {
  brand: string;
  copyright: string;
  socials: Record<string, any>[];
}
