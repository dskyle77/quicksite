/* eslint-disable @typescript-eslint/no-explicit-any */
import { LinkConfig } from "@/components/shared/EditableLink";
import { SchemaParams } from "@/components/templateBuilder/types";
import { ExperienceSectionVariant } from "@/components/templateBuilder/variants/sectionVariants/ExperienceVariants";
import { SkillsSectionVariants } from "@/components/templateBuilder/variants/sectionVariants/SkillsVariants";

export const portfolioConfig = {
  navbar: "none",
  hero: "background",
  footer: "classic",
  sections: [
    {
      id: "ab_",
      type: "about",
      variant: "split",
      enabled: true,
    },
    {
      id: "sk_",
      type: "skills",
      variant: "tags" as SkillsSectionVariants,
      enabled: true,
    },
    {
      id: "pr_",
      type: "projects",
      variant: "card-grid",
      enabled: true,
    },
    {
      id: "ex_",
      type: "experience",
      variant: "default" as ExperienceSectionVariant,
      enabled: true,
    },
    {
      id: "c_",
      type: "contact",
      variant: "default",
      enabled: true,
    },
  ],
};

const starterContent = ({
  selectedTitle = "Alex Morgan",
  whatsappNumber,
  defaultImage,
}: SchemaParams) => ({
  builderConfig: portfolioConfig,

  // HERO
  hero: {
    type: "background",
    badge: "Available for Freelance",
    image1:
      defaultImage ||
      "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
    image1PId: "",
    title: "Hi, I'm Alex Morgan",
    desc: "Full-Stack Developer crafting exceptional digital experiences with clean code and thoughtful design.",
    primaryButton: "Get In Touch",
    ...(whatsappNumber
      ? {
          primaryButtonLink: {
            type: "whatsapp",
            whatsappNumber,
            message: "Hi Alex, I'd like to discuss a project.",
          } as LinkConfig,
        }
      : {}),
    secondaryButton: "View My Work",
    secondaryButtonLink: {
      type: "anchor",
      anchorId: "projects",
    } as LinkConfig,
  },

  // ABOUT
  ab_about: {
    label: "About Me",
    title: "Turning Ideas Into Reality",
    desc: "I'm a passionate full-stack developer with over 4 years of experience building scalable web applications. I love clean architecture, beautiful UI, and solving real-world problems.",
    desc2:
      "When I'm not coding, you'll find me exploring new technologies, contributing to open source, or enjoying a good cup of coffee.",
    image1:
      defaultImage ||
      "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
    image1PId: "",
    stat1Value: "25+",
    stat1Label: "Projects Completed",
    stat2Value: "18+",
    stat2Label: "Happy Clients",
    stat3Value: "4+",
    stat3Label: "Years Experience",
    stat4Value: "7",
    stat4Label: "Technologies",
  },

  // SKILLS
  sk_skills: {
    heading: "Skills & Expertise",
    subheading: "Technologies and tools I use to bring ideas to life.",
    items: [
      { name: "React / Next.js", level: "95" },
      { name: "TypeScript", level: "92" },
      { name: "Node.js & Express", level: "88" },
      { name: "Tailwind CSS", level: "90" },
      { name: "PostgreSQL", level: "85" },
    ] as any,
    skillTags: [
      "JavaScript",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Tailwind",
      "PostgreSQL",
      "Git",
      "Docker",
    ],
  },

  // PROJECTS
  pr_projects: {
    heading: "Featured Projects",
    subheading: "A selection of work I'm proud of.",
    items: [
      {
        title: "E-Commerce Platform",
        desc: "A full-stack online store with real-time inventory, payment integration, and admin dashboard.",
        tags: ["Next.js", "Stripe", "PostgreSQL", "Tailwind"],
        image:
          defaultImage ||
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        previewLink: "https://example.com",
        btnLabel: "View Project",
      },
      {
        title: "TaskFlow - Project Management",
        desc: "Collaborative productivity app with real-time updates, drag-and-drop, and team workspaces.",
        tags: ["React", "Node.js", "Socket.io", "MongoDB"],
        image:
          defaultImage ||
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        previewLink: "",
        btnLabel: "View Project",
      },
    ],
  },

  // EXPERIENCE
  ex_experience: {
    heading: "Work Experience",
    subheading: "My professional journey and the impact I've made.",
    items: [
      {
        role: "Senior Frontend Developer",
        company: "TechVenture Inc.",
        period: "2023 – Present",
        desc: "Leading frontend architecture and UI/UX improvements. Increased user engagement by 45% through modern design systems.",
      },
      {
        role: "Full-Stack Developer",
        company: "StartupSphere",
        period: "2022 – 2023",
        desc: "Built and scaled multiple client projects from MVP to production. Implemented CI/CD pipelines and improved performance by 60%.",
      },
    ],
  },

  // CONTACT
  c_contact: {
    title: "Let's Work Together",
    desc: "Have an exciting project in mind? I'm currently available for freelance opportunities and full-time roles.",
    email: "hello@alexmorgan.dev",
    phone: whatsappNumber,
    location: "Lagos, Nigeria",
    primaryButton: "Send a Message",
    ...(whatsappNumber
      ? {
          primaryButtonLink: {
            type: "whatsapp",
            whatsappNumber,
            message: "Hi Alex, let's discuss a project.",
          },
        }
      : {}),
    secondaryButton: "Schedule a Call",
    secondaryButtonLink: {},
  },

  footer: {
    brand: selectedTitle ?? "Alex Morgan",
    copyright: `© ${new Date().getFullYear()} All rights reserved.`,
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
  },
});

const portfolio1 = {
  meta: {
    title: "Portfolio One",
    image: "/ti/builder.png",
    category: "portfolio",
    description:
      "A clean, professional portfolio template perfect for developers, designers, and creative professionals.",
  },
  config: {
    type: "portfolio-1",
    theme: "terminal",
    canCustomize: true,
  },
  contentConfig: portfolioConfig,
  starterContent,
};

export default portfolio1;
