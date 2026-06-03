import { makeWhatsappLink } from "@/components/shared/helpers";
import { SchemaParams } from "@/components/templateBuilder/types";
import { TemplateContent } from "@/lib/templates";

export const realEstateConfig = {
  navbar: "classic",
  hero: "background",
  footer: "classic",
  sections: [
    {
      id: "re-listings",
      type: "items",
      variant: "grid",
      enabled: true,
      anchorName: "properties",
    },
    {
      id: "re-about",
      type: "about",
      variant: "split",
      enabled: true,
      anchorName: "about",
    },
    {
      id: "re-gallery",
      type: "gallery",
      variant: "masonry",
      enabled: true,
      anchorName: "tour",
    },
    {
      id: "re-contact",
      type: "contact",
      variant: "split",
      enabled: true,
      anchorName: "enquiry",
    },
  ],
};

const starterContent = ({
  selectedTitle = "Prime Properties",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: realEstateConfig,
  navbar: {
    logo: "🏠",
    title: selectedTitle,
    ctaButton: "List Property",
    ctaButtonLink: makeWhatsappLink(whatsappNumber, "Hi, I'd like to list my property."),
    links: [
      { label: "Properties", type: "anchor", anchor: "properties", href: "" },
      { label: "About", type: "anchor", anchor: "about", href: "" },
      { label: "Tour", type: "anchor", anchor: "tour", href: "" },
    ],
  },
  hero: {
    badge: "Find Your Dream Home 🗝️",
    title: "The Most Trusted Name in Real Estate",
    desc: "We help you find the perfect property that fits your lifestyle and budget. From luxury villas to modern apartments, your new home is just a click away.",
    primaryButton: "Browse Listings",
    primaryButtonLink: { type: "anchor", anchorId: "properties" },
    secondaryButton: "Chat with Agent",
    secondaryButtonLink: makeWhatsappLink(whatsappNumber, "Hi, I'm looking for a property."),
    image1: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000",
  },
  "re-listings": {
    heading: "Featured Properties",
    subheading: "Explore our hand-picked selection of premium real estate.",
    items: [
      { title: "Modern Villa", desc: "4 Bedroom Luxury Villa with Pool.", price: "₦120M", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=500", btnLabel: "WhatsApp Enquiry" },
      { title: "Lekki Apartment", desc: "Spacious 3 Bedroom Apartment in a serene estate.", price: "₦65M", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=500", btnLabel: "WhatsApp Enquiry" },
      { title: "Business Plaza", desc: "Commercial space in a high-traffic area.", price: "₦250M", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=500", btnLabel: "WhatsApp Enquiry" },
    ],
  },
  "re-about": {
    label: "Why Choose Us",
    title: "Your Reliable Real Estate Partner",
    desc: "With a deep understanding of the local market and a commitment to transparency, we ensure a smooth and stress-free property buying experience.",
    stat1Value: "1k+",
    stat1Label: "Properties Sold",
    stat2Value: "500+",
    stat2Label: "Active Listings",
    stat3Value: "100%",
    stat3Label: "Secure Deals",
  },
  "re-gallery": {
    heading: "Property Gallery",
    subheading: "Take a closer look at our exclusive property tours.",
    items: [
      { image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=500", caption: "Kitchen Design" },
      { image: "https://images.unsplash.com/photo-1600607687940-c52af09239b7?auto=format&fit=crop&q=80&w=500", caption: "Master Bedroom" },
      { image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=500", caption: "Luxury Pool" },
    ],
  },
  "re-contact": {
    title: "Talk to a Property Expert",
    desc: "Our agents are ready to help you make the best decision. Get in touch now.",
    email: "hello@primeproperties.com",
    phone: whatsappNumber,
    location: "Plaza 5, Admiralty Way, Lekki Phase 1, Lagos",
    primaryButton: "Chat on WhatsApp",
    primaryButtonLink: makeWhatsappLink(whatsappNumber),
  },
  footer: {
    brand: selectedTitle,
    copyright: "© 2024 Prime Properties. All rights reserved.",
  },
});

const realEstate: TemplateContent = {
  meta: {
    title: "Real Estate",
    image: "/ti/real-estate.png",
    category: "business",
    description: "A high-conversion template for real estate agents and property managers.",
  },
  config: {
    type: "real-estate",
    theme: "mono",
    hasCustomizeSidebar: true,
    isPremium: false,
  },
  contentConfig: realEstateConfig,
  starterContent,
};

export default realEstate;
