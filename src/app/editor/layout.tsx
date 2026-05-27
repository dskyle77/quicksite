"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { checkBusinessProflie } from "@/lib/firestore";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [hasBusinessProfile, setHasBusinessProfile] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    async function checkProfile() {
      if (loading) return;

      if (!user?.uid) {
        router.replace("/login");
        return;
      }
      try {
        const result = await checkBusinessProflie(user.uid);
        if (!result) {
          router.replace("/onboarding");
        } else {
          setHasBusinessProfile(true);
        }
      } catch (err) {
        // fallback: block access (redirect or show error)
        router.replace("/onboarding");
      }
    }
    checkProfile();
  }, [user, loading, router]);

  // Prevent UI flicker while status is unknown
  if (hasBusinessProfile === null) return null;

  return <>{children}</>;
}
