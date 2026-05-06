"use client";

import { useSiteDisplayStore } from "@/store/useSiteDisplayStore";
import SiteRenderer from "@/screen/s/SiteRenderer";
import { Loader2 } from "lucide-react";

interface Props {
  slugs: Record<string, string>;
  isCustomDomain?: boolean;
  notFoundMessage?: string;
}

export default function SitePageShell({
  slugs,
  isCustomDomain,
  notFoundMessage,
}: Props) {
  const siteData = useSiteDisplayStore((s) => s.site);
  const loading = useSiteDisplayStore((s) => s.loading);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-slate-500" />
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-2xl font-bold">
          {isCustomDomain ? "Site not found" : "Site not available"}
        </h1>
        <p className="text-slate-500 mt-2">
          {notFoundMessage ?? "This site may be unpublished or doesn't exist."}
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <SiteRenderer
        site={siteData}
        slugs={slugs}
        isCustomDomain={isCustomDomain}
      />
    </main>
  );
}
