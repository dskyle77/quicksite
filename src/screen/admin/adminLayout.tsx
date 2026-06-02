"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
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
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            <h1 className="text-sm font-bold text-slate-600">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-3 py-1.5 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest text-red-600 uppercase">
              Live Admin Mode
            </span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
