import { makeWhatsappLink } from "@/components/shared/helpers";
import { SchemaParams } from "@/components/templateBuilder/types";
import { TemplateContent } from "@/lib/templates";

export const restaurantConfig = {
  navbar: "classic",
  hero: "background",
  footer: "classic",
  sections: [
    {
      id: "res_about",
      type: "about",
      variant: "split",
      enabled: true,
      anchorName: "about",
    },
    {
      id: "res_menu",
      type: "menu",
      variant: "grid",
      enabled: true,
      anchorName: "menu",
    },
    {
      id: "res_testimonials",
      type: "testimonials",
      variant: "carousel",
      enabled: true,
      anchorName: "reviews",
    },
    {
      id: "res_contact",
      type: "contact",
      variant: "form",
      enabled: true,
      anchorName: "contact",
    },
  ],
};

const starterContent = ({
  selectedTitle = "The Gourmet Kitchen",
  whatsappNumber,
}: SchemaParams) => ({
  builderConfig: restaurantConfig,
  navbar: {
    logo: "🍴",
    title: selectedTitle,
    ctaButton: "Order Now",
    ctaButtonLink: makeWhatsappLink(whatsappNumber, "Hi, I'd like to place an order."),
    links: [
      { label: "About", type: "anchor", anchor: "about", href: "" },
      { label: "Menu", type: "anchor", anchor: "menu", href: "" },
      { label: "Reviews", type: "anchor", anchor: "reviews", href: "" },
      { label: "Contact", type: "anchor", anchor: "contact", href: "" },
    ],
  },
  hero: {
    badge: "Best in Town 🏆",
    title: "Delicious Food Delivered to Your Doorstep",
    desc: "Experience the finest flavors and freshest ingredients with our curated menu. Order now and enjoy a meal like never before.",
    primaryButton: "View Menu",
    primaryButtonLink: { type: "anchor", anchorId: "menu" },
    secondaryButton: "Chat with Us",
    secondaryButtonLink: makeWhatsappLink(whatsappNumber),
    image1: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000",
  },
  res_about: {
    label: "Our Story",
    title: "Cooking with Passion Since 2010",
    desc: "We started with a simple goal: to provide healthy, delicious, and affordable meals for everyone. Today, we are proud to be one of the top-rated restaurants in the city.",
    stat1Value: "15k+",
    stat1Label: "Happy Customers",
    stat2Value: "50+",
    stat2Label: "Dishes",
    stat3Value: "12+",
    stat3Label: "Locations",
    stat4Value: "4.9",
    stat4Label: "Rating",
  },
  res_menu: {
    heading: "Our Special Menu",
    subheading: "Carefully selected dishes for every palate.",
    items: [
      {
        title: "Grilled Salmon",
        desc: "Fresh Atlantic salmon served with lemon butter sauce and asparagus.",
        price: "₦7,500",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        btnLabel: "Order on WhatsApp",
      },
      {
        title: "Classic Beef Burger",
        desc: "Hand-crafted beef patty with cheddar cheese, lettuce, and our secret sauce.",
        price: "₦4,500",
        image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=815&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        btnLabel: "Order on WhatsApp",
      },
      {
        title: "Signature Pasta",
        desc: "Creamy alfredo pasta with grilled chicken and mushrooms.",
        price: "₦5,000",
        image: "https://images.unsplash.com/photo-1713561058969-793049b01712?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        btnLabel: "Order on WhatsApp",
      },
    ],
  },
  res_testimonials: {
    heading: "What Our Guests Say",
    subheading: "Read the genuine experiences of our happy diners.",
    items: [
      {
        quote: "The best steak I've had in years! The atmosphere and service were also top-notch.",
        name: "John D.",
        role: "Food Blogger",
      },
      {
        quote: "Quick delivery and the food was still hot when it arrived. 10/10 would recommend.",
        name: "Sarah L.",
        role: "Regular Customer",
      },
    ],
  },
  res_contact: {
    title: "Visit or Order Online",
    desc: "Have a question or want to book a table? Get in touch with us today.",
    email: "orders@gourmetkitchen.com",
    phone: whatsappNumber,
    location: "123 Foodie Avenue, Victoria Island, Lagos",
    hours: "Mon - Sun: 9:00 AM - 11:00 PM",
    primaryButton: "Chat on WhatsApp",
    primaryButtonLink: makeWhatsappLink(whatsappNumber),
  },
  footer: {
    brand: selectedTitle,
    copyright: "© 2024 Gourmet Kitchen. All rights reserved.",
    socials: [
      { label: "Instagram", linkConfig: { type: "url", url: "https://instagram.com" } },
      { label: "Facebook", linkConfig: { type: "url", url: "https://facebook.com" } },
    ],
  },
});

const restaurant: TemplateContent = {
  meta: {
    title: "Restaurant / Food Vendor",
    image: "/ti/restaurant.png",
    category: "food",
    description: "A professional menu-focused template for restaurants and food vendors with WhatsApp ordering.",
  },
  config: {
    type: "restaurant",
    theme: "warm",
    hasCustomizeSidebar: true,
    isPremium: false,
  },
  contentConfig: restaurantConfig,
  starterContent,
};

export default restaurant;
