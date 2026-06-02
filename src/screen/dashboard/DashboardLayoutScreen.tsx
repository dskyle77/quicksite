/* eslint-disable react-hooks/set-state-in-effect */
"use client";

// src/features/dashboard/DashboardLayoutScreen.tsx
// Updated to handle global data initialization via Zustand

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";

import { useAuth } from "@/hooks/useAuth";

import { useDashboardStore } from "@/store/useDashboardStore";
import { useProfileStore } from "@/store/useProfileStore";
import {
  Zap,
  LayoutDashboard,
  ShieldAlert,
  Globe,
  Link2,
  BarChart2,
  Building2,
  Settings,
  LogOut,
  Plus,
  Sun,
  Moon,
  Menu,
  Mail,
} from "lucide-react";

const SITE_STANDARD_NAME = process.env.NEXT_PUBLIC_SITE_STANDARD_NAME;
const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN_NAME;

export default function DashboardLayoutScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading, logOut } = useAuth();
  const { profile } = useProfileStore();

  const sidebarLinks = () => [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Globe, label: "My Sites", href: "/dashboard/sites" },
    { icon: Link2, label: "Domains", href: "/dashboard/domains" },
    { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Mail, label: "Messages", href: "/dashboard/messages" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  // ── Zustand Store ──────────────────────────────────────────
  const { ui, setSidebarOpen, reset } = useDashboardStore();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // Handle Authentication Redirect
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!user.emailVerified) {
        router.push("/verify-email");
      }
    }
  }, [user, loading, profile, pathname, router]);

  // ───────────────────────────────────────────────────────────

  const handleLogout = async () => {
    setLoggingOut(true);
    await logOut();
    router.push("/");
  };

  if (loading || !user) {
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
  }

  const initials = (user.displayName ?? user.email ?? "ME")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const firstName =
    user.displayName?.split(" ")[0] ?? user.email?.split("@")[0] ?? "there";

  const pageTitle = pathname.split("/").filter(Boolean).pop() ?? "dashboard";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050505] flex overflow-hidden">
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-40 flex flex-col w-64 bg-card dark:bg-[#0A0A0A] border-r border-border/50 transition-all duration-300 ease-in-out shrink-0 shadow-sm ${
          ui.sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-border/50">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <Zap className="h-5 w-5 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <p className="font-bold text-lg text-foreground tracking-tight">
                {SITE_STANDARD_NAME}
              </p>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                {DOMAIN_NAME}
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto no-scrollbar">
          <div className="mb-4 px-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Main Menu
            </p>
          </div>
          {sidebarLinks().map(({ icon: Icon, label, href }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(href) && href !== "/dashboard";

            return (
              <Link
                key={label}
                href={href}
                onClick={() => setSidebarOpen(false)}
              >
                <div
                  className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`h-4.5 w-4.5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                  />
                  {label}
                </div>
              </Link>
            );
          })}

          {profile?.isAdmin === true && (
            <>
              <div className="mt-8 mb-4 px-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Admin
                </p>
              </div>
              <Link href="/admin" onClick={() => setSidebarOpen(false)}>
                <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all cursor-pointer">
                  <ShieldAlert className="h-4.5 w-4.5" />
                  Admin Panel
                </div>
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-border/50 space-y-4">
          {profile?.plan === "free" && (
            <div className="relative overflow-hidden bg-primary/5 dark:bg-primary/10 rounded-2xl p-4 border border-primary/10 group">
              <div className="absolute top-0 right-0 -mr-4 -mt-4 h-16 w-16 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <p className="text-xs font-bold mb-1 relative z-10">Free Plan</p>
              <p className="text-[11px] text-muted-foreground mb-4 relative z-10 leading-relaxed">
                Unlock all features and remove branding.
              </p>
              <Link href="/pricing">
                <button className="w-full bg-primary text-primary-foreground rounded-xl text-xs font-bold py-2.5 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer relative z-10">
                  Upgrade Now
                </button>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 px-2 py-1">
            <div className="h-10 w-10 rounded-xl bg-muted border border-border/50 flex items-center justify-center text-xs font-bold text-foreground shrink-0 shadow-sm overflow-hidden">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={initials}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="bg-primary/10 text-primary w-full h-full flex items-center justify-center">
                  {initials}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-foreground leading-tight">
                {user.displayName ?? "My Account"}
              </p>
              <p className="text-[10px] font-medium text-muted-foreground truncate uppercase tracking-tighter">
                {profile?.plan || "Free"} Account
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Logout"
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {ui.sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen overflow-hidden">
        <header className="sticky top-0 z-20 bg-background/80 dark:bg-[#050505]/80 backdrop-blur-md border-b border-border/50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors flex-shrink-0"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="space-y-0.5 min-w-0">
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight capitalize text-foreground truncate">
                {pageTitle}
              </h1>
              <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-[11px] font-medium text-muted-foreground flex-wrap">
                <span className="opacity-70">Dashboard</span>
                <span className="opacity-40">/</span>
                <span className="text-primary capitalize truncate">{pageTitle}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {mounted && (
              <button
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all duration-300 border border-transparent hover:border-border/50"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            )}

            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-1 sm:gap-2 bg-primary text-primary-foreground rounded-xl h-9 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
              tabIndex={0}
            >
              <Plus className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              <span className="hidden xs:inline sm:inline">Create Site</span>
            </Link>
          </div>
        </header>
   

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
