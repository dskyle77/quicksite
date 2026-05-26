/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SchemaParams,
  NavbarContent,
  HeroContent,
  AboutContent,
  SkillItem,
  TextContent,
  ExperienceItem,
  TestimonialItem,
  ContactContent,
  FooterContent,
} from "./types";
import { ItemsItem, ItemsVariantList } from "./variants/sections/ItemsVariants";
import { HeroVariantList } from "./variants/HeroVariants";
import { ExperienceVariantList } from "./variants/sections/ExperienceVariants";
import { SkillsVariantList } from "./variants/sections/SkillsVariants";

import { makeWhatsappLink, year, img } from "../shared/helpers";
// ─── Shared Helpers ───────────────────────────────────────────────────────────

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

/** Empty anchor rows for AI — labels/anchors filled from enabled sections */
const navbarLinksSchema = () => [
  { label: "", type: "anchor" as const, anchor: "", href: "" },
  { label: "", type: "anchor" as const, anchor: "", href: "" },
  { label: "", type: "anchor" as const, anchor: "", href: "" },
];

const defaultStarterLinks = [
  { label: "About", type: "anchor" as const, anchor: "about", href: "" },
  { label: "Services", type: "anchor" as const, anchor: "features", href: "" },
  { label: "Contact", type: "anchor" as const, anchor: "contact", href: "" },
];

const navbarSchema = ({
  selectedTitle,
  whatsappNumber,
}: SchemaParams): NavbarContent => ({
  logo: "✦",
  title: selectedTitle ?? "",
  ctaButton: "",
  ctaButtonLink: makeWhatsappLink(whatsappNumber),
  links: navbarLinksSchema(),
});

const navbarStarterContent = ({
  selectedTitle,
  whatsappNumber,
}: SchemaParams): NavbarContent => ({
  logo: "✦",
  title: selectedTitle ?? "My Business",
  ctaButton: "Chat on WhatsApp",
  ctaButtonLink: makeWhatsappLink(whatsappNumber),
  links: defaultStarterLinks,
});

// ─── HERO ─────────────────────────────────────────────────────────────────────

const heroSchema = ({
  whatsappNumber,
  defaultImage,
}: SchemaParams): HeroContent => ({
  type: "background",
  badge: "",
  image1: img(defaultImage),
  image1PId: "",
  title: "",
  desc: "",
  primaryButton: "",
  primaryButtonLink: makeWhatsappLink(whatsappNumber),
  secondaryButton: "",
  secondaryButtonLink: {},
});

const heroStarterContent = ({
  whatsappNumber,
  defaultImage,
}: SchemaParams): HeroContent => ({
  type: "background",
  badge: "Open for orders",
  image1: img(defaultImage),
  image1PId: "",
  title: "Welcome — We're Glad You're Here",
  desc: "Quality service, fair prices, and a team that cares about every customer.",
  primaryButton: "Chat on WhatsApp",
  primaryButtonLink: makeWhatsappLink(whatsappNumber),
  secondaryButton: "Learn More",
  secondaryButtonLink: {},
});

// ─── ABOUT ────────────────────────────────────────────────────────────────────

const aboutSchema = ({ defaultImage }: SchemaParams): AboutContent => ({
  label: "",
  title: "",
  desc: "",
  desc2: "",
  image1: img(defaultImage),
  image1PId: "",
  stat1Value: "",
  stat1Label: "",
  stat2Value: "",
  stat2Label: "",
  stat3Value: "",
  stat3Label: "",
  stat4Value: "",
  stat4Label: "",
});

const aboutStarterContent = ({ defaultImage }: SchemaParams): AboutContent => ({
  label: "About Me",
  title: "Turning Ideas Into Reality",
  desc: "I'm a passionate full-stack developer with a love for clean code and thoughtful design.",
  desc2:
    "When I'm not coding, you'll find me exploring new technologies or enjoying coffee.",
  image1: img(defaultImage),
  image1PId: "",
  stat1Value: "20+",
  stat1Label: "Projects Done",
  stat2Value: "15+",
  stat2Label: "Happy Clients",
  stat3Value: "3+",
  stat3Label: "Years Experience",
  stat4Value: "5",
  stat4Label: "Awards",
});

// ─── SKILLS ───────────────────────────────────────────────────────────────────

const skillsSchema = () => ({
  heading: "",
  subheading: "",
  items: [
    { name: "", level: "80", icon: "", desc: "" },
    { name: "", level: "80", icon: "", desc: "" },
  ] satisfies SkillItem[],
  skillTags: [] as string[],
});

const skillsStarterContent = () => ({
  heading: "Skills & Expertise",
  subheading: "Technologies and tools I use to bring ideas to life.",
  items: [
    { name: "React / Next.js", level: "95" },
    { name: "TypeScript", level: "90" },
    { name: "Node.js", level: "85" },
  ] as SkillItem[],
  skillTags: [
    "JavaScript",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
  ] as string[],
});

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

const itemsSchema = ({ defaultImage }: SchemaParams) => ({
  heading: "",
  subheading: "",
  items: [
    {
      title: "",
      desc: "",
      tags: [],
      image: img(defaultImage),
      imagePId: "",
      btnLabel: "",
    },
    {
      title: "",
      desc: "",
      tags: [],
      image: img(defaultImage),
      imagePId: "",
      btnLabel: "",
    },
  ] as ItemsItem[],
});

const itemsStarterContent = ({ defaultImage }: SchemaParams) => ({
  heading: "Featured Projects",
  subheading: "A selection of work I'm proud of.",
  items: [
    {
      title: "E-Commerce Platform",
      desc: "A full-stack online store with real-time inventory and Stripe payments.",
      tags: ["Next.js", "Stripe", "PostgreSQL"],
      image: img(defaultImage),
      imagePId: "",
      projectBtnLink: {},
      btnLabel: "View Project",
    },
    {
      title: "Task Management App",
      desc: "A collaborative productivity app with drag-and-drop boards.",
      tags: ["React", "Node.js", "WebSockets"],
      image: img(defaultImage),
      imagePId: "",
      projectBtnLink: {},
      btnLabel: "View Project",
    },
  ] as ItemsItem[],
});

// ---- TEXT --------------------------------------------------------------------
const textSchema = (): TextContent => ({
  label: "",
  title: "",
  desc: "",
});

const textStarterContent = (): TextContent => ({
  label: "Introduction",
  title: "Crafting Digital Experiences That Matter",
  desc: "We help brands, creators, and businesses communicate clearly through thoughtful design, modern technology, and powerful storytelling.",
});
// ─── EXPERIENCE ───────────────────────────────────────────────────────────────

const experienceSchema = () => ({
  heading: "",
  subheading: "",
  items: [{ role: "", company: "", period: "", desc: "" }] as ExperienceItem[],
});

const experienceStarterContent = () => ({
  heading: "Work Experience",
  subheading: "My professional journey and the impact I've made.",
  items: [
    {
      role: "Senior Frontend Developer",
      company: "TechVenture Inc.",
      period: "2022 – Present",
      desc: "Led the redesign of the core product UI, improving user engagement by 40%.",
    },
  ] as ExperienceItem[],
});

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

const testimonialsSchema = () => ({
  heading: "",
  subheading: "",
  items: [
    { quote: "", name: "", role: "" },
    { quote: "", name: "", role: "" },
  ] as TestimonialItem[],
});

const testimonialsStarterContent = () => ({
  heading: "Kind Words",
  subheading: "What clients say about working with me.",
  items: [
    {
      quote:
        "Alex delivered an exceptional product — clean code and beautiful UI.",
      name: "Sarah Johnson",
      role: "CEO, TechStart",
    },
  ] as TestimonialItem[],
});

// ─── CONTACT ──────────────────────────────────────────────────────────────────

const contactSchema = ({ whatsappNumber }: SchemaParams): ContactContent => ({
  title: "",
  desc: "",
  email: "hello@example.com",
  phone: whatsappNumber,
  location: "e.g: Lagos, Nigeria",
  primaryButton: "",
  primaryButtonLink: makeWhatsappLink(whatsappNumber),
  secondaryButton: "",
  secondaryButtonLink: makeWhatsappLink(whatsappNumber),
});

const contactStarterContent = ({
  whatsappNumber,
}: SchemaParams): ContactContent => ({
  title: "Let's Work Together",
  email: "hello@example.com",
  phone: whatsappNumber,
  location: "Lagos, Nigeria",
  desc: "Have a project in mind? Let's chat and see how I can help.",
  primaryButton: "Send a Message",
  primaryButtonLink: makeWhatsappLink(whatsappNumber),
  secondaryButton: "Schedule a Call",
  secondaryButtonLink: makeWhatsappLink(whatsappNumber),
});

// ─── FOOTER ───────────────────────────────────────────────────────────────────

const footerSchema = ({ selectedTitle }: SchemaParams): FooterContent => ({
  brand: selectedTitle ?? "",
  copyright: `© ${year()} All rights reserved.`,
  socials: [
    {
      label: "GitHub",
      linkConfig: { type: "url", url: "" },
    },
    {
      label: "LinkedIn",
      linkConfig: { type: "url", url: "" },
    },
    {
      label: "Twitter",
      linkConfig: { type: "url", url: "" },
    },
  ],
});

const footerStarterContent = ({
  selectedTitle,
}: SchemaParams): FooterContent => ({
  brand: selectedTitle ?? "Alex Morgan",
  copyright: `© ${year()} All rights reserved.`,
  socials: [
    {
      label: "GitHub",
      linkConfig: { type: "url", url: "https://github.com/" },
    },
    {
      label: "LinkedIn",
      linkConfig: { type: "url", url: "https://www.linkedin.com/" },
    },
    {
      label: "Twitter",
      linkConfig: { type: "url", url: "https://twitter.com/" },
    },
  ],
});

// ─── FEATURES ────────────────────────────────────────────────────────────────

const featuresSchema = () => ({
  heading: "",
  subheading: "",
  items: [
    { icon: "", title: "", desc: "" },
    { icon: "", title: "", desc: "" },
  ],
});

const featuresStarterContent = () => ({
  heading: "Why Choose Us",
  subheading: "Everything you need to launch fast and grow confidently.",
  items: [
    {
      icon: "⚡",
      title: "Lightning Fast",
      desc: "Optimized for performance from day one.",
    },
    {
      icon: "🔒",
      title: "Secure by Default",
      desc: "Enterprise-grade security built in.",
    },
  ],
});

// ─── PRICING ─────────────────────────────────────────────────────────────────

const emptyPricingPlan = (whatsappNumber: string, highlighted = false) => ({
  name: "",
  price: "",
  period: "",
  desc: "",
  features: [] as string[],
  ctaLabel: "",
  ctaLink: makeWhatsappLink(whatsappNumber),
  highlighted,
});

const pricingSchema = ({ whatsappNumber }: SchemaParams) => ({
  heading: "",
  subheading: "",
  plans: [
    emptyPricingPlan(whatsappNumber, false),
    emptyPricingPlan(whatsappNumber, true),
  ],
});

const pricingStarterContent = ({ whatsappNumber }: SchemaParams) => ({
  heading: "Simple, Transparent Pricing",
  subheading: "No hidden fees. Cancel anytime.",
  plans: [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      desc: "Perfect for solo founders.",
      features: ["Up to 5 projects", "Email support"],
      ctaLabel: "Get Started",
      ctaLink: makeWhatsappLink(whatsappNumber),
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$79",
      period: "/month",
      desc: "For growing teams.",
      features: ["Unlimited projects", "Priority support"],
      ctaLabel: "Start Free Trial",
      ctaLink: makeWhatsappLink(whatsappNumber),
      highlighted: true,
    },
  ],
});

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const faqSchema = () => ({
  heading: "",
  subheading: "",
  items: [
    { question: "", answer: "" },
    { question: "", answer: "" },
  ],
});

const faqStarterContent = () => ({
  heading: "Frequently Asked Questions",
  subheading: "Everything you need to know. Can't find an answer? Just ask.",
  items: [
    {
      question: "How does the free trial work?",
      answer: "You get 14 days of full access, no credit card required.",
    },
    {
      question: "Can I cancel at any time?",
      answer: "Yes. There are no long-term contracts.",
    },
  ],
});

// ─── CTA BANNER ───────────────────────────────────────────────────────────────

const ctaSchema = ({ whatsappNumber }: SchemaParams) => ({
  heading: "",
  subheading: "",
  primaryButton: "",
  primaryButtonLink: makeWhatsappLink(whatsappNumber),
  secondaryButton: "",
  secondaryButtonLink: {},
});

const ctaStarterContent = ({ whatsappNumber }: SchemaParams) => ({
  heading: "Ready to Get Started?",
  subheading: "Join thousands of teams already building with us.",
  primaryButton: "Start for Free",
  primaryButtonLink: makeWhatsappLink(whatsappNumber),
  secondaryButton: "See a Demo",
  secondaryButtonLink: {},
});

export const starterMap: Record<string, any> = {
  navbar: navbarStarterContent,
  hero: heroStarterContent,
  about: aboutStarterContent,
  skills: skillsStarterContent,
  projects: itemsStarterContent,
  text: textStarterContent,
  experience: experienceStarterContent,
  testimonials: testimonialsStarterContent,
  contact: contactStarterContent,
  features: featuresStarterContent,
  pricing: pricingStarterContent,
  faq: faqStarterContent,
  cta: ctaStarterContent,
  footer: footerStarterContent,
};

// Helper to map section types to their schema functions
export const schemaMap: Record<string, any> = {
  navbar: navbarSchema,
  hero: heroSchema,
  about: aboutSchema,
  skills: skillsSchema,
  items: itemsSchema,
  text: textSchema,
  experience: experienceSchema,
  testimonials: testimonialsSchema,
  contact: contactSchema,
  features: featuresSchema,
  pricing: pricingSchema,
  faq: faqSchema,
  cta: ctaSchema,
  footer: footerSchema,
};

/** Allowed layout variants — must match variant component registries */
export const variantOptions: Record<string, string[]> = {
  navbar: ["classic", "minimal", "none"],
  hero: HeroVariantList,
  about: ["split", "card-stats", "centered"],
  skills: SkillsVariantList,
  items: ItemsVariantList,
  text: ["card", "minimal", "minimal-left", "default"],
  experience: ExperienceVariantList,
  testimonials: ["grid", "carousel", "list"],
  contact: ["default", "split", "minimal", "form"],
  features: ["default", "list", "icons"],
  pricing: ["default", "highlight-top", "compact"],
  faq: ["default", "accordion", "numbered"],
  cta: ["default", "banner", "simple"],
  footer: ["classic", "centered", "columns", "none"],
};
