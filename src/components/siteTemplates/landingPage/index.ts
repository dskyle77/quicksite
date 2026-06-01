// src/components/siteTemplates/landingPage/index.ts

import { makeWhatsappLink, makeCtaLink } from "@/components/shared/helpers";
import { SchemaParams } from "@/components/templateBuilder/types";
import { TemplateContent } from "@/lib/templates";

export const landingPageConfig = {
  navbar: "classic",
  hero: "gradient",
  footer: "columns",
  sections: [
    {
      id: "ft_",
      type: "features",
      variant: "default",
      enabled: true,
      anchorName: "features",
    },
    {
      id: "tx_",
      type: "text",
      variant: "minimal",
      enabled: true,
      anchorName: "about",
    },
    {
      id: "pr_",
      type: "pricing",
      variant: "highlight-top",
      enabled: true,
      anchorName: "pricing",
    },
    {
      id: "ts_",
      type: "testimonials",
      variant: "carousel",
      enabled: true,
      anchorName: "testimonials",
    },
    {
      id: "fq_",
      type: "faq",
      variant: "accordion",
      enabled: true,
      anchorName: "faq",
    },
    {
      id: "ct_",
      type: "cta",
      variant: "banner",
      enabled: true,
      anchorName: "cta",
    },
    {
      id: "c_",
      type: "contact",
      variant: "split",
      enabled: true,
      anchorName: "contact",
    },
  ],
};

const starterContent = ({
  selectedTitle = "My Product",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: landingPageConfig,

  navbar: {
    logo: "🚀",
    title: selectedTitle,
    ctaButton: "Get Started",
    ctaButtonLink: makeCtaLink({ type: "anchor", anchorId: "pricing" }),
    links: [
      { label: "Features", type: "anchor", anchor: "features", href: "" },
      { label: "Pricing", type: "anchor", anchor: "pricing", href: "" },
      { label: "FAQ", type: "anchor", anchor: "faq", href: "" },
      { label: "Contact", type: "anchor", anchor: "contact", href: "" },
    ],
  },

  hero: {
    badge: "🎉 Now Available",
    image1:
      "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
    image1PId: "",
    title: `The Smarter Way to Grow Your Business`,
    desc: `${selectedTitle} helps you work faster, sell more, and reach customers directly on WhatsApp — all from one place.`,
    primaryButton: "Start for Free",
    primaryButtonLink: makeCtaLink({ type: "anchor", anchorId: "pricing" }),
    secondaryButton: "See How It Works",
    secondaryButtonLink: makeCtaLink({ type: "anchor", anchorId: "features" }),
  },

  ft_features: {
    heading: "Everything You Need to Succeed",
    subheading:
      "Built for Nigerian entrepreneurs who want results, not complexity.",
    items: [
      {
        icon: "⚡",
        title: "Lightning Fast Setup",
        desc: "Go live in under 5 minutes. No coding, no developer, no stress — just your business online.",
      },
      {
        icon: "📱",
        title: "WhatsApp-First",
        desc: "Every button connects directly to your WhatsApp. Customers reach you instantly, sales happen faster.",
      },
      {
        icon: "🎨",
        title: "Beautiful by Default",
        desc: "Professional-looking pages that work on every device — phones, tablets, and desktop.",
      },
      {
        icon: "🔒",
        title: "Secure & Reliable",
        desc: "Your site stays online 24/7 with enterprise-grade infrastructure you don't have to manage.",
      },
      {
        icon: "📊",
        title: "Built-in Analytics",
        desc: "See how many people visit your site, click your buttons, and message you on WhatsApp.",
      },
      {
        icon: "🛠️",
        title: "Fully Customizable",
        desc: "Change colours, fonts, images, and text in real time — no refresh, no complicated tools.",
      },
    ],
  },

  tx_text: {
    label: "Why It Works",
    title: "Your Customers Are Already on WhatsApp. Meet Them There.",
    desc: "Over 90% of Nigerians actively use WhatsApp every day. Instead of fighting for attention on social media, put your business directly in their hands with a professional site that funnels every visitor straight to your inbox.",
  },

  pr_pricing: {
    heading: "Simple, Honest Pricing",
    subheading: "No hidden fees. No surprises. Just great value.",
    plans: [
      {
        name: "Starter",
        price: "₦3,500",
        period: "/month",
        desc: "Perfect for freelancers and solo entrepreneurs just getting started.",
        features: [
          "1 professional site",
          "WhatsApp integration",
          "Custom domain support",
          "Mobile optimized",
          "Basic analytics",
        ],
        ctaLabel: "Get Started",
        ctaLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I'd like to get the Starter plan for ${selectedTitle}.`,
        ),
        highlighted: false,
      },
      {
        name: "Growth",
        price: "₦7,500",
        period: "/month",
        desc: "For growing businesses that need more power and flexibility.",
        features: [
          "3 professional sites",
          "WhatsApp + Instagram links",
          "Custom domain",
          "Advanced analytics",
          "Priority support",
          "Remove branding",
        ],
        ctaLabel: "Start Growing",
        ctaLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I'd like to get the Growth plan for ${selectedTitle}.`,
        ),
        highlighted: true,
      },
      {
        name: "Business",
        price: "₦15,000",
        period: "/month",
        desc: "For established businesses that need maximum reach and control.",
        features: [
          "Unlimited sites",
          "All integrations",
          "Multiple team members",
          "White-label option",
          "Dedicated support",
          "Custom features",
        ],
        ctaLabel: "Go Business",
        ctaLink: makeWhatsappLink(
          whatsappNumber,
          `Hi! I'd like to get the Business plan for ${selectedTitle}.`,
        ),
        highlighted: false,
      },
    ],
  },

  ts_testimonials: {
    heading: "Loved by Nigerian Entrepreneurs",
    subheading: "Real businesses. Real results.",
    items: [
      {
        quote:
          "I got my first 3 orders within 24 hours of launching my site. The WhatsApp button changed everything for my food business.",
        name: "Chiamaka Obi",
        role: "Food Vendor, Enugu",
      },
      {
        quote:
          "Before this, I was just posting on Instagram and hoping people would DM me. Now I have a proper site and my orders doubled.",
        name: "Tunde Adeyemi",
        role: "Fashion Designer, Lagos",
      },
      {
        quote:
          "My clients tell me they trust me more because I have a website. Setup was so easy — literally 10 minutes.",
        name: "Ngozi Williams",
        role: "Hair Stylist, Abuja",
      },
    ],
  },

  fq_faq: {
    heading: "Frequently Asked Questions",
    subheading: "Everything you want to know before signing up.",
    items: [
      {
        question: "Do I need any technical skills to use this?",
        answer:
          "No. Everything is drag-and-drop and click-to-edit. If you can type a message on WhatsApp, you can build a site with us.",
      },
      {
        question: "Can I use my own domain name?",
        answer:
          "Yes! All plans support custom domains. You can connect a domain you already own or purchase a new one through us.",
      },
      {
        question: "How does the WhatsApp integration work?",
        answer:
          "Every button on your site can be linked to your WhatsApp number with a pre-filled message. When a customer clicks it, WhatsApp opens automatically with your number and the message ready to send.",
      },
      {
        question: "What happens if I want to cancel?",
        answer:
          "You can cancel any time with no penalty. Your site will remain active until the end of your billing period.",
      },
      {
        question: "Can I switch plans later?",
        answer:
          "Absolutely. You can upgrade or downgrade your plan at any time from your dashboard.",
      },
    ],
  },

  ct_cta: {
    heading: "Ready to Take Your Business Online?",
    subheading:
      "Join thousands of Nigerian entrepreneurs already growing with us.",
    primaryButton: "Start for Free Today",
    primaryButtonLink: makeCtaLink({ type: "anchor", anchorId: "pricing" }),
    secondaryButton: "Chat with Us First",
    secondaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      `Hi! I want to learn more about ${selectedTitle} before signing up.`,
    ),
  },

  c_contact: {
    title: "Still Have Questions?",
    desc: "Our team is available on WhatsApp from 8am – 10pm daily. We typically reply within minutes.",
    email: "hello@example.com",
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
      { label: "Facebook", linkConfig: { type: "url", url: "" } },
    ],
  },
});

const landingPage: TemplateContent = {
  meta: {
    title: "Landing Page",
    image: "/ti/landing-page.png",
    category: "business",
    description:
      "A high-converting product or service landing page with features, pricing tiers, testimonials, FAQ, and a bold CTA. Perfect for SaaS, digital services, or any Nigerian business going online.",
  },
  config: {
    type: "landing-page",
    theme: "light",
    canCustomize: false,
    isPremium: false,
  },
  contentConfig: landingPageConfig,
  starterContent,
};

export default landingPage;
