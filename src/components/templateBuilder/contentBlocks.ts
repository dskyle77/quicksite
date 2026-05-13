/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SchemaParams,
  NavbarContent,
  HeroContent,
  AboutContent,
  SkillItem,
  ProjectItem,
  ExperienceItem,
  TestimonialItem,
  ContactContent,
  FooterContent,
} from "./types";

// ─── Shared Helpers ───────────────────────────────────────────────────────────

const makeWhatsappLink = (phone?: string, message?: string) =>
  phone ? { type: "whatsapp", phone, message: message ?? "" } : {};

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg";

const img = (override?: string) => override ?? DEFAULT_IMAGE;
const year = () => new Date().getFullYear();

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

const navbarSchema = ({
  selectedTitle,
  whatsappNumber,
  defaultMessage,
}: SchemaParams): NavbarContent => ({
  logo: "✦",
  title: selectedTitle ?? "",
  ctaButton: "",
  ctaButtonLink: makeWhatsappLink(whatsappNumber, defaultMessage),
});

const navbarStarterContent = ({
  selectedTitle,
  whatsappNumber,
  defaultMessage,
}: SchemaParams): NavbarContent => ({
  logo: "✦",
  title: selectedTitle ?? "My Portfolio",
  ctaButton: "Hire Me",
  ctaButtonLink: makeWhatsappLink(whatsappNumber, defaultMessage),
});

// ─── HERO ─────────────────────────────────────────────────────────────────────

const heroSchema = ({
  whatsappNumber,
  defaultMessage,
  defaultImage,
}: SchemaParams): HeroContent => ({
  type: "background",
  badge: "",
  image1: img(defaultImage),
  image1PId: "",
  title: "",
  desc: "",
  primaryButton: "",
  primaryButtonLink: makeWhatsappLink(whatsappNumber, defaultMessage),
  secondaryButton: "",
  secondaryButtonLink: {},
});

const heroStarterContent = ({
  whatsappNumber,
  defaultMessage,
  defaultImage,
}: SchemaParams): HeroContent => ({
  type: "background",
  badge: "👋 Available for Work",
  image1: img(defaultImage),
  image1PId: "",
  title: "Hi, I'm Alex — Creative Developer",
  desc: "I craft beautiful digital experiences — from sleek web apps to polished mobile products.",
  primaryButton: "View My Work",
  primaryButtonLink: makeWhatsappLink(whatsappNumber, defaultMessage),
  secondaryButton: "Download CV",
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
  items: [{ name: "", level: "1-100" }] as SkillItem[],
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

const projectsSchema = ({ defaultImage }: SchemaParams) => ({
  heading: "",
  subheading: "",
  items: [
    { title: "", desc: "", tags: [], image: img(defaultImage), imagePId: "" },
  ] as ProjectItem[],
});

const projectsStarterContent = ({ defaultImage }: SchemaParams) => ({
  heading: "Featured Projects",
  subheading: "A selection of work I'm proud of.",
  items: [
    {
      title: "E-Commerce Platform",
      desc: "A full-stack online store with real-time inventory and Stripe payments.",
      tags: ["Next.js", "Stripe", "PostgreSQL"],
      image: img(defaultImage),
      imagePId: "",
      previewLink: "",
    },
    {
      title: "Task Management App",
      desc: "A collaborative productivity app with drag-and-drop boards.",
      tags: ["React", "Node.js", "WebSockets"],
      image: img(defaultImage),
      imagePId: "",
      previewLink: "",
    },
  ] as ProjectItem[],
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
  items: [{ quote: "", name: "", role: "" }] as TestimonialItem[],
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

const contactSchema = ({
  whatsappNumber,
  defaultMessage,
}: SchemaParams): ContactContent => ({
  title: "",
  desc: "",
  email: "hello@example.com",
  phone: whatsappNumber,
  location: "e.g: Lagos, Nigeria",
  primaryButton: "",
  primaryButtonLink: makeWhatsappLink(whatsappNumber, defaultMessage),
  secondaryButton: "",
  secondaryButtonLink: makeWhatsappLink(whatsappNumber, defaultMessage),
});

const contactStarterContent = ({
  whatsappNumber,
  defaultMessage,
}: SchemaParams): ContactContent => ({
  title: "Let's Work Together",
  email: "hello@example.com",
  phone: whatsappNumber,
  location: "Lagos, Nigeria",
  desc: "Have a project in mind? Let's chat and see how I can help.",
  primaryButton: "Send a Message",
  primaryButtonLink: makeWhatsappLink(whatsappNumber, defaultMessage),
  secondaryButton: "Schedule a Call",
  secondaryButtonLink: makeWhatsappLink(whatsappNumber, defaultMessage),
});

// ─── FOOTER ───────────────────────────────────────────────────────────────────

const footerSchema = ({ selectedTitle }: SchemaParams): FooterContent => ({
  brand: selectedTitle ?? "",
  copyright: `© ${year()} All rights reserved.`,
  socials: ["GitHub", "LinkedIn", "Twitter"],
});

const footerStarterContent = ({
  selectedTitle,
}: SchemaParams): FooterContent => ({
  brand: selectedTitle ?? "Alex Morgan",
  copyright: `© ${year()} All rights reserved.`,
  socials: ["GitHub", "LinkedIn", "Twitter"],
});

// ─── FEATURES ────────────────────────────────────────────────────────────────

const featuresSchema = () => ({
  heading: "",
  subheading: "",
  items: [{ icon: "", title: "", desc: "" }],
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

const pricingSchema = ({ whatsappNumber, defaultMessage }: SchemaParams) => ({
  heading: "",
  subheading: "",
  plans: [
    {
      name: "",
      price: "",
      period: "",
      desc: "",
      features: [] as string[],
      ctaLabel: "",
      ctaLink: makeWhatsappLink(whatsappNumber, defaultMessage),
      highlighted: false,
    },
  ],
});

const pricingStarterContent = ({
  whatsappNumber,
  defaultMessage,
}: SchemaParams) => ({
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
      ctaLink: makeWhatsappLink(whatsappNumber, defaultMessage),
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$79",
      period: "/month",
      desc: "For growing teams.",
      features: ["Unlimited projects", "Priority support"],
      ctaLabel: "Start Free Trial",
      ctaLink: makeWhatsappLink(whatsappNumber, defaultMessage),
      highlighted: true,
    },
  ],
});

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const faqSchema = () => ({
  heading: "",
  subheading: "",
  items: [{ question: "", answer: "" }],
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

const ctaSchema = ({ whatsappNumber, defaultMessage }: SchemaParams) => ({
  heading: "",
  subheading: "",
  primaryButton: "",
  primaryButtonLink: makeWhatsappLink(whatsappNumber, defaultMessage),
  secondaryButton: "",
  secondaryButtonLink: {},
});

const ctaStarterContent = ({
  whatsappNumber,
  defaultMessage,
}: SchemaParams) => ({
  heading: "Ready to Get Started?",
  subheading: "Join thousands of teams already building with us.",
  primaryButton: "Start for Free",
  primaryButtonLink: makeWhatsappLink(whatsappNumber, defaultMessage),
  secondaryButton: "See a Demo",
  secondaryButtonLink: {},
});

export const starterMap: Record<string, any> = {
  navbar: navbarStarterContent,
  hero: heroStarterContent,
  about: aboutStarterContent,
  skills: skillsStarterContent,
  projects: projectsStarterContent,
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
  projects: projectsSchema,
  experience: experienceSchema,
  testimonials: testimonialsSchema,
  contact: contactSchema,
  features: featuresSchema,
  pricing: pricingSchema,
  faq: faqSchema,
  cta: ctaSchema,
  footer: footerSchema,
};

/* builderConfig.ts or contentBlocks.ts */

export const builderConfigSchema = () => ({
  _note:
    "AI: For each property, use ONLY valid options. See documentation. For sections, include only relevant ones (about, skills, projects, experience, testimonials, contact, faq, pricing, cta, features, team, gallery). Set 'enabled: false' for optional sections to hide them without removing. Each section must have a unique 'id'. Do NOT add or remove keys.",
  navbar: "classic",
  hero: "dynamic",
  footer: "classic",
  sections: [
    {
      id: "",
      type: "",
      variant: "",
      enabled: true,
    },
  ],
});

// export const builderConfigStarter = () => ({
//   navbar: "classic",
//   hero: "dynamic",
//   footer: "classic",
//   sections: [
//     {
//       id: "init-about",
//       type: "about",
//       variant: "split",
//       enabled: true,
//     },
//     {
//       id: "init-skills",
//       type: "skills",
//       variant: "grid",
//       enabled: true,
//     },
//     {
//       id: "init-projects",
//       type: "projects",
//       variant: "card-grid",
//       enabled: true,
//     },
//     {
//       id: "init-experience",
//       type: "experience",
//       variant: "timeline",
//       enabled: true,
//     },
//     {
//       id: "init-contact",
//       type: "contact",
//       variant: "default",
//       enabled: true,
//     },
//   ],
// });
export const builderConfigStarter = () => ({
  navbar: "classic",
  hero: "dynamic",
  footer: "classic",
  sections: [
    {
      id: "init-about",
      type: "about",
      variant: "split",
      enabled: true,
    },
    {
      id: "init-skills",
      type: "skills",
      variant: "grid",
      enabled: true,
    },
    {
      id: "init-projects",
      type: "projects",
      variant: "card-grid",
      enabled: true,
    },
    {
      id: "init-experience",
      type: "experience",
      variant: "timeline",
      enabled: true,
    },
    {
      id: "init-testimonials",
      type: "testimonials",
      variant: "grid",
      enabled: true,
    },
    {
      id: "init-contact",
      type: "contact",
      variant: "default",
      enabled: true,
    },
    {
      id: "init-features",
      type: "features",
      variant: "grid",
      enabled: true,
    },
    {
      id: "init-pricing",
      type: "pricing",
      variant: "table",
      enabled: true,
    },
    {
      id: "init-faq",
      type: "faq",
      variant: "accordion",
      enabled: true,
    },
    {
      id: "init-cta",
      type: "cta",
      variant: "simple",
      enabled: true,
    },
    // Add optional sections as templates (disabled by default)
    // {
    //   id: "init-team",
    //   type: "team",
    //   variant: "card",
    //   enabled: false,
    // },
    // {
    //   id: "init-gallery",
    //   type: "gallery",
    //   variant: "masonry",
    //   enabled: false,
    // },
  ],
});
