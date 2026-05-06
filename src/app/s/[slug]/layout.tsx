"use client";
import { ReactNode, use } from "react";
import { useSiteDisplayStore } from "@/store/useSiteDisplayStore";
import { useSiteLayout } from "@/hooks/useSiteLayout";

export default function EditorLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const fetchPublicSite = useSiteDisplayStore((s) => s.fetchPublicSite);
  useSiteLayout(() => fetchPublicSite(slug));
  return <>{children}</>;
}
