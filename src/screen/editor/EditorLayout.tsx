"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { useParams, useRouter } from "next/navigation";
import { useSiteEditorStore } from "@/store/useSiteEditorStore";
import { toast } from "sonner";

interface EditorLayoutProps {
  children: ReactNode;
}

export default function EditorLayout({ children }: EditorLayoutProps) {
  const params = useParams();
  const slug = params.slug as string;

  const router = useRouter();

  const { fetchSite, reset } = useSiteEditorStore();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // 1. Auth Guard
    if (!authLoading && !user) {
      router.replace("/login");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user?.uid || !slug) return;

    fetchSite(user.uid, slug).catch((err) => {
      console.error("Fetch Error:", err);
      toast.error("Failed to load site data.");
    });

    return () => {
      reset();
    };

  }, [user, slug, reset, fetchSite]);

  return <>{children}</>;
}
