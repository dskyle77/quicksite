import { makeWhatsappLink } from "@/components/shared/helpers";
import { SchemaParams } from "@/components/templateBuilder/types";
import { TemplateContent } from "@/lib/templates";

export const beautyConfig = {
  navbar: "classic",
  hero: "background",
  footer: "classic",
  sections: [
    {
      id: "beau_features",
      type: "features",
      variant: "list",
      enabled: true,
      anchorName: "services",
    },
    {
      id: "beau_pricing",
      type: "pricing",
      variant: "default",
      enabled: true,
      anchorName: "pricing",
    },
    {
      id: "beau_gallery",
      type: "gallery",
      variant: "before-after",
      enabled: true,
      anchorName: "transformations",
    },
    {
      id: "beau_contact",
      type: "contact",
      variant: "form",
      enabled: true,
      anchorName: "appointment",
    },
  ],
};

const starterContent = ({
  selectedTitle = "Glow Beauty Bar",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: beautyConfig,
  navbar: {
    logo: "💄",
    title: selectedTitle,
    ctaButton: "Book Now",
    ctaButtonLink: makeWhatsappLink(whatsappNumber, "Hi, I'd like to book a beauty session."),
    links: [
      { label: "Services", type: "anchor", anchor: "services", href: "" },
      { label: "Pricing", type: "anchor", anchor: "pricing", href: "" },
      { label: "Before/After", type: "anchor", anchor: "transformations", href: "" },
    ],
  },
  hero: {
    badge: "Expert Beauty Services ✨",
    title: "Enhance Your Natural Beauty",
    desc: "From professional makeup to expert hair styling, we provide top-tier beauty services that make you look and feel extraordinary.",
    primaryButton: "Book an Appointment",
    primaryButtonLink: { type: "anchor", anchorId: "appointment" },
    secondaryButton: "See Our Work",
    secondaryButtonLink: { type: "anchor", anchorId: "transformations" },
    image1: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000",
  },
  beau_features: {
    heading: "Our Specialized Services",
    subheading: "Professional beauty treatments tailored to you.",
    items: [
      { title: "Hair Styling", desc: "Expert cuts, coloring, and treatments for all hair types." },
      { title: "Professional Makeup", desc: "Flawless makeup for weddings, events, and photoshoots." },
      { title: "Nail Art", desc: "Creative and durable nail designs and manicures." },
    ],
  },
  beau_pricing: {
    heading: "Service Packages",
    subheading: "Choose the package that fits your needs.",
    plans: [
      { name: "Basic", price: "₦15,000", desc: "Hair wash & style + Basic makeup.", features: ["Hair Styling", "Light Makeup", "Free Consultation"], cta: "Book Basic" },
      { name: "Glam", price: "₦35,000", desc: "Full hair transformation + Luxury makeup.", features: ["Premium Styling", "Full Glam Makeup", "Nail Set", "Priority Booking"], featured: true, cta: "Book Glam" },
    ],
  },
  beau_gallery: {
    heading: "Stunning Transformations",
    subheading: "See the amazing results our clients achieve.",
    items: [
      { image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=500", image2: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=500", caption: "Makeup Glow Up" },
      { image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=500", image2: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=500", caption: "Hair Extension Magic" },
    ],
  },
  beau_contact: {
    title: "Book Your Session",
    desc: "Fill the form or message us to secure your slot.",
    email: "glow@beautybar.com",
    phone: whatsappNumber,
    location: "Grace Plaza, Ikeja, Lagos",
    hours: "Tue - Sat: 10am - 7pm",
    primaryButton: "Message on WhatsApp",
    primaryButtonLink: makeWhatsappLink(whatsappNumber),
  },
  footer: {
    brand: selectedTitle,
    copyright: "© 2024 Glow Beauty Bar. All rights reserved.",
  },
});

const beauty: TemplateContent = {
  meta: {
    title: "Beauty / Salon",
    image: "/ti/beauty.png",
    category: "beauty",
    description: "Perfect for hair stylists, makeup artists, and salons with before/after galleries and service lists.",
  },
  config: {
    type: "beauty",
    theme: "coral",
    hasCustomizeSidebar: true,
    isPremium: false,
  },
  contentConfig: beautyConfig,
  starterContent,
};

export default beauty;
