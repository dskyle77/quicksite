// src/app/biz/[slug]/page.tsx
// Public business profile page — SEO-optimised

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getBusinessProfile,
  getSimilarBusinesses,
  generateBusinessSeoMeta,
} from "@/server/businessFirestore";
import { serializeFirestoreDoc } from "@/lib/utils/serialize";
import BusinessProfilePage from "@/screen/business/BusinessProfilePage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getBusinessProfile(slug);
  if (!profile) {
    return { title: "Business Not Found — Quicksite" };
  }

  const { title, description, keywords } = generateBusinessSeoMeta(profile);
  const locationPart = profile.city ? ` in ${profile.city}` : "";

  return {
    title,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Quicksite",
      url: `https://quicksiteio.vercel.app/biz/${slug}`,
      images:
        profile.ogImage || profile.coverUrl
          ? [
              {
                url: (profile.ogImage || profile.coverUrl)!,
                width: 1200,
                height: 630,
                alt: profile.name,
              },
            ]
          : [],
    },
    twitter: {
      card:
        profile.ogImage || profile.coverUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(profile.ogImage && { images: [profile.ogImage] }),
    },
    alternates: {
      canonical: `https://quicksiteio.vercel.app/biz/${slug}`,
    },
    other: {
      ...(profile.whatsappNumber && {
        "contact:whatsapp": `https://wa.me/${profile.whatsappNumber.replace(/\D/g, "")}`,
      }),
      "business:name": profile.name,
      ...(locationPart && { "business:location": locationPart.trim() }),
    },
  };
}

export default async function BusinessPage({ params }: PageProps) {
  const { slug } = await params;
  const rawProfile = await getBusinessProfile(slug);

  if (!rawProfile || rawProfile.status !== "active") {
    notFound();
  }

  const rawSimilar = await getSimilarBusinesses(rawProfile.category, slug, 4);

  const profile = serializeFirestoreDoc(rawProfile);
  const similar = rawSimilar.map((b) => serializeFirestoreDoc(b));

  return <BusinessProfilePage profile={profile} similar={similar} />;
}
