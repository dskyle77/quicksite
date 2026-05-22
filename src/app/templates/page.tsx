// src/app/templates/page.tsx
import { Suspense } from "react";
import TemplateGallery from "@/screen/templates/TemplatesScreen";

export const metadata = {
  title: "Website Templates — QuickSite",
  description:
    "Browse modern, responsive website templates built for businesses, portfolios, schools, restaurants, churches, and more on QuickSite.",
  keywords: [
    "QuickSite templates",
    "website templates",
    "business website templates",
    "responsive website designs",
    "portfolio templates",
    "school website templates",
    "church website templates",
    "modern web templates",
    "Nigeria website builder",
  ],
  openGraph: {
    title: "Website Templates | QuickSite",
    description:
      "Explore professionally designed website templates on QuickSite and launch your website faster.",
    url: "https://quicksite.com.ng/templates",
    siteName: "QuickSite",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Templates — QuickSite",
    description:
      "Discover responsive and modern website templates built for different industries on QuickSite.",
  },
};

export default function TemplatesPage() {
  return (
    <Suspense>
      <TemplateGallery />
    </Suspense>
  );
}
