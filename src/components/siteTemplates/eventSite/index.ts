// src/components/siteTemplates/eventSite/index.ts

import { makeWhatsappLink, makeCtaLink } from "@/components/shared/helpers";
import { SchemaParams } from "@/components/templateBuilder/types";
import { TemplateContent } from "@/lib/templates";

export const eventSiteConfig = {
  navbar: "classic",
  hero: "background",
  footer: "classic",
  sections: [
    {
      id: "tx_",
      type: "text",
      variant: "minimal",
      enabled: true,
    },
    {
      id: "ft_",
      type: "features",
      variant: "icons",
      enabled: true,
    },
    {
      id: "pr_",
      type: "pricing",
      variant: "highlight-top",
      enabled: true,
    },
    {
      id: "ts_",
      type: "testimonials",
      variant: "grid",
      enabled: true,
    },
    {
      id: "fq_",
      type: "faq",
      variant: "accordion",
      enabled: true,
    },
    {
      id: "c_",
      type: "contact",
      variant: "split",
      enabled: true,
    },
  ],
};

const starterContent = ({
  selectedTitle = "Event",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: eventSiteConfig,

  navbar: {
    logo: "🎫",
    title: selectedTitle,
    ctaButton: "Get Tickets",
    ctaButtonLink: makeWhatsappLink(
      whatsappNumber,
      `Hi! I'd like to get tickets for ${selectedTitle}.`,
    ),
    links: [
      { label: "About", type: "anchor", anchor: "about", href: "" },
      { label: "Tickets", type: "anchor", anchor: "tickets", href: "" },
      { label: "FAQ", type: "anchor", anchor: "faq", href: "" },
      { label: "Contact", type: "anchor", anchor: "contact", href: "" },
    ],
  },

  hero: {
    type: "background",
    badge: "📅 Limited Seats Available",
    image1:
      "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
    image1PId: "",
    title: selectedTitle,
    desc: "Join us for an unforgettable experience. Book your seat now before they run out.",
    primaryButton: "Get Tickets Now",
    primaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      `Hi! I'd like to get tickets for ${selectedTitle}. Please send me the details.`,
    ),
    secondaryButton: "View Details",
    secondaryButtonLink: makeCtaLink({ type: "anchor", anchorId: "about" }),
  },

  t_text: {
    label: "About The Event",
    title: `Why You Can't Miss ${selectedTitle}`,
    desc: "This is a once-in-a-season experience designed to inspire, connect, and entertain. Whether you're coming for networking, fun, or learning — there's something here for you.",
  },

  ft_features: {
    heading: "What to Expect",
    subheading: "Everything has been planned to give you the best experience.",
    items: [
      {
        icon: "🎤",
        title: "Live Performances",
        desc: "World-class acts and speakers lined up for the day.",
      },
      {
        icon: "🍽️",
        title: "Food & Drinks",
        desc: "Curated vendors serving the best local and continental cuisine.",
      },
      {
        icon: "🤝",
        title: "Networking",
        desc: "Meet industry leaders, creatives, and fellow attendees.",
      },
      {
        icon: "📸",
        title: "Photo Moments",
        desc: "Dedicated photo booths and Instagrammable setups throughout.",
      },
    ],
  },

  pr_pricing: {
    heading: "Ticket Options",
    subheading: "Choose the experience that fits you.",
    plans: [
      {
        name: "Standard",
        price: "₦5,000",
        period: "",
        desc: "General admission. Entry + access to all main sessions.",
        features: ["Event entry", "Welcome pack", "Access to all sessions"],
        ctaLabel: "Buy Standard",
        ctaLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I'd like to buy a Standard ticket for ${selectedTitle}.`,
        ),
        highlighted: false,
      },
      {
        name: "VIP",
        price: "₦15,000",
        period: "",
        desc: "Premium experience with exclusive perks and front-row access.",
        features: [
          "VIP entry & lounge",
          "Welcome gift bag",
          "Front row seating",
          "Meet & greet access",
          "Priority check-in",
        ],
        ctaLabel: "Buy VIP",
        ctaLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I'd like to buy a VIP ticket for ${selectedTitle}.`,
        ),
        highlighted: true,
      },
      {
        name: "Group (5+)",
        price: "₦20,000",
        period: "",
        desc: "Bring your crew. Best value for groups of 5 or more.",
        features: [
          "5 standard tickets",
          "Group discount",
          "Reserved group seating",
        ],
        ctaLabel: "Book Group",
        ctaLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I'd like to book group tickets for ${selectedTitle}.`,
        ),
        highlighted: false,
      },
    ],
  },

  ts_testimonials: {
    heading: "Past Attendees Say",
    subheading: "Don't take our word for it.",
    items: [
      {
        quote:
          "Honestly one of the best events I've attended in Lagos this year. Worth every kobo.",
        name: "Kemi Adeyemi",
        role: "Entrepreneur, Lagos",
      },
      {
        quote:
          "The VIP experience was incredible. Food, vibes, connections — everything was top tier.",
        name: "Chukwuemeka Obi",
        role: "Content Creator, Abuja",
      },
    ],
  },

  fq_faq: {
    heading: "Frequently Asked Questions",
    subheading: "Everything you need to know before attending.",
    items: [
      {
        question: "How do I get my ticket?",
        answer:
          "After payment is confirmed on WhatsApp, your e-ticket (PDF/QR code) will be sent directly to you.",
      },
      {
        question: "Is the venue accessible?",
        answer:
          "Yes. The venue is fully accessible and parking is available on-site.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "Tickets are non-refundable but are transferable. Contact us on WhatsApp to arrange a transfer.",
      },
      {
        question: "What should I wear?",
        answer:
          "Smart casual. Check our WhatsApp broadcast for the full dress code guideline.",
      },
    ],
  },

  c_contact: {
    title: "Still Have Questions?",
    desc: "Reach us on WhatsApp for the fastest response. We reply within minutes.",
    email: "events@example.com",
    phone: whatsappNumber,
    location: "Lagos, Nigeria",
    primaryButton: "Chat on WhatsApp",
    primaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      `Hi! I have a question about ${selectedTitle}.`,
    ),
    secondaryButton: "",
    secondaryButtonLink: {},
  },

  footer: {
    brand: selectedTitle,
    copyright: `© ${new Date().getFullYear()} ${selectedTitle}. All rights reserved.`,
    socials: [
      { label: "Instagram", linkConfig: { type: "url", url: "" } },
      { label: "Twitter", linkConfig: { type: "url", url: "" } },
    ],
  },
});

const eventSite: TemplateContent = {
  meta: {
    title: "Event Site",
    image: "/ti/event-site.png",
    category: "events",
    description:
      "A high-converting event landing page with ticket tiers, countdown, FAQ and WhatsApp ticket delivery. Perfect for concerts, conferences, and meetups.",
  },
  config: {
    type: "event-site",
    theme: "midnight",
    canCustomize: false,
    isPremium: false,
  },
  contentConfig: eventSiteConfig,
  starterContent,
};

export default eventSite;
