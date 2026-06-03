// src/components/siteTemplates/landingPage2/index.ts

import { makeWhatsappLink, makeCtaLink } from "@/components/shared/helpers";
import { SchemaParams } from "@/components/templateBuilder/types";
import { TemplateContent } from "@/lib/templates";

export const landingPage2Config = {
  navbar: "minimal",
  hero: "left",
  footer: "centered",
  sections: [
    {
      id: "lp_about",
      type: "about",
      variant: "card-stats",
      enabled: true,
      anchorName: "about",
    },
    {
      id: "lp_features",
      type: "features",
      variant: "icons",
      enabled: true,
      anchorName: "features",
    },
    {
      id: "lp_testimonials",
      type: "testimonials",
      variant: "grid",
      enabled: true,
      anchorName: "testimonials",
    },
    {
      id: "lp_pricing",
      type: "pricing",
      variant: "default",
      enabled: true,
      anchorName: "pricing",
    },
    {
      id: "lp_faq",
      type: "faq",
      variant: "numbered",
      enabled: true,
      anchorName: "faq",
    },
    {
      id: "lp_cta",
      type: "cta",
      variant: "banner",
      enabled: true,
      anchorName: "cta",
    },
    {
      id: "lp_contact",
      type: "contact",
      variant: "minimal",
      enabled: true,
      anchorName: "contact",
    },
  ],
};

const starterContent = ({
  selectedTitle = "My Agency",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: landingPage2Config,

  navbar: {
    logo: "✦",
    title: selectedTitle,
    ctaButton: "Work With Us",
    ctaButtonLink: makeCtaLink({ type: "anchor", anchorId: "contact" }),
    links: [
      { label: "About", type: "anchor", anchor: "about", href: "" },
      { label: "Services", type: "anchor", anchor: "features", href: "" },
      { label: "Pricing", type: "anchor", anchor: "pricing", href: "" },
      { label: "Contact", type: "anchor", anchor: "contact", href: "" },
    ],
  },

  hero: {
    badge: "✦ Trusted by 500+ Businesses",
    image1:
      "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
    image1PId: "",
    title: `We Build Brands That People Remember`,
    desc: `${selectedTitle} is a creative agency helping Nigerian businesses stand out, grow faster, and connect with the right customers — online and offline.`,
    primaryButton: "Start a Project",
    primaryButtonLink: makeCtaLink({ type: "anchor", anchorId: "contact" }),
    secondaryButton: "View Our Work",
    secondaryButtonLink: makeCtaLink({ type: "anchor", anchorId: "features" }),
  },

  lp_about: {
    label: "Who We Are",
    title: "A Team That Gets Results",
    desc: "We are a Nigerian creative agency specialising in branding, web design, and digital marketing. Since 2018, we've helped hundreds of businesses look premium and grow revenue through smart strategy and bold design.",
    image1:
      "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
    stat1Value: "500+",
    stat1Label: "Clients Served",
    stat2Value: "₦2B+",
    stat2Label: "Revenue Generated",
    stat3Value: "7 yrs",
    stat3Label: "In Business",
    stat4Value: "98%",
    stat4Label: "Client Satisfaction",
  },

  lp_features: {
    heading: "Our Services",
    subheading:
      "Everything you need to build a brand people trust and a business that grows.",
    items: [
      {
        icon: "🎨",
        title: "Brand Identity",
        desc: "Logos, brand guidelines, colour palettes, and visual systems that make you instantly recognizable.",
      },
      {
        icon: "🌐",
        title: "Website Design",
        desc: "Fast, beautiful websites built to convert visitors into paying customers.",
      },
      {
        icon: "📱",
        title: "Social Media",
        desc: "Content creation, page management, and paid ads that grow your audience and drive sales.",
      },
      {
        icon: "📸",
        title: "Photography",
        desc: "Professional product and lifestyle photography that makes your brand look world-class.",
      },
      {
        icon: "📣",
        title: "Digital Ads",
        desc: "Meta and Google ad campaigns managed by experts who know the Nigerian market.",
      },
      {
        icon: "✍️",
        title: "Copywriting",
        desc: "Words that sell. Website copy, email sequences, and brand voice that resonates with your audience.",
      },
      {
        icon: "📦",
        title: "Packaging Design",
        desc: "Shelf-ready packaging that turns heads in-store and in unboxing videos.",
      },
      {
        icon: "📊",
        title: "Strategy & Consulting",
        desc: "Brand audits, market research, and growth strategies tailored to your business goals.",
      },
    ],
  },

  lp_testimonials: {
    heading: "What Our Clients Say",
    subheading: "Don't just take our word for it.",
    items: [
      {
        quote:
          "Working with this team transformed our brand completely. We went from looking like a small startup to a premium company within weeks. Sales tripled.",
        name: "Kemi Adeyemi",
        role: "CEO, Kemi Naturals — Lagos",
      },
      {
        quote:
          "Our new website has been getting compliments non-stop. More importantly, our WhatsApp inquiries went up 4x in the first month.",
        name: "Emeka Okafor",
        role: "Founder, Okafor Construction — Abuja",
      },
      {
        quote:
          "I've worked with agencies in the UK and US. Honestly, this team matches their quality at a fraction of the cost.",
        name: "Adaeze Nwachukwu",
        role: "Director, ADA Skincare — Port Harcourt",
      },
      {
        quote:
          "The packaging design they created for us went viral on TikTok. We sold out within 3 days of launching the new look.",
        name: "Bolaji Fashola",
        role: "Owner, Bolu's Kitchen — Ibadan",
      },
    ],
  },

  lp_pricing: {
    heading: "Transparent Pricing",
    subheading: "One-time or monthly — choose what works for your business.",
    plans: [
      {
        name: "Starter",
        price: "₦75,000",
        period: "one-time",
        desc: "Perfect for new businesses that need a professional foundation.",
        features: [
          "Logo design (3 concepts)",
          "Brand colour palette",
          "Business card design",
          "1-page website",
          "Social media profile setup",
          "2 weeks of revisions",
        ],
        ctaLabel: "Get Started",
        ctaLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I'm interested in the Starter branding package for ${selectedTitle}. Please share more details.`,
        ),
        highlighted: false,
      },
      {
        name: "Growth",
        price: "₦250,000",
        period: "one-time",
        desc: "The complete brand launch package for serious businesses.",
        features: [
          "Full brand identity system",
          "5-page website",
          "Product photography (10 shots)",
          "Social media templates (20)",
          "Copywriting for all pages",
          "30 days post-launch support",
        ],
        ctaLabel: "Start Growing",
        ctaLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I'm interested in the Growth branding package for ${selectedTitle}. Please share more details.`,
        ),
        highlighted: true,
      },
      {
        name: "Retainer",
        price: "₦120,000",
        period: "/month",
        desc: "Ongoing creative support for businesses that want to keep growing.",
        features: [
          "Monthly social media content",
          "Weekly graphic designs",
          "Ad campaign management",
          "Monthly strategy call",
          "Priority turnaround",
          "Dedicated account manager",
        ],
        ctaLabel: "Let's Talk",
        ctaLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I'm interested in the monthly retainer for ${selectedTitle}. Please share more details.`,
        ),
        highlighted: false,
      },
    ],
  },

  lp_faq: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "How long does a project take?",
        answer:
          "Most projects are delivered within 7–21 working days depending on scope. We'll give you a clear timeline during our first call before any work begins.",
      },
      {
        question: "Do you work with businesses outside Nigeria?",
        answer:
          "Yes! We work with clients across Africa and in the diaspora. Payments can be made in Naira or USD.",
      },
      {
        question: "What information do I need to provide to get started?",
        answer:
          "Just tell us about your business, your audience, and what you're hoping to achieve. We'll guide you through a short discovery call to gather the rest.",
      },
      {
        question: "Can I make changes after the project is delivered?",
        answer:
          "All our packages include revision rounds (see each plan for details). After that, changes can be made at an hourly rate.",
      },
      {
        question: "Do you offer payment plans?",
        answer:
          "Yes. For projects above ₦150,000, we offer a 50/50 split — 50% to start and 50% on delivery. Reach out on WhatsApp to arrange.",
      },
    ],
  },

  lp_cta: {
    heading: "Ready to Build Something Great?",
    subheading: "Let's talk about your brand, your goals, and how we can help.",
    primaryButton: "Start a Conversation",
    primaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      `Hi! I'd like to discuss a project with ${selectedTitle}. When can we talk?`,
    ),
  },

  lp_contact: {
    title: "Get in Touch",
    desc: "Send us a message on WhatsApp and we'll respond within 2 hours during business hours (Mon–Sat, 8am–8pm).",
    email: "hello@example.com",
    phone: whatsappNumber,
    location: "Lagos, Nigeria",
    primaryButton: "Chat on WhatsApp",
    primaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      `Hi! I found your website and I'd love to discuss a project.`,
    ),
    secondaryButton: "",
    secondaryButtonLink: {},
  },

  footer: {
    brand: selectedTitle,
    copyright: `© ${new Date().getFullYear()} ${selectedTitle}. All rights reserved.`,
  },
});

const landingPage2: TemplateContent = {
  meta: {
    title: "Agency Landing Page",
    image: "/ti/landing-page-2.png",
    category: "business",
    description:
      "A polished agency or service business landing page with stats, service grid, testimonials, pricing, and FAQ. Built for creative studios, consultants, and professional service businesses.",
  },
  config: {
    type: "landing-page-2",
    theme: "dark",
    canCustomize: false,
    isPremium: false,
  },
  contentConfig: landingPage2Config,
  starterContent,
};

export default landingPage2;
