"use client";

import { useSiteDisplayStore } from "@/store/useSiteDisplayStore";
import SiteRenderer from "@/screen/s/SiteRenderer";
import { Loader2 } from "lucide-react";

export default function CustomDomainPublicPage() {
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
        <h1 className="text-2xl font-bold">Site not found</h1>
        <p className="text-slate-500 mt-2">
          This domain is not linked to an active site.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* We pass empty slugs because custom domains usually live at the root */}
      <SiteRenderer site={siteData} slugs={{ slug: "", subslug: "" }} />
    </main>
  );
}
