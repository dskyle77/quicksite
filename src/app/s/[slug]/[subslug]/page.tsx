"use client";

import { useParams } from "next/navigation";
import { useSiteDisplayStore } from "@/store/useSiteDisplayStore";

import SiteRenderer from "@/screen/s/SiteRenderer";
import { Loader2 } from "lucide-react";

export default function PublicSitePage() {
  const params = useParams();
  const slug = params.slug as string;
  const subslug = params.subslug as string;
  const slugs = {
    slug,
    subslug,
  };

  const siteData = useSiteDisplayStore((s) => s.site);
  const loading = useSiteDisplayStore((s) => s.loading);

  // ── Loading ─────────────────────────────
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-slate-500" />
      </div>
    );
  }

  // ── Not Found / Unpublished ─────────────
  if (!siteData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-2xl font-bold">Site not available</h1>
        <p className="text-slate-500 mt-2">
          This site may be unpublished or doesn&apos;t exist.
        </p>
      </div>
    );
  }

  // ── Renderer ────────────────────────────
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <SiteRenderer site={siteData} slugs={slugs} />
    </main>
  );
}