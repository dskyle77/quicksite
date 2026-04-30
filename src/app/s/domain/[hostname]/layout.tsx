"use client";

import { ReactNode, useEffect, use } from "react";
import { useSiteDisplayStore } from "@/store/useSiteDisplayStore";
import { toast } from "sonner";

interface DomainLayoutProps {
  children: ReactNode;
  params: Promise<{ hostname: string }>;
}

export default function DomainLayout({ children, params }: DomainLayoutProps) {
  const { hostname } = use(params);

  const fetchSiteByDomain = useSiteDisplayStore((s) => s.fetchSiteByDomain);
  const reset = useSiteDisplayStore((s) => s.reset);

  useEffect(() => {
    if (hostname) {
      const cleanHostname = hostname.toLowerCase();
      fetchSiteByDomain(cleanHostname).catch(() => {
        toast.error("Failed to load site");
      });
    }
    return () => reset();
  }, [hostname, fetchSiteByDomain, reset]);

  return <>{children}</>;
}
