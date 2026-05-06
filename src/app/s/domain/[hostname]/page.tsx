"use client";
import { useSiteDisplayStore } from "@/store/useSiteDisplayStore";
import SitePageShell from "@/screen/s/SitePageShell";

export default function CustomDomainPublicPage() {
  const slug = useSiteDisplayStore((s) => s.site?.slug ?? "");
  return <SitePageShell slugs={{ slug, subslug: "" }} isCustomDomain />;
}