export const template1StarterContent = ({
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
      logo: "🚀",
      title: selectedTitle || "My Business",
      links: ["Features", "About", "Pricing", "Contact"],
    },

    hero: {
      badge: "✨ New & Improved",
      image1:
        "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
      image1PId: "",
      title: "Transform Your Business With Our Solution",
      desc: "We help businesses grow faster with innovative solutions designed to simplify your workflow and maximize results.",
      primaryButton: "Get Started",
      primaryButtonLink: getWhatsappButtonLink(),
      secondaryButton: "Learn More",
      secondaryButtonLink: getWhatsappButtonLink(),
    },

    trustedByLabel: "Trusted by",
    trustedBy: [
      "TechCorp",
      "StartupHub",
      "Creative Co",
      "Innovation Labs",
      "Digital Agency",
    ],

    featuresHeading: "Why Choose Us",
    featuresSubheading:
      "Discover what makes us different and how we can help you achieve your goals.",

    features: [
      {
        title: "Quality Service",
        desc: "We deliver exceptional quality in everything we do, ensuring your complete satisfaction.",
      },
      {
        title: "Fast Delivery",
        desc: "Get results quickly without compromising on quality or attention to detail.",
      },
      {
        title: "Expert Support",
        desc: "Our team of experts is here to help you succeed every step of the way.",
      },
    ],

    stats: [
      { value: "500+", label: "Happy Customers" },
      { value: "98%", label: "Satisfaction Rate" },
      { value: "24/7", label: "Support Available" },
    ],

    testimonialsHeading: "What Our Clients Say",
    testimonials: [
      {
        quote:
          "This has completely transformed how we do business. Highly recommend to anyone looking for quality.",
        name: "Sarah Johnson",
        role: "CEO, TechStart",
      },
      {
        quote:
          "Exceptional service and results. The team went above and beyond our expectations.",
        name: "Michael Chen",
        role: "Founder, Creative Studio",
      },
    ],

    cta: {
      title: "Ready to Get Started?",
      desc: "Join thousands of satisfied customers and start your journey with us today.",
      button: "Get Started Now",
      buttonLink: getWhatsappButtonLink(),
    },

    footer: {
      brand: "My Business",
      copyright: `© ${new Date().getFullYear()} My Business. All rights reserved.`,
    },
  };
};

export const template1Meta = {
  title: "Business Landing Page",
  category: "Landing Page",
  description:
    "A versatile landing page template perfect for businesses, products, services, or personal brands. Clean, professional, and fully customizable.",
};
export const template1Config = {
  type: "template-1",
  theme: "light",
  category: "landing-page",
};
