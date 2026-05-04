/* eslint-disable react-hooks/set-state-in-effect */
"use client";

// src/features/dashboard/DashboardLayoutScreen.tsx
// Updated to handle global data initialization via Zustand

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useUserStore } from "@/store/useUserStore";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import {
  Zap,
  LayoutDashboard,
  Globe,
  BarChart2,
  Settings,
  LogOut,
  Plus,
  Sun,
  Moon,
  Menu,
} from "lucide-react";

const SIDEBAR_LINKS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Globe, label: "My Sites", href: "/dashboard/sites" },
  { icon: Globe, label: "Domains", href: "/dashboard/domains" },
  { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

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
  const { profile } = useUserStore();

  // ── Zustand Store ──────────────────────────────────────────
  const { ui, setSidebarOpen, initialize } = useDashboardStore();

  useEffect(() => setMounted(true), []);

  // Handle Authentication Redirect
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // ── INITIALIZE DATA ────────────────────────────────────────
  // This triggers once when the user is logged in.
  // Because it's in the layout, it persists across dashboard sub-pages.
  useEffect(() => {
    if (user?.uid) {
      initialize(user.uid);
    }
  }, [user?.uid, initialize]);
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
    <div className="min-h-screen bg-background flex">
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:sticky top-0 h-screen z-40 flex flex-col w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 shrink-0 ${
          ui.sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary grid place-items-center">
              <Zap className="h-5 w-5 text-white fill-white" />
            </div>
            <div>
              <p className="font-bold text-base text-sidebar-foreground">
                {SITE_STANDARD_NAME}
              </p>
              <p className="text-[10px] text-muted-foreground">{DOMAIN_NAME}</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {SIDEBAR_LINKS.map(({ icon: Icon, label, href }) => (
            <Link key={label} href={href} onClick={() => setSidebarOpen(false)}>
              <div
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  pathname === href
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </div>
            </Link>
          ))}
          {profile?.isAdmin === true && (
            <Link href="/admin" onClick={() => setSidebarOpen(false)}>
              <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all cursor-pointer">
                <ShieldAlert className="h-4 w-4" />
                Admin Panel
              </div>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-4">
          <div className="bg-primary/10 rounded-xl p-4">
            <p className="text-xs font-semibold mb-1">Free Plan</p>
            <p className="text-[11px] text-muted-foreground mb-3">
              Upgrade to remove branding.
            </p>
            <Link href="/pricing">
              <button className="w-full bg-primary text-primary-foreground rounded-lg text-xs font-semibold py-2 hover:opacity-90 transition cursor-pointer">
                Upgrade Now
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary grid place-items-center text-xs font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user.displayName ?? "My Account"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-muted-foreground hover:text-destructive transition disabled:opacity-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {ui.sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="font-bold text-lg leading-tight capitalize">
                {pageTitle}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Welcome, {firstName} 👋
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
                className="text-muted-foreground hover:text-foreground p-2"
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
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full h-9 px-4 text-sm font-semibold hover:opacity-90 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Site</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-7 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
