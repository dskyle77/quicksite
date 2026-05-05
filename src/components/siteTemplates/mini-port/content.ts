export const templateMiniStarterContent = ({
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
      image1:
        "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
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
        image:
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        link: {},
      },
      {
        title: "Mobile Banking App",
        category: "UI/UX",
        desc: "End-to-end product design for a savings and payments app targeting young professionals.",
        image:
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        link: {},
      },
      {
        title: "Portfolio Website",
        category: "Development",
        desc: "Custom Next.js portfolio with a CMS, dark mode, and fast load times.",
        image:
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
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

export const templateMiniMeta = {
  title: "Mini Portfolio",
  image: "/ti/pm1.png",
  category: "Portfolio",
  description:
    "A clean, minimal one-page portfolio for designers, developers, and creatives. No clutter — just your work.",
};

export const templateMiniConfig = {
  type: "template-mini",
  theme: "ocean",
  category: "portfolio",
};
