import { makeWhatsappLink } from "@/components/shared/helpers";
import { SchemaParams } from "@/components/templateBuilder/types";
import { TemplateContent } from "@/lib/templates";

export const professionalConfig = {
  navbar: "classic",
  hero: "split",
  footer: "classic",
  sections: [
    {
      id: "prof-about",
      type: "about",
      variant: "card-stats",
      enabled: true,
      anchorName: "about",
    },
    {
      id: "prof-features",
      type: "features",
      variant: "list",
      enabled: true,
      anchorName: "services",
    },
    {
      id: "prof-items",
      type: "items",
      variant: "grid",
      enabled: true,
      anchorName: "case-studies",
    },
    {
      id: "prof-contact",
      type: "contact",
      variant: "form",
      enabled: true,
      anchorName: "contact",
    },
  ],
};

const starterContent = ({
  selectedTitle = "Summit Consulting",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: professionalConfig,
  navbar: {
    logo: "💼",
    title: selectedTitle,
    ctaButton: "Consult",
    ctaButtonLink: makeWhatsappLink(whatsappNumber, "Hi, I'd like to book a consultation."),
    links: [
      { label: "About", type: "anchor", anchor: "about", href: "" },
      { label: "Services", type: "anchor", anchor: "services", href: "" },
      { label: "Case Studies", type: "anchor", anchor: "case-studies", href: "" },
    ],
  },
  hero: {
    badge: "Strategic Advisory 📈",
    title: "Empowering Your Business for Sustainable Growth",
    desc: "We provide expert consulting services to help businesses optimize operations, increase revenue, and scale effectively in competitive markets.",
    primaryButton: "Our Services",
    primaryButtonLink: { type: "anchor", anchorId: "services" },
    secondaryButton: "Success Stories",
    secondaryButtonLink: { type: "anchor", anchorId: "case-studies" },
    image1: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1000",
  },
  "prof-about": {
    label: "About Us",
    title: "Dedicated to Your Success",
    desc: "With over 15 years of industry experience, we bring a wealth of knowledge and a track record of success to every client engagement.",
    stat1Value: "500+",
    stat1Label: "Clients Served",
    stat2Value: "98%",
    stat2Label: "Retention Rate",
    stat3Value: "20+",
    stat3Label: "Experts",
    stat4Value: "15+",
    stat4Label: "Years Exp",
  },
  "prof-features": {
    heading: "How We Can Help",
    subheading: "Tailored solutions for complex business challenges.",
    items: [
      { title: "Business Strategy", desc: "Long-term planning and market positioning strategies." },
      { title: "Financial Advisory", desc: "Investment analysis, budgeting, and financial health checks." },
      { title: "Operational Efficiency", desc: "Streamlining processes to reduce costs and improve output." },
    ],
  },
  "prof-items": {
    heading: "Recent Case Studies",
    subheading: "Real results achieved for our clients.",
    items: [
      { title: "Tech Startup Scale-up", desc: "Helped a fintech startup grow from 10k to 100k active users in 12 months.", tags: ["Strategy", "Growth"] },
      { title: "Manufacturing Optimization", desc: "Reduced operational costs by 25% for a leading textile manufacturer.", tags: ["Operations", "Efficiency"] },
    ],
  },
  "prof-contact": {
    title: "Start Your Journey to Success",
    desc: "Ready to take your business to the next level? Fill the form below.",
    email: "contact@summitconsulting.com",
    phone: whatsappNumber,
    location: "Corporate Towers, Central Business District, Abuja",
    primaryButton: "Request a Call",
    primaryButtonLink: makeWhatsappLink(whatsappNumber, "Hi, I'd like to request a callback."),
  },
  footer: {
    brand: selectedTitle,
    copyright: "© 2024 Summit Consulting. All rights reserved.",
  },
});

const professional: TemplateContent = {
  meta: {
    title: "Professional Services",
    image: "/ti/professional.png",
    category: "business",
    description: "A clean, corporate template for consultants, agencies, and professional firms.",
  },
  config: {
    type: "professional",
    theme: "slate",
    hasCustomizeSidebar: true,
    isPremium: false,
  },
  contentConfig: professionalConfig,
  starterContent,
};

export default professional;
