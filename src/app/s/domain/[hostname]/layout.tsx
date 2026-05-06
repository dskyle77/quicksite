"use client";
import { ReactNode, use } from "react";
import { useSiteDisplayStore } from "@/store/useSiteDisplayStore";
import { useSiteLayout } from "@/hooks/useSiteLayout";

export default function DomainLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ hostname: string }>;
}) {
  const { hostname } = use(params);
  const fetchSiteByDomain = useSiteDisplayStore((s) => s.fetchSiteByDomain);
  useSiteLayout(() => fetchSiteByDomain(hostname.toLowerCase()));
  return <>{children}</>;
}
