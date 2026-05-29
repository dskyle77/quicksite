"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

import DashboardLayoutScreen from "@/screen/dashboard/DashboardLayoutScreen";
import { Zap } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user?.uid) {
      router.replace("/login");
      return;
    }
  }, [user, loading, router]);

  if (loading || typeof user === "undefined")
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-primary grid place-items-center animate-pulse">
            <Zap className="h-4 w-4 text-white fill-white" />
          </div>
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );

  return <DashboardLayoutScreen>{children}</DashboardLayoutScreen>;
}
