// ─── Starter Content ───────────────────────────────────────────────────────────

const getStarterContent = ({
  selectedTitle,
  whatsappNumber,
  defaultMessage,
}: {
  selectedTitle?: string;
  whatsappNumber?: string;
  defaultMessage?: string;
}) => {
  const getWhatsappButtonLink = () => {
    if (!whatsappNumber) return {};
    return {
      type: "whatsapp",
      phone: whatsappNumber,
      message: typeof defaultMessage === "string" ? defaultMessage : "",
    };
  };

  return {
    navbar: {
      logo: "✦",
      title: selectedTitle || "My Portfolio",
      ctaButton: "Hire Me",
      ctaButtonLink: getWhatsappButtonLink(),
    },
    hero: {
      badge: "👋 Available for Work",
      type: "background",
      image1:
        "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
      image1PId: "",
      title: "Hi, I'm Alex — Creative Developer",
      desc: "I craft beautiful digital experiences — from sleek web apps to polished mobile products. Let's build something extraordinary together.",
      primaryButton: "View My Work",
      primaryButtonLink: getWhatsappButtonLink(),
      secondaryButton: "Download CV",
      secondaryButtonLink: {},
    },
    about: {
      label: "About Me",
      title: "Turning Ideas Into Reality",
      desc: "I'm a passionate full-stack developer with a love for clean code and thoughtful design. With experience across a wide range of industries, I bring both technical depth and creative thinking to every project.",
      desc2:
        "When I'm not coding, you'll find me exploring new technologies, contributing to open source, or enjoying a great cup of coffee.",
      image1:
        "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
      image1PId: "",
      stat1Value: "20+",
      stat1Label: "Projects Done",
      stat2Value: "15+",
      stat2Label: "Happy Clients",
      stat3Value: "3+",
      stat3Label: "Years Experience",
      stat4Value: "5",
      stat4Label: "Awards",
    },
    skillsHeading: "Skills & Expertise",
    skillsSubheading: "Technologies and tools I use to bring ideas to life.",
    skills: [
      { name: "React / Next.js", level: "95" },
      { name: "TypeScript", level: "90" },
      { name: "Node.js", level: "85" },
      { name: "UI/UX Design", level: "80" },
      { name: "PostgreSQL", level: "75" },
      { name: "DevOps / Docker", level: "70" },
    ],
    skillTags: [
      "JavaScript",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Tailwind CSS",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "Git",
      "Figma",
    ],
    projectsHeading: "Featured Projects",
    projectsSubheading: "A selection of work I'm proud of.",
    experienceHeading: "Work Experience",
    experienceSubheading:
      "My professional journey and the impact I've made along the way.",
    experience: [
      {
        role: "Senior Frontend Developer",
        company: "TechVenture Inc.",
        period: "2022 – Present",
        desc: "Led the redesign of the core product UI, improving user engagement by 40%. Mentored junior developers and established frontend architecture standards.",
      },
      {
        role: "Full Stack Developer",
        company: "Digital Agency Co.",
        period: "2020 – 2022",
        desc: "Delivered 10+ client projects across fintech, e-commerce, and SaaS verticals. Built RESTful APIs and responsive web applications.",
      },
      {
        role: "Junior Developer",
        company: "Startup Studio",
        period: "2019 – 2020",
        desc: "Contributed to MVP development for three early-stage startups. Gained hands-on experience in agile workflows and rapid prototyping.",
      },
    ],
    testimonialsHeading: "Kind Words",
    testimonials: [
      {
        quote:
          "Alex delivered an exceptional product — clean code, beautiful UI, and shipped ahead of schedule. Would hire again without hesitation.",
        name: "Sarah Johnson",
        role: "CEO, TechStart",
      },
      {
        quote:
          "Working with Alex was a game-changer. He understood our vision immediately and turned it into a product our users love.",
        name: "Michael Chen",
        role: "Founder, Creative Studio",
      },
    ],
    contact: {
      title: "Let's Work Together",
      desc: "Have a project in mind? I'd love to hear about it. Let's chat and see how I can help.",
      primaryButton: "Send a Message",
      primaryButtonLink: getWhatsappButtonLink(),
      secondaryButton: "Schedule a Call",
      secondaryButtonLink: getWhatsappButtonLink(),
    },
    footer: {
      brand: "Alex Morgan",
      copyright: `© ${new Date().getFullYear()} All rights reserved.`,
      socials: ["GitHub", "LinkedIn", "Twitter", "Dribbble"],
    },

    // Subpages — keyed by slug, each has title + body + optional image
    pages: {
      projects: [
        {
          title: "E-Commerce Platform",
          desc: "A full-stack online store with real-time inventory, Stripe payments, and an intuitive admin dashboard.",
          tags: ["Next.js", "Stripe", "PostgreSQL"],
          image:
            "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
          imagePId: "",
        },
        {
          title: "Task Management App",
          desc: "A collaborative productivity app with drag-and-drop boards, real-time updates, and team workspaces.",
          tags: ["React", "Node.js", "WebSockets"],
          image:
            "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
          imagePId: "",
        },
        {
          title: "AI Content Generator",
          desc: "A SaaS tool that uses AI to generate blog posts, social captions, and marketing copy at scale.",
          tags: ["OpenAI", "Next.js", "Tailwind"],
          image:
            "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
          imagePId: "",
        },
      ],
    },
  };
};

// lib/ai-schemas.ts
const getSchema = ({
  selectedTitle,
  whatsappNumber,
  defaultMessage,
  defaultImage,
}: {
  selectedTitle?: string;
  whatsappNumber?: string;
  defaultMessage?: string;
  defaultImage?: string;
}) => {
  const whatsappLink = whatsappNumber
    ? {
        type: "whatsapp",
        phone: whatsappNumber,
        message: typeof defaultMessage === "string" ? defaultMessage : "",
      }
    : {};

  return {
    navbar: {
      logo: "✦",
      title: selectedTitle || "",
      ctaButton: "",
      ctaButtonLink: whatsappLink,
    },
    hero: {
      type: "CHOOSE ONE: 'side' | 'background'",
      badge: "",
      image1: defaultImage,
      image1PId: "",
      title: "",
      desc: "",
      primaryButton: "",
      primaryButtonLink: whatsappLink,
      secondaryButton: "",
      secondaryButtonLink: {},
    },
    about: {
      label: "",
      title: "",
      desc: "",
      desc2: "",
      image1: defaultImage,
      image1PId: "",
      stat1Value: "",
      stat1Label: "",
      stat2Value: "",
      stat2Label: "",
      stat3Value: "",
      stat3Label: "",
      stat4Value: "",
      stat4Label: "",
    },
    skillsHeading: "",
    skillsSubheading: "",
    skills: [
      { name: "", level: "1-100" },
      { name: "", level: "1-100" },
      { name: "", level: "1-100" },
      { name: "", level: "1-100" },
    ],
    skillTags: [],
    projectsHeading: "",
    projectsSubheading: "",
    experienceHeading: "",
    experienceSubheading: "",
    experience: [
      { role: "", company: "", period: "", desc: "" },
      { role: "", company: "", period: "", desc: "" },
    ],
    testimonialsHeading: "",
    testimonials: [
      { quote: "", name: "", role: "" },
      { quote: "", name: "", role: "" },
    ],
    contact: {
      title: "",
      desc: "",
      primaryButton: "",
      primaryButtonLink: whatsappLink,
      secondaryButton: "",
      secondaryButtonLink: whatsappLink,
    },
    footer: {
      brand: selectedTitle || "",
      copyright: `© ${new Date().getFullYear()} All rights reserved.`,
      socials: ["GitHub", "LinkedIn", "Twitter"],
    },
    pages: {
      projects: [
        { title: "", desc: "", tags: [], image: defaultImage, imagePId: "" },
        { title: "", desc: "", tags: [], image: defaultImage, imagePId: "" },
        { title: "", desc: "", tags: [], image: defaultImage, imagePId: "" },
      ],
    },
  };
};

// ─── Meta & Config ─────────────────────────────────────────────────────────────

const meta = {
  title: "Portfolio",
  image: "/ti/p1.png",
  category: "Portfolio",
  description:
    "A clean, modern portfolio template for developers, designers, and creatives. Showcase your skills, projects, and experience with style.",
};

const config = {
  type: "portfolio-2",
  theme: "warm",
};

export const portfolio2Content = {
  meta,
  config,
  getSchema,
  getStarterContent,
};
