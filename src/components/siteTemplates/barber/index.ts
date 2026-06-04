import { makeWhatsappLink } from "@/components/shared/helpers";
import { SchemaParams } from "@/components/templateBuilder/types";
import { TemplateContent } from "@/lib/templates";

export const barberConfig = {
  navbar: "classic",
  hero: "background",
  footer: "classic",
  sections: [
    {
      id: "barb_features",
      type: "features",
      variant: "icons",
      enabled: true,
      anchorName: "services",
    },
    {
      id: "barb_gallery",
      type: "gallery",
      variant: "masonry",
      enabled: true,
      anchorName: "gallery",
    },
    {
      id: "barb_pricing",
      type: "pricing",
      variant: "default",
      enabled: true,
      anchorName: "pricing",
    },
    {
      id: "barb_testimonials",
      type: "testimonials",
      variant: "carousel",
      enabled: true,
      anchorName: "reviews",
    },
    {
      id: "barb_contact",
      type: "contact",
      variant: "form",
      enabled: true,
      anchorName: "booking",
    },
  ],
};

const starterContent = ({
  selectedTitle = "Sharp Cuts Barbershop",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: barberConfig,
  navbar: {
    logo: "✂️",
    title: selectedTitle,
    ctaButton: "Book a Cut",
    ctaButtonLink: makeWhatsappLink(
      whatsappNumber,
      "Hi, I'd like to book a haircut appointment.",
    ),
    links: [
      { label: "Services", type: "anchor", anchor: "services", href: "" },
      { label: "Gallery", type: "anchor", anchor: "gallery", href: "" },
      { label: "Pricing", type: "anchor", anchor: "pricing", href: "" },
      { label: "Reviews", type: "anchor", anchor: "reviews", href: "" },
    ],
  },
  hero: {
    badge: "Premium Barbershop 💈",
    title: "Look Sharp. Feel Confident.",
    desc: "Expert fades, clean lineups, and precision beard trims — delivered by master barbers who take pride in every cut. Walk in looking good, walk out looking great.",
    primaryButton: "Book an Appointment",
    primaryButtonLink: { type: "anchor", anchorId: "booking" },
    secondaryButton: "See Our Work",
    secondaryButtonLink: { type: "anchor", anchorId: "gallery" },
    image1:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1000",
  },
  barb_features: {
    heading: "Our Services",
    subheading: "Every service delivered with precision and care.",
    items: [
      {
        icon: "✂️",
        title: "Haircut & Fade",
        desc: "Classic cuts, skin fades, taper fades — styled to perfection for every hair type.",
      },
      {
        icon: "🪒",
        title: "Beard Trim & Shape",
        desc: "Clean lines, sharp edges, and expert beard grooming to frame your face.",
      },
      {
        icon: "💈",
        title: "Hot Towel Shave",
        desc: "A luxurious straight-razor shave with hot towel treatment for the smoothest finish.",
      },
      {
        icon: "👦",
        title: "Kids' Haircut",
        desc: "Patient, friendly barbers who make every child's haircut a great experience.",
      },
    ],
  },
  barb_gallery: {
    heading: "Fresh Cuts Gallery",
    subheading: "Real work from our skilled barbers — every cut tells a story.",
    items: [
      {
        image:
          "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=500",
        caption: "Clean Fade",
      },
      {
        image:
          "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=500",
        caption: "Beard Grooming",
      },
      {
        image:
          "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=500",
        caption: "Skin Fade",
      },
      {
        image:
          "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=500",
        caption: "Classic Cut",
      },
    ],
  },
  barb_pricing: {
    heading: "Simple Pricing",
    subheading: "No hidden charges. Just great cuts at fair prices.",
    plans: [
      {
        name: "Classic",
        price: "₦3,500",
        desc: "A clean, precise haircut for any style.",
        features: [
          "Haircut & Style",
          "Hot Towel Finish",
          "Free Consultation",
        ],
        cta: "Book Classic",
      },
      {
        name: "Premium",
        price: "₦7,000",
        desc: "Full grooming experience — hair and beard.",
        features: [
          "Haircut & Fade",
          "Beard Trim & Shape",
          "Hot Towel Shave",
          "Scalp Massage",
          "Priority Booking",
        ],
        featured: true,
        cta: "Book Premium",
      },
    ],
  },
  barb_testimonials: {
    heading: "What Our Clients Say",
    subheading: "Hundreds of satisfied customers keep coming back.",
    items: [
      {
        quote:
          "Best barbershop in the city! My fade is always on point and the atmosphere is great.",
        name: "Tunde A.",
        role: "Regular Client",
      },
      {
        quote:
          "I've been coming here for 2 years. The barbers are skilled and always consistent.",
        name: "Chidi O.",
        role: "Loyal Customer",
      },
      {
        quote:
          "Brought my son for his first haircut and the barber was so patient and professional.",
        name: "Mrs. Bello",
        role: "Parent",
      },
    ],
  },
  barb_contact: {
    title: "Book Your Appointment",
    desc: "Walk-ins welcome, but booking ahead guarantees your slot. Message us on WhatsApp to reserve your time.",
    email: "hello@sharpcuts.com",
    phone: whatsappNumber,
    location: "12 Barracks Road, Surulere, Lagos",
    hours: "Mon - Sat: 8:00 AM - 8:00 PM",
    primaryButton: "Book on WhatsApp",
    primaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      "Hi, I'd like to book a haircut appointment.",
    ),
  },
  footer: {
    brand: selectedTitle,
    copyright: "© 2024 Sharp Cuts Barbershop. All rights reserved.",
    socials: [
      {
        label: "Instagram",
        linkConfig: { type: "url", url: "https://instagram.com" },
      },
      {
        label: "Facebook",
        linkConfig: { type: "url", url: "https://facebook.com" },
      },
    ],
  },
});

const barber: TemplateContent = {
  meta: {
    title: "Barbershop",
    image: "/ti/barber.png",
    category: "beauty",
    description:
      "A bold, modern template for barbershops featuring service menus, cut galleries, pricing, and easy WhatsApp booking.",
  },
  config: {
    type: "barber",
    theme: "dark",
    hasCustomizeSidebar: true,
    isPremium: false,
  },
  contentConfig: barberConfig,
  starterContent,
};

export default barber;
