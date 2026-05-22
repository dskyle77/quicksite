// src/app/pricing/page.tsx
import PricingScreen from "@/screen/pricing/PricingScreen";

export const metadata = {
  title: "Pricing Plans — QuickSite",
  description:
    "Choose a QuickSite plan that fits your business. Affordable website plans with hosting, modern templates, custom domains, and powerful features.",
  keywords: [
    "QuickSite pricing",
    "website builder pricing",
    "affordable website plans",
    "Nigeria website builder",
    "business website pricing",
    "website hosting plans",
    "custom domain website",
    "QuickSite plans",
  ],
  openGraph: {
    title: "Pricing Plans — QuickSite",
    description:
      "Explore flexible and affordable pricing plans for launching your website with QuickSite.",
    url: "https://quicksite.com.ng/pricing",
    siteName: "QuickSite",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing Plans — QuickSite",
    description:
      "Affordable website plans with templates, hosting, and custom domains on QuickSite.",
  },
};

export default function PricingPage() {
  return <PricingScreen />;
}