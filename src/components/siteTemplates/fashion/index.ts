import { makeWhatsappLink } from "@/components/shared/helpers";
import { SchemaParams } from "@/components/templateBuilder/types";
import { TemplateContent } from "@/lib/templates";

export const fashionConfig = {
  navbar: "classic",
  hero: "split",
  footer: "classic",
  sections: [
    {
      id: "fash_gallery",
      type: "gallery",
      variant: "masonry",
      enabled: true,
      anchorName: "portfolio",
    },
    {
      id: "fash_features",
      type: "features",
      variant: "icons",
      enabled: true,
      anchorName: "services",
    },
    {
      id: "fash_testimonials",
      type: "testimonials",
      variant: "grid",
      enabled: true,
      anchorName: "testimonials",
    },
    {
      id: "fash_contact",
      type: "contact",
      variant: "minimal",
      enabled: true,
      anchorName: "booking",
    },
  ],
};

const starterContent = ({
  selectedTitle = "Elite Stitches",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: fashionConfig,
  navbar: {
    logo: "✂️",
    title: selectedTitle,
    ctaButton: "Book Appointment",
    ctaButtonLink: makeWhatsappLink(whatsappNumber, "Hi, I'd like to book a fitting."),
    links: [
      { label: "Portfolio", type: "anchor", anchor: "portfolio", href: "" },
      { label: "Services", type: "anchor", anchor: "services", href: "" },
      { label: "Reviews", type: "anchor", anchor: "testimonials", href: "" },
    ],
  },
  hero: {
    badge: "Bespoke Fashion 👗",
    title: "Elegance in Every Stitch",
    desc: "Custom-made clothing designed to fit your style and personality. From wedding gowns to corporate wear, we bring your fashion dreams to life.",
    primaryButton: "View Collection",
    primaryButtonLink: { type: "anchor", anchorId: "portfolio" },
    secondaryButton: "Get a Quote",
    secondaryButtonLink: makeWhatsappLink(whatsappNumber, "Hi, I'd like a quote for a custom outfit."),
    image1: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  fash_gallery: {
    heading: "Our Portfolio",
    subheading: "A showcase of our recent bespoke designs.",
    items: [
      { image: "https://images.unsplash.com/photo-1568251188392-ae32f898cb3b?q=80&w=862&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", caption: "Gown" },
      { image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=500", caption: "Corporate Suit" },
      { image: "https://images.unsplash.com/photo-1655149238677-9b5cb1a0afc6?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", caption: "Traditional Wear" },
      { image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=500", caption: "Summer Collection" },
      { image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=500", caption: "Evening Wear" },
    ],
  },
  fash_features: {
    heading: "Our Services",
    subheading: "What we offer to help you look your best.",
    items: [
      { title: "Bespoke Tailoring", desc: "Clothes made specifically to your measurements." },
      { title: "Alterations", desc: "Expert adjustments to your existing wardrobe." },
      { title: "Style Consultation", desc: "Professional advice on fabrics and designs." },
      { title: "Wedding Packages", desc: "Full bridal and groom party styling." },
    ],
  },
  fash_testimonials: {
    heading: "What Our Clients Say",
    items: [
      { quote: "Absolutely loved my dress! The fit was perfect and the fabric quality is amazing.", name: "Linda K.", role: "Bride" },
      { quote: "The best tailor in the city. Professional service and quick turnaround.", name: "James W.", role: "CEO" },
    ],
  },
  fash_contact: {
    title: "Ready for Your Next Outfit?",
    desc: "Message us on WhatsApp to start your fashion journey.",
    email: "hello@elitestitches.com",
    phone: whatsappNumber,
    location: "Fashion Hub, Lekki Phase 1, Lagos",
    primaryButton: "Chat on WhatsApp",
    primaryButtonLink: makeWhatsappLink(whatsappNumber),
  },
  footer: {
    brand: selectedTitle,
    copyright: "© 2024 Elite Stitches. All rights reserved.",
    socials: [
      { label: "Instagram", linkConfig: { type: "url", url: "https://instagram.com" } },
    ],
  },
});

const fashion: TemplateContent = {
  meta: {
    title: "Fashion / Tailor",
    image: "/ti/fashion.png",
    category: "beauty",
    description: "A visually stunning template for fashion designers and tailors to showcase their portfolio.",
  },
  config: {
    type: "fashion",
    theme: "warm",
    canCustomize: true,
    isPremium: false,
  },
  contentConfig: fashionConfig,
  starterContent,
};

export default fashion;
