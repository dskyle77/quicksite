"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function checkProfile() {
      if (loading) return;

      if (!user?.uid) {
        router.replace("/login");
        return;
      }
    }
    checkProfile();
  }, [user, loading, router]);

  // Show loader2 while status is unknown
  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader2 />
      </div>
    );
  }

  return <>{children}</>;
}
