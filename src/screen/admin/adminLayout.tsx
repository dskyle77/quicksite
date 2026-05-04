"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/useAuth";
import { checkIsAdmin } from "@/lib/firestore";

import AdminSidebar from "@/screen/admin/AdminSidebar";
import { Shield } from "lucide-react";

export default function AdminLayoutScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAccess() {
      if (loading) return;

      try {
        if (!user?.uid) throw new Error("No UID found");
        const isAdmin = await checkIsAdmin(user.uid);
        if (!isAdmin) {
          router.push("/dashboard");
        } else {
          setIsAdmin(true);
        }
      } catch (err) {
        router.push("/login");
      }
    }
    checkAccess();
  }, [router, loading, user]);

  // Prevent UI flicker while checking
  if (isAdmin === null) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-13 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div />
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-3 py-1">
            <Shield className="w-3 h-3 text-red-600" />
            <span className="text-[11px] font-extrabold text-red-600 text-nowrap">
              Admin Mode
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
