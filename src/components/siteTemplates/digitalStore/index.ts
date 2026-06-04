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
      id: "dig_text",
      type: "text",
      variant: "card",
      enabled: true,
    },
    {
      id: "dig_items",
      type: "items",
      variant: "grid",
      enabled: true,
    },
    {
      id: "dig_features",
      type: "features",
      variant: "default",
      enabled: true,
    },
    {
      id: "dig_testimonials",
      type: "testimonials",
      variant: "carousel",
      enabled: true,
    },
    {
      id: "dig_contact",
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
    ctaButtonLink: makeCtaLink({ type: "anchor", anchorId: "dig_items" }),
    links: [
      { label: "Products", type: "anchor", anchor: "dig_items", href: "" },
      { label: "Why Us", type: "anchor", anchor: "dig_features", href: "" },
      { label: "Reviews", type: "anchor", anchor: "dig_testimonials", href: "" },
      { label: "Contact", type: "anchor", anchor: "dig_contact", href: "" },
    ],
  },

  hero: {
    type: "split",
    badge: "✨ Instant Digital Delivery",
    // Modern, high-contrast digital device interface showcasing e-commerce success
    image1:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    image1PId: "",
    title: selectedTitle,
    desc: "Premium digital tools, strategies, and resources delivered directly to your WhatsApp or email the exact moment payment is confirmed.",
    primaryButton: "Shop Now",
    primaryButtonLink: makeCtaLink({ type: "anchor", anchorId: "dig_items" }),
    secondaryButton: "Chat with Us",
    secondaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      `Hi! I'd like to know more about your digital products.`,
    ),
  },

  dig_text: {
    label: "What We Offer",
    title: "High-Quality Digital Products, Delivered Instantly",
    desc: "Skip the logistics, shipping delays, and delivery fees. Pay securely and receive your assets instantly. Every asset is premium, battle-tested, and ready to fast-track your progress.",
  },

  dig_items: {
    heading: "Our Products",
    subheading: "Click any asset to purchase directly and securely via WhatsApp.",
    items: [
      {
        title: "Starter Business Pack",
        desc: "Everything a new brand needs to look premium: customizable logo templates, sleek social media grids, and a comprehensive styling guide.",
        price: "₦3,500",
        tags: ["Templates", "Branding", "Best Seller"],
        // Sleek tablet/mockup displaying clean corporate branding and design guidelines
        image:
          "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
        imagePId: "",
        btnLabel: "Buy Now — ₦3,500",
        projectBtnLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I'd like to buy the Starter Business Pack for ₦3,500. Please send payment details.`,
        ),
      },
      {
        title: "Content Calendar Template",
        desc: "A 90-day interactive social media system built in Google Sheets. Pre-filled with high-conversion hooks, local trending hashtags, and visual scheduling dashboards.",
        price: "₦2,000",
        tags: ["Social Media", "Templates"],
        // Vibrant, aesthetic smartphone display showcasing neat content curation elements
        image:
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
        imagePId: "",
        btnLabel: "Buy Now — ₦2,000",
        projectBtnLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I'd like to buy the Content Calendar Template for ₦2,000. Please send payment details.`,
        ),
      },
      {
        title: "Business Plan PDF Guide",
        desc: "A step-by-step master workbook designed for writing bankable corporate plans. Includes real structural financial models adapted for local scale.",
        price: "₦5,000",
        tags: ["Business", "PDF Guide"],
        // Clean desktop office environment featuring data charts and planning analytical workbooks
        image:
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
        imagePId: "",
        btnLabel: "Buy Now — ₦5,000",
        projectBtnLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I'd like to buy the Business Plan PDF Guide for ₦5,000. Please send payment details.`,
        ),
      },
    ],
  },

  dig_features: {
    heading: "Why Buy From Us?",
    subheading: "We make it easy, secure, and instant.",
    items: [
      {
        icon: "⚡",
        title: "Instant Delivery",
        desc: "Automated fulfillment system drops the file right into your active chat instantly.",
      },
      {
        icon: "🔒",
        title: "Secure Checkout",
        desc: "Processed safely through trusted modern gateways like Paystack. Cards, transfers, or USSD.",
      },
      {
        icon: "💬",
        title: "Dedicated Support",
        desc: "Have a configuration question? Message us and a live representative will guide you through.",
      },
      {
        icon: "♾️",
        title: "Lifetime Access",
        desc: "Buy once, own it forever. Download backups as many times as you require at no extra fee.",
      },
    ],
  },

  dig_testimonials: {
    heading: "Customer Reviews",
    subheading: "Real people, real results.",
    items: [
      {
        quote:
          "I downloaded the business pack and completely updated my corporate identity in one afternoon. Absolutely brilliant value!",
        name: "Adaeze Nwosu",
        role: "Small Business Owner, Enugu",
      },
      {
        quote:
          "The content calendar transformed our posting architecture. We went from random posts to a highly strategic workflow.",
        name: "Babatunde Ojo",
        role: "Content Creator, Lagos",
      },
    ],
  },

  dig_contact: {
    title: "Need Help Choosing?",
    desc: "Unsure which digital bundle fits your current growth stage? Drop us a line on WhatsApp and we will map out the ideal toolkit for you.",
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
    category: "store",
    description:
      "A sleek digital product store with instant WhatsApp delivery. Perfect for selling eBooks, templates, guides, and downloadable files.",
  },
  config: {
    type: "digital-store",
    theme: "midnight",
    hasCustomizeSidebar: false,
    isPremium: false,
  },
  contentConfig: digitalStoreConfig,
  starterContent,
};

export default digitalStore;