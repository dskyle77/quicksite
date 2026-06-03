import { makeWhatsappLink } from "@/components/shared/helpers";
import { SchemaParams } from "@/components/templateBuilder/types";
import { TemplateContent } from "@/lib/templates";

export const eventConfig = {
  navbar: "classic",
  hero: "background",
  footer: "classic",
  sections: [
    {
      id: "ev-gallery",
      type: "gallery",
      variant: "grid",
      enabled: true,
      anchorName: "gallery",
    },
    {
      id: "ev-pricing",
      type: "pricing",
      variant: "default",
      enabled: true,
      anchorName: "packages",
    },
    {
      id: "ev-contact",
      type: "contact",
      variant: "minimal",
      enabled: true,
      anchorName: "enquiry",
    },
  ],
};

const starterContent = ({
  selectedTitle = "Grand Events & Rentals",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: eventConfig,
  navbar: {
    logo: "🎉",
    title: selectedTitle,
    ctaButton: "Book Now",
    ctaButtonLink: makeWhatsappLink(whatsappNumber, "Hi, I'd like to book an event."),
    links: [
      { label: "Gallery", type: "anchor", anchor: "gallery", href: "" },
      { label: "Packages", type: "anchor", anchor: "packages", href: "" },
      { label: "Enquiry", type: "anchor", anchor: "enquiry", href: "" },
    ],
  },
  hero: {
    badge: "Memorable Celebrations 🎈",
    title: "Turning Your Vision into Reality",
    desc: "From elegant weddings to corporate galas, we provide the decor and rentals you need to create a truly unforgettable event.",
    primaryButton: "See Our Work",
    primaryButtonLink: { type: "anchor", anchorId: "gallery" },
    secondaryButton: "Get a Quote",
    secondaryButtonLink: makeWhatsappLink(whatsappNumber, "Hi, I'd like a quote for my event."),
    image1: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1000",
  },
  "ev-gallery": {
    heading: "Event Highlights",
    subheading: "Beautiful moments from events we've managed.",
    items: [
      { image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=500", caption: "Luxury Wedding Decor" },
      { image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=500", caption: "Corporate Gala" },
      { image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=500", caption: "Birthday Bash" },
    ],
  },
  "ev-pricing": {
    heading: "Event Packages",
    subheading: "Complete solutions for your celebration.",
    plans: [
      { name: "Small Party", price: "₦150k", desc: "For up to 50 guests.", features: ["Basic Decor", "Table & Chair Rentals", "Standard Lighting"], cta: "Book Small" },
      { name: "Premium Wedding", price: "₦850k", desc: "Full planning and decor for up to 300 guests.", features: ["Luxury Decor", "Floral Arrangements", "Mood Lighting", "Event Coordination"], featured: true, cta: "Book Premium" },
    ],
  },
  "ev-contact": {
    title: "Ready to Start Planning?",
    desc: "Send us a message on WhatsApp and let's discuss your event.",
    email: "hello@grandevents.com",
    phone: whatsappNumber,
    location: "Event Plaza, Surulere, Lagos",
    primaryButton: "WhatsApp Enquiry",
    primaryButtonLink: makeWhatsappLink(whatsappNumber),
  },
  footer: {
    brand: selectedTitle,
    copyright: "© 2024 Grand Events. All rights reserved.",
  },
});

const events: TemplateContent = {
  meta: {
    title: "Event & Rentals",
    image: "/ti/event.png",
    category: "Event and Rentals",
    description: "Ideal for event planners, decorators, and rental businesses to showcase their style.",
  },
  config: {
    type: "event-rentals",
    theme: "classic",
    hasCustomizeSidebar: true,
    isPremium: false,
  },
  contentConfig: eventConfig,
  starterContent,
};

export default events;
