const getStarterContent = ({
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
      title: selectedTitle || "Jane Doe",
      ctaButton: "Hire Me",
      ctaButtonLink: getWhatsappButtonLink(),
    },
    hero: {
      name: selectedTitle || "Jane Doe",
      role: "UI Designer & Developer",
      tagline:
        "I craft clean, purposeful digital products that people enjoy using.",
      primaryButton: "See My Work",
      primaryButtonLink: getWhatsappButtonLink(),
      secondaryButton: "Get in Touch",
      secondaryButtonLink: getWhatsappButtonLink(),
      image1: defaultImage,
      image1PId: "",
    },
    about: {
      heading: "About Me",
      body: "I'm a designer and developer based in Lagos, Nigeria. I focus on making things that are simple, functional, and beautiful. When I'm not building, I'm reading, sketching, or exploring new tools.",
    },
    projectsHeading: "Selected Work",
    projects: [
      {
        title: "Brand Identity System",
        category: "Design",
        desc: "Full brand refresh for a Lagos-based fintech startup — logo, colours, typography, and usage guidelines.",
        image: defaultImage,
        imagePId: "",
        link: {},
      },
      {
        title: "Mobile Banking App",
        category: "UI/UX",
        desc: "End-to-end product design for a savings and payments app targeting young professionals.",
        image: defaultImage,
        imagePId: "",
        link: {},
      },
      {
        title: "Portfolio Website",
        category: "Development",
        desc: "Custom Next.js portfolio with a CMS, dark mode, and fast load times.",
        image: defaultImage,
        imagePId: "",
        link: {},
      },
    ],
    contact: {
      heading: "Let's Work Together",
      subheading:
        "Open to freelance projects, full-time roles, and interesting collabs.",
      primaryButton: "Send a Message",
      primaryButtonLink: getWhatsappButtonLink(),
    },
    footer: {
      name: selectedTitle || "Jane Doe",
      copyright: `© ${new Date().getFullYear()}`,
      socials: [
        { label: "Twitter", url: "#" },
        { label: "GitHub", url: "#" },
        { label: "LinkedIn", url: "#" },
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
  // We pre-calculate the technical link so the AI just maps it to buttons
  const whatsappLink = whatsappNumber
    ? { type: "whatsapp", phone: whatsappNumber, message: defaultMessage || "" }
    : {};

  return {
    navbar: {
      logo: "✦",
      title: selectedTitle || "", // AI should confirm or refine this
      ctaButton: "",
    },
    hero: {
      name: selectedTitle || "",
      role: "", // AI fills this
      tagline: "", // AI fills this
      primaryButton: "",
      primaryButtonLink: whatsappLink, // Fixed technical field
      secondaryButton: "",
      secondaryButtonLink: whatsappLink, // Fixed technical field
      image1: defaultImage,
      image1PId: "",
    },
    about: {
      heading: "",
      body: "",
    },
    projectsHeading: "",
    projects: [
      {
        title: "",
        category: "",
        desc: "",
        image: defaultImage,
        imagePId: "",
        link: {},
      },
      {
        title: "",
        category: "",
        desc: "",
        image: defaultImage,
        imagePId: "",
        link: {},
      },
    ],
    contact: {
      heading: "",
      subheading: "",
      primaryButton: "",
      primaryButtonLink: whatsappLink,
    },
    footer: {
      name: selectedTitle || "",
      copyright: `© ${new Date().getFullYear()}`,
      socials: [
        { label: "Twitter", url: "#" },
        { label: "GitHub", url: "#" },
        { label: "LinkedIn", url: "#" },
      ],
    },
  };
};

const meta = {
  title: "Mini Portfolio",
  image: "/ti/pm1.png",
  category: "Portfolio",
  description:
    "A clean, minimal one-page portfolio for designers, developers, and creatives. No clutter — just your work.",
};

const config = {
  type: "portfolio-1",
  theme: "ocean",
};

export const portfolio1Content = {
  meta,
  config,
  getSchema,
  getStarterContent,
};
