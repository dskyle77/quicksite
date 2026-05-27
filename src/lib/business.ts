// src/lib/business.ts
// Types and constants for the Quicksite business profile system

export type BusinessCategory =
  | "food"
  | "fashion"
  | "beauty"
  | "tech"
  | "health"
  | "education"
  | "finance"
  | "retail"
  | "services"
  | "creative"
  | "real-estate"
  | "events"
  | "logistics"
  | "agriculture"
  | "other";

export type BusinessProfile = {
  id: string; // same as slug
  uid: string;
  // Core identity
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  category: BusinessCategory;
  tags?: string[];
  // Contact & WhatsApp
  whatsappNumber?: string;
  email?: string;
  website?: string;
  // Location
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  // Media
  logoUrl?: string;
  coverUrl?: string;
  ogImage?: string;
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  // Discovery
  isVerified?: boolean;
  isFeatured?: boolean;
  isPremium?: boolean;
  // Stats
  profileViews?: number;
  whatsappClicks?: number;
  // Status
  status: "active" | "draft" | "suspended";
  // Primary site link
  primarySiteSlug?: string;
  // Timestamps
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type DirectoryFilters = {
  category?: BusinessCategory | "all";
  state?: string;
  search?: string;
  featured?: boolean;
  verified?: boolean;
};

export const BUSINESS_CATEGORIES: {
  value: BusinessCategory;
  label: string;
  emoji: string;
  description: string;
}[] = [
  {
    value: "food",
    label: "Food & Restaurants",
    emoji: "🍽️",
    description: "Restaurants, caterers, food vendors, bakeries",
  },
  {
    value: "fashion",
    label: "Fashion & Apparel",
    emoji: "👗",
    description: "Clothing, accessories, tailors, designers",
  },
  {
    value: "beauty",
    label: "Beauty & Wellness",
    emoji: "💄",
    description: "Salons, spas, barbers, cosmetics",
  },
  {
    value: "tech",
    label: "Technology",
    emoji: "💻",
    description: "Developers, IT services, software, gadgets",
  },
  {
    value: "health",
    label: "Health & Medical",
    emoji: "🏥",
    description: "Clinics, pharmacies, fitness, wellness",
  },
  {
    value: "education",
    label: "Education",
    emoji: "📚",
    description: "Schools, tutors, training, e-learning",
  },
  {
    value: "finance",
    label: "Finance & Legal",
    emoji: "💰",
    description: "Accountants, lawyers, insurance, fintech",
  },
  {
    value: "retail",
    label: "Retail & Shopping",
    emoji: "🛒",
    description: "Stores, markets, e-commerce, wholesale",
  },
  {
    value: "services",
    label: "Professional Services",
    emoji: "🤝",
    description: "Consultants, agencies, freelancers",
  },
  {
    value: "creative",
    label: "Creative & Media",
    emoji: "🎨",
    description: "Photographers, designers, artists, media",
  },
  {
    value: "real-estate",
    label: "Real Estate",
    emoji: "🏠",
    description: "Agents, developers, property management",
  },
  {
    value: "events",
    label: "Events & Entertainment",
    emoji: "🎉",
    description: "Event planners, DJs, venues, entertainment",
  },
  {
    value: "logistics",
    label: "Logistics & Transport",
    emoji: "🚚",
    description: "Delivery, haulage, courier, freight",
  },
  {
    value: "agriculture",
    label: "Agriculture & Farming",
    emoji: "🌾",
    description: "Farms, agro-processing, livestock, crops",
  },
  {
    value: "other",
    label: "Other",
    emoji: "⭐",
    description: "Everything else",
  },
];

export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export const MAJOR_CITIES = [
  "Lagos",
  "Abuja",
  "Kano",
  "Ibadan",
  "Port Harcourt",
  "Benin City",
  "Maiduguri",
  "Zaria",
  "Aba",
  "Oyo",
  "Enugu",
  "Kaduna",
  "Warri",
  "Osogbo",
  "Ilorin",
  "Onitsha",
  "Calabar",
  "Uyo",
  "Akure",
  "Abeokuta",
];

export function getCategoryByValue(value: BusinessCategory) {
  return BUSINESS_CATEGORIES.find((c) => c.value === value);
}

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const clean = phone.replace(/\D/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${clean}${text}`;
}
