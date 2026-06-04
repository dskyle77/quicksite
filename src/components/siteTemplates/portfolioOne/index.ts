/* eslint-disable @typescript-eslint/no-explicit-any */
import { LinkConfig } from "@/components/shared/EditableLink";
import { SchemaParams } from "@/components/templateBuilder/types";
import { ExperienceSectionVariant } from "@/components/templateBuilder/variants/sections/ExperienceVariants";
import {
  ItemsSectionContent,
  ItemsSectionVariant,
} from "@/components/templateBuilder/variants/sections/ItemsVariants";
import { SkillsSectionVariants } from "@/components/templateBuilder/variants/sections/SkillsVariants";
import { makeCtaLink, makeWhatsappLink } from "@/components/shared/helpers";
import { TemplateContent } from "@/lib/templates";

export const portfolioConfig = {
  navbar: "none",
  hero: "background",
  footer: "classic",
  sections: [
    {
      id: "about",
      type: "about",
      variant: "split",
      enabled: true,
    },
    {
      id: "skills",
      type: "skills",
      variant: "tags" as SkillsSectionVariants,
      enabled: true,
    },
    {
      id: "items",
      type: "items",
      variant: "grid" as ItemsSectionVariant,
      enabled: true,
      anchorName: "projects"
    },
    {
      id: "experience",
      type: "experience",
      variant: "default" as ExperienceSectionVariant,
      enabled: true,
    },
    {
      id: "contact",
      type: "contact",
      variant: "default",
      enabled: true,
    },
  ],
};

const starterContent = ({
  selectedTitle = "Alex Morgan",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: portfolioConfig,

  // HERO
  hero: {
    type: "background",
    badge: "✦ Open for Freelance & Contracts",
    // Hyper-minimalist dark workspace setup with ambient code illumination
    image1:
      "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=1200&q=80",
    image1PId: "",
    title: `Hi, I'm ${selectedTitle}`,
    desc: "Full-Stack Engineer specializing in architectural clean code, high-performance web applications, and intuitive user experiences.",
    primaryButton: "Get In Touch",
    primaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      "Hi Alex, I'd like to discuss an engineering project.",
    ) as LinkConfig,

    secondaryButton: "View My Work",
    secondaryButtonLink: makeCtaLink({
      type: "anchor",
      anchorId: "projects", 
    }) as LinkConfig,
  },

  // ABOUT
  about: {
    label: "About Me",
    title: "Engineering Scalable Digital Architecture",
    desc: "I am a passionate full-stack developer with over 4 years of experience crafting reliable web applications. My core methodologies revolve around clean architecture, type safety, and solving performance bottlenecks.",
    desc2:
      "When I am not deep in code review or optimizing database queries, I actively contribute to open-source toolkits, architect side systems, or refine my developmental environment workflow.",
    // Crisp macro shot of high-contrast modern IDE terminal output
    image1:
      "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=1200&q=80",
    image1PId: "",
    stat1Value: "25+",
    stat1Label: "Deployments Active",
    stat2Value: "18+",
    stat2Label: "Global Clients",
    stat3Value: "4+",
    stat3Label: "Years Experience",
    stat4Value: "12+",
    stat4Label: "Core Technologies",
  },

  // SKILLS
  skills: {
    heading: "Core Stack & Expertise",
    subheading: "Production-ready technologies used daily to build production applications.",
    items: [
      { name: "React / Next.js 14+", level: "95" },
      { name: "TypeScript Ecosystem", level: "92" },
      { name: "Node.js & Distributed Systems", level: "88" },
      { name: "Tailwind CSS & Design Ops", level: "90" },
      { name: "PostgreSQL / Prisma ORM", level: "85" },
    ] as any,
    skillTags: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "GraphQL",
      "Tailwind CSS",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "Git Architecture",
    ],
  },

  // PROJECTS
  items: {
    heading: "Featured Infrastructure",
    subheading: "A curated collection of production applications engineered from concept to launch.",
    items: [
      {
        title: "Enterprise E-Commerce Engine",
        desc: "A full-stack, high-conversion commercial platform featuring asynchronous inventory indexing, webhooks, dynamic multi-tenant stripe gateways, and an analytical control board.",
        tags: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind"],
        // Moody tech dashboard interface visualizing data and system metrics
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        imagePId: "",
        projectBtnLink: makeWhatsappLink(
          whatsappNumber,
          "Hi, I want to review the source code/case study for the E-Commerce Platform project!",
        ),
        btnLabel: "View Case Study",
      },
      {
        title: "TaskFlow — Synchronous Project Space",
        desc: "Real-time task synchronization environment utilizing full-duplex socket pipes, optimistic UI state rendering, layered drag-and-drop mechanics, and workspace segmentation.",
        tags: ["React.js", "Node.js", "Socket.io", "MongoDB"],
        // High-contrast clean close-up of structural IDE software code script
        image:
          "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&q=80",
        imagePId: "",
        projectBtnLink: makeWhatsappLink(
          whatsappNumber,
          "Hi, I am interested in exploring the system architecture for your TaskFlow workspace application!",
        ),
        btnLabel: "View Case Study",
      },
    ],
  } as ItemsSectionContent,

  // EXPERIENCE
  experience: {
    heading: "Engineering Timeline",
    subheading: "A record of corporate impact and systemic technical growth.",
    items: [
      {
        role: "Senior Frontend Engineer",
        company: "TechVenture Inc.",
        period: "2023 – Present",
        desc: "Directing UI architecture and design systems configuration. Optimized core Web Vitals, increasing total interactive user retention scores by 45% utilizing specialized memoization layers and component splitting.",
      },
      {
        role: "Full-Stack Developer",
        company: "StartupSphere",
        period: "2022 – 2023",
        desc: "Architected scalable minimum viable products (MVPs) into secure enterprise systems. Engineered internal automated CI/CD staging runs and boosted database indexing speed metrics by up to 60%.",
      },
    ],
  },

  // CONTACT
  contact: {
    title: "Initialize a Project",
    desc: "Have a complex engineering challenge, application architecture requirements, or a freelance development contract in mind? Let us open a technical review.",
    email: "hello@alexmorgan.dev",
    phone: whatsappNumber,
    location: "Lagos, Nigeria",
    primaryButton: "Send Message",
    primaryButtonLink: makeCtaLink({
      type: "whatsapp",
      phone: whatsappNumber,
      message: "Hello Alex, I checked out your developer portfolio and want to discuss an engineering pipeline!",
    }),
    secondaryButton: "Copy Email Address",
    secondaryButtonLink: {},
  },

  footer: {
    brand: selectedTitle ?? "Alex Morgan",
    copyright: `© ${new Date().getFullYear()} All rights reserved.`,
    socials: [
      {
        label: "GitHub",
        linkConfig: makeCtaLink({ type: "url", url: "https://github.com/" }),
      },
      {
        label: "LinkedIn",
        linkConfig: makeCtaLink({
          type: "url",
          url: "https://www.linkedin.com/",
        }),
      },
      {
        label: "Twitter",
        linkConfig: makeCtaLink({ type: "url", url: "https://twitter.com/" }),
      },
    ],
  },
});

const portfolio1: TemplateContent = {
  meta: {
    title: "Portfolio One",
    image: "/ti/portfolio-1.png",
    category: "portfolio",
    description:
      "A clean, professional portfolio template perfect for developers, designers, and creative professionals.",
  },
  config: {
    type: "portfolio-1",
    theme: "terminal",
    hasCustomizeSidebar: false,
    isPremium: false,
  },
  contentConfig: portfolioConfig,
  starterContent,
};

export default portfolio1;