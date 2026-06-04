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
      id: "about",
      type: "about",
      variant: "card-stats",
      enabled: true,
    },
    {
      id: "skills",
      type: "skills",
      variant: "tags",
      enabled: true,
    },
    {
      id: "items",
      type: "items",
      variant: "list",
      enabled: true,
    },
    {
      id: "testimonials",
      type: "testimonials",
      variant: "carousel",
      enabled: true,
    },
    {
      id: "contact",
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
      { label: "Work", type: "anchor", anchor: "items", href: "" },
      { label: "Contact", type: "anchor", anchor: "contact", href: "" },
    ],
  },

  hero: {
    type: "minimalist",
    badge: "✦ Available for Commissions",
    // Minimalist, high-contrast creative studio workspace setup
    image1:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    image1PId: "",
    title: `Hi, I'm David`,
    desc: "I engineer high-fidelity digital interfaces and premium brand systems. Blending intentional strategy with meticulous execution.",
    primaryButton: "See My Work",
    primaryButtonLink: makeCtaLink({ type: "anchor", anchorId: "items" }),
    secondaryButton: "Let's Talk",
    secondaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      `Hi! I saw your portfolio and I'd love to chat.`,
    ),
  },

  about: {
    label: "About Me",
    title: "Crafting Digital Experiences with Rigid Purpose",
    desc: "I am a multi-disciplinary creative specialist operating out of Lagos, Nigeria. I align product architecture with graphic craftsmanship to produce systemic designs that look striking and maximize engagement.",
    desc2:
      "Outside the design terminal, I study historical design typographies, archive local urban patterns, and build open-source web assets.",
    // Architectural close-up with dramatic light and geometric shadows
    image1:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    image1PId: "",
    stat1Value: "30+",
    stat1Label: "Systems Launched",
    stat2Value: "20+",
    stat2Label: "Retained Partners",
    stat3Value: "5+ yrs",
    stat3Label: "Active Experience",
    stat4Value: "4",
    stat4Label: "Industry Mentions",
  },

  skills: {
    heading: "Expertise & Toolkits",
    subheading: "Advanced core competencies utilized to transform logic into physical assets.",
    items: [
      { name: "UI/UX Architecture", level: "92" },
      { name: "Interactive Engineering", level: "88" },
      { name: "Brand Systems Design", level: "90" },
    ],
    skillTags: [
      "Figma",
      "Webflow",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Framer Motion",
      "Adobe Suite",
      "TypeScript",
      "Design Systems",
      "Typography",
    ],
  },

  items: {
    heading: "Selected Case Studies",
    subheading: "A curated exhibition of architectural development and creative direction.",
    items: [
      {
        title: "Brand Systems for Lagos Food Space",
        desc: "A comprehensive operational visual identity—encompassing bespoke packaging vectors, palettes, brand guides, and digital frameworks for a premium dark kitchen startup.",
        tags: ["Branding", "Identity", "Figma"],
        // Clean minimal packaging array with dynamic shadows
        image:
          "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
        imagePId: "",
        btnLabel: "View Case Study",
        projectBtnLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I saw your Lagos Food Space project and I'd love to discuss something similar.`,
        ),
      },
      {
        title: "E-Commerce System for House of Label",
        desc: "A premium, mobile-first retail architecture engineered with rapid headless rendering pipelines and fully integrated Paystack localized multi-currency gateways.",
        tags: ["Web Engineering", "Next.js", "Paystack"],
        // High-contrast, editorial studio apparel portrait
        image:
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
        imagePId: "",
        btnLabel: "View Case Study",
        projectBtnLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I saw your E-Commerce framework and I'm interested in a similar retail build.`,
        ),
      },
    ],
  },

  testimonials: {
    heading: "Client Endorsements",
    subheading: "Evaluations from product founders and technical directors.",
    items: [
      {
        quote:
          "One of the absolute sharpest creatives in the West African design space. Delivered meticulous UI architectures, entirely ahead of schedule.",
        name: "Ngozi Eze",
        role: "Creative Director, StyleHouse Lagos",
      },
      {
        quote:
          "Our platforms experienced massive functional metrics growth immediately following the rewrite. The deep technical strategy behind every pixel is undeniable.",
        name: "Emeka Okafor",
        role: "Product Principal, TechNaija",
      },
      {
        quote:
          "Articulate, highly methodical, and exceptionally organized. An absolute asset for any corporate team seeking premium system design.",
        name: "Fatima Aliyu",
        role: "Global Brand Manager",
      },
    ],
  },

  contact: {
    title: "Initiate A Dialogue",
    desc: "Have an architectural problem requiring design precision or technical deployment? Let us evaluate your parameters.",
    email: "hello@example.com",
    phone: whatsappNumber,
    location: "Lagos, Nigeria",
    primaryButton: "Send Message",
    primaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      `Hi! I'd like to initiate a design review for an upcoming project.`,
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
    image: "/ti/portfolio-2.png",
    category: "portfolio",
    description:
      "A bold, editorial portfolio for creatives, designers, and developers. Minimalist hero, stats, skill tags, and a contact form.",
  },
  config: {
    type: "portfolio-2",
    theme: "mono",
    hasCustomizeSidebar: false,
    isPremium: false,
  },
  contentConfig: portfolioTwoConfig,
  starterContent,
};

export default portfolioTwo;