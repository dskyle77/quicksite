// src/components/siteTemplates/portfolioTwo/index.ts

import { makeWhatsappLink, makeCtaLink } from "@/components/shared/helpers";
import { SchemaParams } from "@/components/templateBuilder/types";
import { TemplateContent } from "@/lib/templates";

export const portfolioTwoConfig = {
  navbar: "minimal",
  hero: "minimalist",
  footer: "centered",
  sections: [
    {
      id: "ab_",
      type: "about",
      variant: "card-stats",
      enabled: true,
    },
    {
      id: "sk_",
      type: "skills",
      variant: "tags",
      enabled: true,
    },
    {
      id: "i_",
      type: "items",
      variant: "list",
      enabled: true,
    },
    {
      id: "ts_",
      type: "testimonials",
      variant: "carousel",
      enabled: true,
    },
    {
      id: "c_",
      type: "contact",
      variant: "form",
      enabled: true,
    },
  ],
};

const starterContent = ({
  selectedTitle = "My Portfolio",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: portfolioTwoConfig,

  navbar: {
    logo: "✦",
    title: selectedTitle,
    ctaButton: "Hire Me",
    ctaButtonLink: makeWhatsappLink(
      whatsappNumber,
      `Hi! I'd like to discuss a project or collaboration with you.`,
    ),
    links: [
      { label: "About", type: "anchor", anchor: "about", href: "" },
      { label: "Work", type: "anchor", anchor: "projects", href: "" },
      { label: "Contact", type: "anchor", anchor: "contact", href: "" },
    ],
  },

  hero: {
    type: "minimalist",
    badge: "Available for Freelance",
    image1:
      "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
    image1PId: "",
    title: `Hi, I'm ${selectedTitle}`,
    desc: "I build things that people love. Creative, strategic, and obsessed with quality.",
    primaryButton: "See My Work",
    primaryButtonLink: makeCtaLink({ type: "anchor", anchorId: "projects" }),
    secondaryButton: "Let's Talk",
    secondaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      `Hi! I saw your portfolio and I'd love to chat.`,
    ),
  },

  ab_about: {
    label: "About Me",
    title: "Crafting Digital Experiences with Purpose",
    desc: "I'm a creative professional based in Lagos, Nigeria. I combine strategy with craft to produce work that not only looks beautiful but actually performs.",
    desc2:
      "When I'm not designing or building, I'm exploring new ideas, mentoring others, or finding inspiration in everyday Nigerian culture.",
    image1:
      "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
    image1PId: "",
    stat1Value: "30+",
    stat1Label: "Projects Done",
    stat2Value: "20+",
    stat2Label: "Happy Clients",
    stat3Value: "5+",
    stat3Label: "Years Experience",
    stat4Value: "4",
    stat4Label: "Awards Won",
  },

  sk_skills: {
    heading: "Skills & Tools",
    subheading: "Technologies and tools I use every day.",
    items: [
      { name: "UI/UX Design", level: "92" },
      { name: "React / Next.js", level: "88" },
      { name: "Brand Identity", level: "90" },
    ],
    skillTags: [
      "Figma",
      "Webflow",
      "React",
      "Next.js",
      "Tailwind",
      "Framer",
      "Illustrator",
      "Canva",
      "Notion",
      "TypeScript",
    ],
  },

  i_items: {
    heading: "Selected Work",
    subheading: "A curated selection of projects I'm proud of.",
    items: [
      {
        title: "Branding for Lagos Food Brand",
        desc: "Complete brand identity — logo, color palette, typography, and social media templates for a fast-growing food delivery startup in Lagos.",
        tags: ["Branding", "Figma", "Canva"],
        image:
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        btnLabel: "View Project",
        projectBtnLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I saw your Lagos Food Brand project and I'd love to discuss something similar.`,
        ),
      },
      {
        title: "E-Commerce Website for Fashion Brand",
        desc: "A mobile-first online store built with Next.js and Paystack integration. Focused on conversion optimization and fast load times.",
        tags: ["Web Dev", "Next.js", "Paystack"],
        image:
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        btnLabel: "View Project",
        projectBtnLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I saw your E-Commerce project and I'm interested in a similar build.`,
        ),
      },
    ],
  },

  ts_testimonials: {
    heading: "What Clients Say",
    subheading: "Words from people I've worked with.",
    items: [
      {
        quote:
          "The best creative I've worked with in Nigeria. Delivered beyond expectations, on time, every time.",
        name: "Ngozi Eze",
        role: "CEO, StyleHouse Lagos",
      },
      {
        quote:
          "My website traffic tripled after the redesign. The attention to detail and strategy behind every decision was impressive.",
        name: "Emeka Okafor",
        role: "Founder, TechNaija",
      },
      {
        quote:
          "Professional, communicative, and incredibly talented. I won't hire anyone else for my brand work.",
        name: "Fatima Aliyu",
        role: "Brand Manager, Lagos",
      },
    ],
  },

  c_contact: {
    title: "Let's Build Something",
    desc: "Have a project in mind? Let's talk about it.",
    email: "hello@example.com",
    phone: whatsappNumber,
    location: "Lagos, Nigeria",
    primaryButton: "Send a Message",
    primaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      `Hi! I'd like to discuss a project with you.`,
    ),
    secondaryButton: "",
    secondaryButtonLink: {},
  },

  footer: {
    brand: selectedTitle,
    copyright: `© ${new Date().getFullYear()} ${selectedTitle}. All rights reserved.`,
    socials: [
      { label: "Behance", linkConfig: { type: "url", url: "" } },
      { label: "LinkedIn", linkConfig: { type: "url", url: "" } },
      { label: "Twitter", linkConfig: { type: "url", url: "" } },
    ],
  },
});

const portfolioTwo: TemplateContent = {
  meta: {
    title: "Portfolio Two",
    image: "/ti/portfolio-two.png",
    category: "portfolio",
    description:
      "A bold, editorial portfolio for creatives, designers, and developers. Minimalist hero, stats, skill tags, and a contact form.",
  },
  config: {
    type: "portfolio-2",
    theme: "mono",
    canCustomize: false,
    isPremium: false,
  },
  contentConfig: portfolioTwoConfig,
  starterContent,
};

export default portfolioTwo;
