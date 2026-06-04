import { makeWhatsappLink } from "@/components/shared/helpers";
import { SchemaParams } from "@/components/templateBuilder/types";
import { TemplateContent } from "@/lib/templates";

export const barber2Config = {
  navbar: "minimal",
  hero: "split",
  footer: "centered",
  sections: [
    {
      id: "barb2_about",
      type: "about",
      variant: "card-stats",
      enabled: true,
      anchorName: "about",
    },
    {
      id: "barb2_features",
      type: "features",
      variant: "list",
      enabled: true,
      anchorName: "services",
    },
    {
      id: "barb2_gallery",
      type: "gallery",
      variant: "masonry",
      enabled: true,
      anchorName: "gallery",
    },
    {
      id: "barb2_testimonials",
      type: "testimonials",
      variant: "grid",
      enabled: true,
      anchorName: "reviews",
    },
    {
      id: "barb2_contact",
      type: "contact",
      variant: "split",
      enabled: true,
      anchorName: "contact",
    },
  ],
};

const starterContent = ({
  selectedTitle = "The Gentleman's Barber",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: barber2Config,
  navbar: {
    logo: "💈",
    title: selectedTitle,
    ctaButton: "Reserve a Seat",
    ctaButtonLink: makeWhatsappLink(
      whatsappNumber,
      "Hi, I'd like to reserve a seat at The Gentleman's Barber.",
    ),
    links: [
      { label: "About", type: "anchor", anchor: "about", href: "" },
      { label: "Services", type: "anchor", anchor: "services", href: "" },
      { label: "Gallery", type: "anchor", anchor: "gallery", href: "" },
      { label: "Contact", type: "anchor", anchor: "contact", href: "" },
    ],
  },
  hero: {
    badge: "Est. 2015 — Trusted by Thousands 🏆",
    title: "The Art of the Perfect Cut",
    desc: "Where tradition meets modern grooming. Our master barbers craft every cut with skill, precision, and a passion for excellence. Your style, perfected.",
    primaryButton: "Book Your Visit",
    primaryButtonLink: { type: "anchor", anchorId: "contact" },
    secondaryButton: "View Our Work",
    secondaryButtonLink: { type: "anchor", anchorId: "gallery" },
    image1:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=1000",
  },
  barb2_about: {
    label: "Our Story",
    title: "A Legacy of Craftsmanship",
    desc: "Founded in 2015, The Gentleman's Barber has been the go-to destination for men who value quality grooming. We combine old-school barbering traditions with modern techniques to deliver an unmatched experience.",
    stat1Value: "5,000+",
    stat1Label: "Happy Clients",
    stat2Value: "10+",
    stat2Label: "Years Open",
    stat3Value: "8",
    stat3Label: "Expert Barbers",
    stat4Value: "4.9★",
    stat4Label: "Avg. Rating",
  },
  barb2_features: {
    heading: "What We Offer",
    subheading: "Premium grooming services tailored to the modern gentleman.",
    items: [
      {
        title: "Signature Haircut",
        desc: "A personalized cut designed around your face shape, hair texture, and lifestyle.",
      },
      {
        title: "Fade & Taper",
        desc: "Skin fades, low fades, mid fades — executed with razor-sharp precision.",
      },
      {
        title: "Beard Sculpting",
        desc: "Full beard shaping, line-ups, and conditioning treatments for a polished look.",
      },
      {
        title: "Straight Razor Shave",
        desc: "The classic hot-towel straight razor shave — a true barbershop experience.",
      },
      {
        title: "Hair Coloring",
        desc: "Natural-looking color treatments, highlights, and grey blending.",
      },
    ],
  },
  barb2_gallery: {
    heading: "Our Work Speaks",
    subheading: "Every cut is a masterpiece. Browse our latest styles.",
    items: [
      {
        image:
          "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=500",
        caption: "Signature Fade",
      },
      {
        image:
          "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=500",
        caption: "Beard Sculpt",
      },
      {
        image:
          "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=500",
        caption: "Low Taper",
      },
      {
        image:
          "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=500",
        caption: "Classic Gentleman",
      },
      {
        image:
          "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=500",
        caption: "Razor Sharp Lineup",
      },
    ],
  },
  barb2_testimonials: {
    heading: "Trusted by Gentlemen",
    subheading: "Don't take our word for it — hear from our clients.",
    items: [
      {
        quote:
          "I've tried many barbershops but none compare. The attention to detail here is unmatched.",
        name: "Emeka N.",
        role: "Business Executive",
      },
      {
        quote:
          "My go-to spot every two weeks. Consistent quality and a great vibe every single time.",
        name: "Seun F.",
        role: "Loyal Client",
      },
      {
        quote:
          "The straight razor shave was an experience I didn't know I needed. Absolutely incredible.",
        name: "David K.",
        role: "First-Time Visitor",
      },
      {
        quote:
          "Professional, clean, and skilled. My beard has never looked this good.",
        name: "Ayo M.",
        role: "Regular Customer",
      },
    ],
  },
  barb2_contact: {
    title: "Visit Us or Book Ahead",
    desc: "We're open 6 days a week. Walk-ins are welcome, but we recommend booking to avoid waiting.",
    email: "book@gentlemansbarber.com",
    phone: whatsappNumber,
    location: "5 Admiralty Way, Lekki Phase 1, Lagos",
    hours: "Mon - Sat: 9:00 AM - 9:00 PM",
    primaryButton: "Book on WhatsApp",
    primaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      "Hi, I'd like to book an appointment.",
    ),
  },
  footer: {
    brand: selectedTitle,
    copyright: "© 2024 The Gentleman's Barber. All rights reserved.",
    socials: [
      {
        label: "Instagram",
        linkConfig: { type: "url", url: "https://instagram.com" },
      },
      {
        label: "Facebook",
        linkConfig: { type: "url", url: "https://facebook.com" },
      },
      {
        label: "Twitter",
        linkConfig: { type: "url", url: "https://twitter.com" },
      },
    ],
  },
});

const barber2: TemplateContent = {
  meta: {
    title: "Gentleman's Barbershop",
    image: "/ti/barber2.png",
    category: "beauty",
    description:
      "An upscale, classic template for premium barbershops — featuring an about section, service list, gallery, testimonials, and contact.",
  },
  config: {
    type: "barber2",
    theme: "slate",
    hasCustomizeSidebar: true,
    isPremium: false,
  },
  contentConfig: barber2Config,
  starterContent,
};

export default barber2;
