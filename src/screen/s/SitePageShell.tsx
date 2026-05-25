"use client";
import { useMemo } from "react";
import { useParams } from "next/navigation";

import { SiteProvider } from "@/context/SiteContext";
import SiteRenderer from "@/screen/s/SiteRenderer";
import { Site } from "@/lib/types";

interface Props {
  site: Site | null;
  isCustomDomain?: boolean;
  notFoundMessage?: string;
}

export default function SitePageShell({
  site,
  isCustomDomain,
  notFoundMessage,
}: Props) {
  const params = useParams();

  const slugs = useMemo(() => {
    if ("slug" in params && Array.isArray(params.slug)) {
      const [slug = ""] = params.slug as string[];
      if (slug) {
        const subslug = (params.slug as string[])[1] || "";
        return { slug, subslug };
      }
      return null;
    } else if ("hostname" in params && Array.isArray(params.hostname)) {
      const segments = params.hostname as string[];
      const slug = segments[0] || "";
      if (slug) {
        const subslug = segments.slice(1).join("/") || "";
        return { slug, subslug };
      }
      return null;
    }
    return null;
  }, [params]);

  // Block rendering if no slug present
  if (!slugs) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-2xl font-bold">Invalid URL</h1>
        <p className="text-slate-500 mt-2">
          {notFoundMessage ?? "Missing or invalid slug. Please check the URL."}
        </p>
      </div>
    );
  }

  if (!site) {
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
      <SiteProvider
        value={{
          slugs,
          site: site,
          isCustomDomain,
        }}
      >
        <SiteRenderer/>
      </SiteProvider>
    </main>
  );
}
