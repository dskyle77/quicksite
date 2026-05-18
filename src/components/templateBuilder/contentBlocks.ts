/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SchemaParams,
  NavbarContent,
  HeroContent,
  AboutContent,
  SkillItem,
  ProjectItem,
  TextContent,
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

const defaultLinks = [
  {
    label: "About",
    type: "anchor" as const,
    anchor: "about",
    href: "",
  },
  {
    label: "Skills",
    type: "anchor" as const,
    anchor: "skills",
    href: "",
  },
  {
    label: "Projects",
    type: "anchor" as const,
    anchor: "projects",
    href: "",
  },
  {
    label: "GitHub",
    type: "external" as const,
    anchor: "#",
    href: "https://github.com/",
  },
];

const navbarSchema = ({
  selectedTitle,
  whatsappNumber,
  defaultMessage,
}: SchemaParams): NavbarContent => ({
  logo: "✦",
  title: selectedTitle ?? "",
  ctaButton: "",
  ctaButtonLink: makeWhatsappLink(whatsappNumber, defaultMessage),
  links: defaultLinks,
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
  links: defaultLinks,
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
  projects: projectsSchema,
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

// New helper: buildStarterContent
export const buildStarterContent = ({
  config,
  params,
}: {
  config: any;
  params: {
    selectedTitle?: string;
    whatsappNumber?: string;
    defaultMessage?: string;
    defaultImage?: string;
  };
}) => {
  const content: any = {
    builderConfig: config,
    navbar: starterMap.navbar(params),
    hero: starterMap.hero(params),
    footer: starterMap.footer(params),
  };

  config.sections.forEach((sec: any) => {
    const starterFn = starterMap[sec.type];
    if (starterFn) {
      const contentKey = `${sec.id}${sec.type}`;
      content[contentKey] = starterFn(params);
    }
  });

  return content;
};

// New helper: buildSchema
export const buildSchema = ({
  config,
  params,
}: {
  config: any;
  params: {
    selectedTitle?: string;
    whatsappNumber?: string;
    defaultMessage?: string;
    defaultImage?: string;
  };
}) => {
  const schema: any = {
    builderConfig: {
      _note: `Instructions: For navbar, hero, footer, and all sections, use only the allowed variant keys found in variantOptions: ${JSON.stringify(variantOptions)}. Assign a meaningful anchorName to each section that reflects its use and context (for example, rename 'projects' to 'menu' if used as a menu section).`,

      navbar: "",
      hero: "",
      footer: "",
      sections: config.sections.map((sec: any) => ({
        id: sec.id,
        type: sec.type,
        variant: "",
        enabled: true,
        anchorName: "",
      })),
    },
    navbar: schemaMap.navbar(params),
    hero: schemaMap.hero(params),
    footer: schemaMap.footer(params),
  };

  // Inject scoped schemas for AI to fill
  config.sections.forEach((sec: any) => {
    const schemaFn = schemaMap[sec.type];
    if (schemaFn) {
      const contentKey = `${sec.id}${sec.type}`;
      schema[contentKey] = schemaFn(params);
    }
  });

  return schema;
};

export const variantOptions: Record<string, string[]> = {
  navbar: ["classic", "minimal"],
  hero: ["background", "split", "minimalist", "centered"],
  about: ["split", "card-stats", "centered"],
  skills: ["grid", "tags", "icons-list"],
  projects: ["list", "card-grid"],
  text: ["card", "minimal", "minimal-left", "default"],
  experience: ["timeline", "card-stack", "compact-list"],
  testimonials: ["grid", "carousel", "list"],
  contact: ["default", "split", "minimal", "form"],
  features: ["default", "list", "icons"],
  pricing: ["default", "highlight-top", "compact"],
  faq: ["default", "accordion", "numbered"],
  cta: ["default", "banner", "simple"],
  footer: ["classic", "centered", "columns", "none"],
};
