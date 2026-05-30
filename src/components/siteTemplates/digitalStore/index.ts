// src/components/siteTemplates/digitalStore/index.ts

import { makeWhatsappLink, makeCtaLink } from "@/components/shared/helpers";
import { SchemaParams } from "@/components/templateBuilder/types";
import { TemplateContent } from "@/lib/templates";

export const digitalStoreConfig = {
  navbar: "classic",
  hero: "split",
  footer: "classic",
  sections: [
    {
      id: "tx_",
      type: "text",
      variant: "minimal",
      enabled: true,
    },
    {
      id: "i_",
      type: "items",
      variant: "grid",
      enabled: true,
    },
    {
      id: "ft_",
      type: "features",
      variant: "default",
      enabled: true,
    },
    {
      id: "ts_",
      type: "testimonials",
      variant: "list",
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
      variant: "minimal",
      enabled: true,
    },
  ],
};

const starterContent = ({
  selectedTitle = "Digital Store",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: digitalStoreConfig,

  navbar: {
    logo: "🛍️",
    title: selectedTitle,
    ctaButton: "Browse Products",
    ctaButtonLink: makeCtaLink({ type: "anchor", anchorId: "products" }),
    links: [
      { label: "Products", type: "anchor", anchor: "products", href: "" },
      { label: "Why Us", type: "anchor", anchor: "why-us", href: "" },
      { label: "FAQ", type: "anchor", anchor: "faq", href: "" },
      { label: "Contact", type: "anchor", anchor: "contact", href: "" },
    ],
  },

  hero: {
    type: "split",
    badge: "✨ Instant Digital Delivery",
    image1:
      "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
    image1PId: "",
    title: selectedTitle,
    desc: "Premium digital products delivered instantly to your WhatsApp or email the moment payment is confirmed.",
    primaryButton: "Shop Now",
    primaryButtonLink: makeCtaLink({ type: "anchor", anchorId: "products" }),
    secondaryButton: "Chat with Us",
    secondaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      `Hi! I'd like to know more about your digital products.`,
    ),
  },

  t_text: {
    label: "What We Offer",
    title: "High-Quality Digital Products, Delivered Instantly",
    desc: "No waiting, no shipping, no logistics. Pay, and receive your file immediately via WhatsApp or email. All products are created by experts and ready to use.",
  },

  i_items: {
    heading: "Our Products",
    subheading: "Click any product to purchase directly on WhatsApp.",
    items: [
      {
        title: "Starter Business Pack",
        desc: "Everything a new business needs — logo templates, social media graphics, and a brand guide. Ready to customize.",
        price: "₦3,500",
        tags: ["Templates", "Branding", "Best Seller"],
        image:
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        btnLabel: "Buy Now — ₦3,500",
        projectBtnLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I'd like to buy the Starter Business Pack for ₦3,500. Please send payment details.`,
        ),
      },
      {
        title: "Content Calendar Template",
        desc: "A 90-day social media content calendar built in Google Sheets. Pre-filled with post ideas, hashtags, and scheduling tips.",
        price: "₦2,000",
        tags: ["Social Media", "Templates"],
        image:
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        btnLabel: "Buy Now — ₦2,000",
        projectBtnLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I'd like to buy the Content Calendar Template for ₦2,000. Please send payment details.`,
        ),
      },
      {
        title: "Business Plan PDF Guide",
        desc: "A step-by-step workbook for writing a bankable business plan. Includes real examples for Nigerian businesses.",
        price: "₦5,000",
        tags: ["Business", "PDF Guide"],
        image:
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        btnLabel: "Buy Now — ₦5,000",
        projectBtnLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I'd like to buy the Business Plan PDF Guide for ₦5,000. Please send payment details.`,
        ),
      },
    ],
  },

  ft_features: {
    heading: "Why Buy From Us?",
    subheading: "We make it easy, fast, and risk-free.",
    items: [
      {
        icon: "⚡",
        title: "Instant Delivery",
        desc: "Receive your file immediately after payment is confirmed on WhatsApp.",
      },
      {
        icon: "🔒",
        title: "Secure Payment",
        desc: "Pay safely via Paystack — cards, bank transfer, or USSD all accepted.",
      },
      {
        icon: "💬",
        title: "WhatsApp Support",
        desc: "Got a question about a product? Chat with us and get a reply in minutes.",
      },
      {
        icon: "♾️",
        title: "Lifetime Access",
        desc: "Once purchased, the file is yours forever. Download it as many times as you need.",
      },
    ],
  },

  ts_testimonials: {
    heading: "Customer Reviews",
    subheading: "Real people, real results.",
    items: [
      {
        quote:
          "I downloaded the business pack and set up my brand identity in one afternoon. Absolutely worth it!",
        name: "Adaeze Nwosu",
        role: "Small Business Owner, Enugu",
      },
      {
        quote:
          "The content calendar changed my Instagram game. I finally have a posting schedule that actually works.",
        name: "Babatunde Ojo",
        role: "Content Creator, Lagos",
      },
    ],
  },

  fq_faq: {
    heading: "FAQ",
    subheading: "Common questions answered.",
    items: [
      {
        question: "How do I receive my file?",
        answer:
          "After we confirm your payment, the file is sent directly to your WhatsApp number or email — usually within 5 minutes.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept bank transfer, Paystack card payments, and USSD. We'll send you the details on WhatsApp.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "Because these are digital products delivered instantly, we do not offer refunds. If you have an issue, contact us and we'll resolve it.",
      },
      {
        question: "Are these products editable?",
        answer:
          "Yes! Most products come in editable formats like Google Docs, Sheets, or Canva so you can customize them for your business.",
      },
    ],
  },

  c_contact: {
    title: "Need Help Choosing?",
    desc: "Chat with us on WhatsApp and we'll recommend the best product for your needs.",
    email: "hello@example.com",
    phone: whatsappNumber,
    location: "Lagos, Nigeria",
    primaryButton: "Chat on WhatsApp",
    primaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      `Hi! I need help choosing a digital product. Can you assist me?`,
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

const digitalStore: TemplateContent = {
  meta: {
    title: "Digital Store",
    image: "/ti/digital-store.png",
    category: "digital",
    description:
      "A sleek digital product store with instant WhatsApp delivery. Perfect for selling eBooks, templates, guides, and downloadable files.",
  },
  config: {
    type: "digital-store",
    theme: "dark",
    canCustomize: false,
    isPremium: false,
  },
  contentConfig: digitalStoreConfig,
  starterContent,
};

export default digitalStore;
