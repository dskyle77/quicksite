// src/app/biz/page.tsx
// Public business directory page

import { Metadata } from "next";
import {
  getFeaturedBusinesses,
  getDirectoryListings,
} from "@/server/businessFirestore";
import DirectoryScreen from "@/screen/directory/DirectoryScreen";

export const metadata: Metadata = {
  title: "Business Directory — Quicksite",
  description:
    "Discover verified Nigerian businesses. Find services, contact directly on WhatsApp, and explore the best local businesses.",
};

export const revalidate = 3600; // Revalidate every hour

export default async function DirectoryPage() {
  const [featured, initial] = await Promise.all([
    getFeaturedBusinesses(6),
    getDirectoryListings({ category: "all" }),
  ]);

  return <DirectoryScreen featured={featured || []} initial={initial} />;
}
