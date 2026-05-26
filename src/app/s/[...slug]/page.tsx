import type { Metadata } from "next";
import { headers } from "next/headers";
import { cache } from "react";
import { getSiteByLookup } from "@/server/adminFirestore";
import SitePageShell from "@/screen/s/SitePageShell";
import { serializeFirestoreDoc } from "@/lib/utils/serialize";

const getCachedSite = cache(async (identifier: string) => {
  return getSiteByLookup(identifier);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug: segments } = await params;
  const site = await getCachedSite(segments[0]);

  const title = site?.name ?? "Site";
  const description = site?.description ?? "";
  const ogImage = site?.ogImage ?? null;
  const tags = site?.tags ?? [];
  const whatsappNumber = site?.whatsappNumber
    ? site.whatsappNumber.replace(/\D/g, "") // strip non-digits for URL safety
    : null;

  return {
    title,
    description,
    keywords: tags,
    ...(whatsappNumber && {
      other: {
        "contact:whatsapp": `https://wa.me/${whatsappNumber}`,
      },
    }),
    openGraph: {
      title,
      description,
      type: "website",
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug: segments } = await params;
  const isCustomDomain = (await headers()).get("x-is-custom-domain") === "true";
  const raw = await getCachedSite(segments[0]);
  const site = serializeFirestoreDoc(raw);
  return <SitePageShell site={site} isCustomDomain={isCustomDomain} />;
}
