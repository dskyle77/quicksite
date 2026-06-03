import { makeWhatsappLink } from "@/components/shared/helpers";
import { SchemaParams } from "@/components/templateBuilder/types";
import { TemplateContent } from "@/lib/templates";

export const storeConfig = {
  navbar: "classic",
  hero: "split",
  footer: "classic",
  sections: [
    {
      id: "shop-products",
      type: "items",
      variant: "grid-small",
      enabled: true,
      anchorName: "shop",
    },
    {
      id: "shop-features",
      type: "features",
      variant: "icons",
      enabled: true,
      anchorName: "why-us",
    },
    {
      id: "shop-contact",
      type: "contact",
      variant: "minimal",
      enabled: true,
      anchorName: "support",
    },
  ],
};

const starterContent = ({
  selectedTitle = "Swift Store",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: storeConfig,
  navbar: {
    logo: "🛍️",
    title: selectedTitle,
    ctaButton: "View Shop",
    ctaButtonLink: { type: "anchor", anchorId: "shop" },
    links: [
      { label: "Shop", type: "anchor", anchor: "shop", href: "" },
      { label: "Why Us", type: "anchor", anchor: "why-us", href: "" },
      { label: "Support", type: "anchor", anchor: "support", href: "" },
    ],
  },
  hero: {
    badge: "New Arrivals 🔥",
    title: "Quality Products, Delivered Swiftly",
    desc: "Shop the latest trends and essential products at unbeatable prices. Easy ordering on WhatsApp and fast delivery guaranteed.",
    primaryButton: "Start Shopping",
    primaryButtonLink: { type: "anchor", anchorId: "shop" },
    secondaryButton: "Track Order",
    secondaryButtonLink: makeWhatsappLink(whatsappNumber, "Hi, I'd like to track my order."),
    image1: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=1000",
  },
  "shop-products": {
    heading: "Our Product Catalogue",
    subheading: "Browse our latest collection and order directly on WhatsApp.",
    items: [
      { title: "Wireless Headphones", desc: "High-quality sound with noise cancellation.", price: "₦25,000", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500", btnLabel: "Order on WhatsApp" },
      { title: "Smart Watch", desc: "Track your fitness and stay connected.", price: "₦18,500", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=500", btnLabel: "Order on WhatsApp" },
      { title: "Portable Charger", desc: "Fast charging power bank for all devices.", price: "₦12,000", image: "https://images.unsplash.com/photo-1609592424086-4447376378c8?auto=format&fit=crop&q=80&w=500", btnLabel: "Order on WhatsApp" },
    ],
  },
  "shop-features": {
    heading: "Why Shop With Us?",
    items: [
      { title: "Fast Delivery", desc: "We ship within 24 hours of your order." },
      { title: "Quality Guaranteed", desc: "Only original and tested products." },
      { title: "24/7 Support", desc: "Chat with us anytime on WhatsApp." },
    ],
  },
  "shop-contact": {
    title: "Need Help?",
    desc: "Have a question about a product or your order? We're here to help.",
    email: "support@swiftstore.com",
    phone: whatsappNumber,
    location: "Online Store - Nationwide Delivery",
    primaryButton: "Chat with Support",
    primaryButtonLink: makeWhatsappLink(whatsappNumber),
  },
  footer: {
    brand: selectedTitle,
    copyright: "© 2024 Swift Store. All rights reserved.",
  },
});

const store: TemplateContent = {
  meta: {
    title: "Simple Store",
    image: "/ti/store.png",
    category: "store",
    description: "A streamlined store template for selling products via WhatsApp.",
  },
  config: {
    type: "simple-store",
    theme: "mono",
    hasCustomizeSidebar: true,
    isPremium: false,
  },
  contentConfig: storeConfig,
  starterContent,
};

export default store;
