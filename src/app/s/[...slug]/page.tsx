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
  return {
    title: site?.name ?? "Site",
    description: site?.description ?? "",
    openGraph: {
      title: site?.name,
      images: site?.ogImage ? [site.ogImage] : [],
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
