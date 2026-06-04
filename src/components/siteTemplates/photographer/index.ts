import { makeWhatsappLink } from "@/components/shared/helpers";
import { SchemaParams } from "@/components/templateBuilder/types";
import { TemplateContent } from "@/lib/templates";

export const photoConfig = {
  navbar: "minimal",
  hero: "background",
  footer: "centered",
  sections: [
    {
      id: "photo_gallery",
      type: "gallery",
      variant: "masonry",
      enabled: true,
      anchorName: "work",
    },
    {
      id: "photo_pricing",
      type: "pricing",
      variant: "highlight-top",
      enabled: true,
      anchorName: "packages",
    },
    {
      id: "photo_testimonials",
      type: "testimonials",
      variant: "carousel",
      enabled: true,
      anchorName: "reviews",
    },
    {
      id: "photo_contact",
      type: "contact",
      variant: "split",
      enabled: true,
      anchorName: "contact",
    },
  ],
};

const starterContent = ({
  selectedTitle = "Moments",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: photoConfig,
  navbar: {
    logo: "📸",
    title: selectedTitle,
    ctaButton: "Get a Quote",
    ctaButtonLink: makeWhatsappLink(whatsappNumber, "Hi, I'm interested in your photography services."),
    links: [
      { label: "Portfolio", type: "anchor", anchor: "work", href: "" },
      { label: "Packages", type: "anchor", anchor: "packages", href: "" },
      { label: "Contact", type: "anchor", anchor: "contact", href: "" },
    ],
  },
  hero: {
    badge: "Professional Photographer 🎞️",
    title: "Capturing the Beauty of Your Story",
    desc: "From intimate weddings to high-end commercial shoots, I bring a unique perspective to every frame. Let's create something timeless together.",
    primaryButton: "View Portfolio",
    primaryButtonLink: { type: "anchor", anchorId: "work" },
    secondaryButton: "Chat on WhatsApp",
    secondaryButtonLink: makeWhatsappLink(whatsappNumber),
    image1: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&q=80&w=1000",
  },
  photo_gallery: {
    heading: "Featured Work",
    subheading: "A glimpse into the moments I've had the honor of capturing.",
    items: [
      { image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=500", caption: "Nature & Landscape" },
      { image: "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", caption: "Portrait Session" },
      { image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=500", caption: "Editorial Portrait" },
      { image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=500", caption: "Wedding Story" },
      { image: "https://images.unsplash.com/photo-1615966650071-855b15f29ad1?q=80&w=966&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", caption: "Couples Session" },
    ],
  },
  photo_pricing: {
    heading: "Service Packages",
    subheading: "Flexible pricing for every occasion.",
    plans: [
      { name: "Portrait", price: "₦50k", desc: "1-hour session, 10 edited photos.", features: ["Outdoor/Indoor", "1 Outfit Change", "Digital Gallery"], cta: "Book Session" },
      { name: "Wedding", price: "₦350k", desc: "Full day coverage, 200+ edited photos.", features: ["Full Day Coverage", "Second Photographer", "Physical Photo Book", "USB Drive"], featured: true, cta: "Book Wedding" },
    ],
  },
  photo_testimonials: {
    heading: "Kind Words from Clients",
    items: [
      { quote: "The photos turned out even better than we imagined! Truly a professional with an eye for detail.", name: "Emily R.", role: "Bride" },
      { quote: "Amazing to work with. Made us feel so comfortable during our family shoot.", name: "Mark S.", role: "Entrepreneur" },
    ],
  },
  photo_contact: {
    title: "Let's Create Magic",
    desc: "Available for travel and local assignments. Reach out for availability.",
    email: "hello@capturedmoments.com",
    phone: whatsappNumber,
    location: "Studio 10, Creative Park, Lagos",
    primaryButton: "Send WhatsApp Message",
    primaryButtonLink: makeWhatsappLink(whatsappNumber),
  },
  footer: {
    brand: selectedTitle,
    copyright: "© 2024 Captured Moments. All rights reserved.",
  },
});

const photographer: TemplateContent = {
  meta: {
    title: "Photographer / Creative",
    image: "/ti/photographer.png",
    category: "creative",
    description: "A portfolio-first template for photographers, videographers, and designers.",
  },
  config: {
    type: "photographer",
    theme: "classic",
    hasCustomizeSidebar: true,
    isPremium: false,
  },
  contentConfig: photoConfig,
  starterContent,
};

export default photographer;
