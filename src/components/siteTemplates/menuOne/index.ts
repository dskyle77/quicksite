import { LinkConfig } from "@/components/shared/EditableLink";
import { makeWhatsappLink, makeCtaLink } from "@/components/shared/helpers";
import { SchemaParams } from "@/components/templateBuilder/types";
import { TemplateContent } from "@/lib/templates";

export const menuOneConfig = {
  navbar: "none",
  hero: "background",
  footer: "none",
  sections: [
    {
      id: "text",
      type: "text",
      variant: "card",
      enabled: true,
    },
    {
      id: "items",
      type: "items",
      variant: "grid",
      enabled: true,
    },
    {
      id: "testimonials",
      type: "testimonials",
      variant: "list",
      enabled: true,
    },
    {
      id: "contact",
      type: "contact",
      variant: "minimal",
      enabled: true,
    },
  ],
};

const starterContent = ({
  selectedTitle = "Menu",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: menuOneConfig,
  hero: {
    type: "minimalist",
    badge: "Fresh meals daily 🍽️",
    image1:
      "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
    image1PId: "",
    title: selectedTitle,
    desc: "Fresh meals, quick delivery, and easy ordering on WhatsApp.",
    primaryButton: "Order on WhatsApp",
    primaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      "Hi, I'd like to place an order.",
    ),
    secondaryButton: "View Menu",
    secondaryButtonLink: makeCtaLink({
      type: "anchor",
      anchorId: "menu",
    }) as LinkConfig,
  },

  text: {
    label: "About Us",
    title: `Why People Love ${selectedTitle}`,
    desc: "We prepare tasty meals using fresh ingredients and deliver quickly so you can enjoy every bite without stress.",
  },

  items: {
    heading: "Our Menu",
    subheading: "Fresh meals made daily. Order instantly on WhatsApp.",
    items: [
      {
        title: "Chicken Shawarma",
        desc: "Juicy chicken wrapped with fresh veggies and creamy sauce.",
        price: "₦4,500",
        tags: ["Best Seller", "Spicy"],
        image:
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        btnLabel: "Order Now",
        menuBtnLink: makeWhatsappLink(
          whatsappNumber,
          "Hi, I'd like to order Chicken Shawarma.",
        ),
      },
      {
        title: "Jollof Rice Combo",
        desc: "Smoky Nigerian jollof rice served with grilled chicken.",
        price: "₦3,000",
        tags: ["Popular"],
        image:
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        btnLabel: "Order Now",
        menuBtnLink: makeWhatsappLink(
          whatsappNumber,
          "Hi, I'd like to order Jollof Rice Combo.",
        ),
      },
      {
        title: "Burger & Fries",
        desc: "Juicy beef burger served with crispy fries.",
        price: "₦5,500",
        tags: ["Hot Deal"],
        image:
          "https://res.cloudinary.com/dbfkzc5an/image/upload/v1777996367/default-image_blgwid.jpg",
        imagePId: "",
        btnLabel: "Order Now",
        menuBtnLink: makeWhatsappLink(
          whatsappNumber,
          "Hi, I'd like to order Burger & Fries.",
        ),
      },
    ],
  },

  testimonials: {
    heading: "Customer Reviews",
    subheading: "People love our meals ❤️",
    items: [
      {
        quote:
          "The food was fresh, spicy, and delivered fast. Definitely ordering again.",
        name: "Amanda T.",
        role: "Customer",
      },
      {
        quote: "Best shawarma I've had in a while. Packaging was neat too.",
        name: "Michael O.",
        role: "Customer",
      },
    ],
  },

  contact: {
    title: "Place Your Order",
    email: "hello@example.com",
    phone: whatsappNumber,
    location: "Lagos, Nigeria",
    desc: "Send us a message on WhatsApp to order quickly and easily.",
    primaryButton: "Order on WhatsApp",
    primaryButtonLink: makeWhatsappLink(
      whatsappNumber,
      "Hi, I'd like to place an order.",
    ),
    secondaryButton: "Call Us",
    secondaryButtonLink: {},
  },
});

const menu1: TemplateContent = {
  meta: {
    title: "Menu",
    image: "/ti/menu-one.png",
    category: "food",
    description:
      "A modern, minimalist menu-focused site template ideal for restaurants, cafes, or portfolios needing a clean showcase.",
  },
  config: {
    type: "menu-one",
    theme: "warm",
    canCustomize: false,
    isPremium: false,
  },
  contentConfig: menuOneConfig,
  starterContent,
};

export default menu1;
