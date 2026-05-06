"use client";
import { useParams } from "next/navigation";
import { useSiteDisplayStore } from "@/store/useSiteDisplayStore";
import SitePageShell from "@/screen/s/SitePageShell";

export default function CustomDomainRoutePage() {
  const slug = useSiteDisplayStore((s) => s.site?.slug ?? "");
  const { route } = useParams() as { route: string };
  return <SitePageShell slugs={{ slug, routePath: route }} isCustomDomain/>;
}
