"use client";
import { useParams } from "next/navigation";
import SitePageShell from "@/screen/s/SitePageShell";

export default function PublicSitePage() {
  const { slug, subslug } = useParams() as { slug: string; subslug: string };
  return <SitePageShell slugs={{ slug, subslug }} />;
}
