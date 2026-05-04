"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Globe,
  Link2,
  
  Shield,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/sites", label: "Sites", icon: Globe },
  { href: "/admin/user-domains", label: "Domains", icon: Link2 },
  { href: "/dashboard", label: "Dashboard", icon:  LayoutDashboard},
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col shrink-0 bg-slate-900 h-screen sticky top-0 transition-all duration-200",
        collapsed ? "w-14" : "w-48",
      )}
    >
      {/* Logo */}
      <div className="h-13 flex items-center gap-2.5 px-3.5 border-b border-slate-800 overflow-hidden">
        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
        </div>
        {!collapsed && (
          <span className="font-black text-[13px] text-slate-50 whitespace-nowrap">
            Admin Panel
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-bold transition-colors overflow-hidden whitespace-nowrap",
                active
                  ? "bg-slate-800 text-slate-50"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50",
              )}
            >
              <Icon className="w-[15px] h-[15px] shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 pb-3 border-t border-slate-800 flex flex-col gap-0.5">
        <button
          onClick={() => setCollapsed((p) => !p)}
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-500 hover:text-slate-300 text-[12px] font-semibold overflow-hidden whitespace-nowrap transition-colors"
        >
          {collapsed ? (
            <PanelLeftOpen className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="w-3.5 h-3.5 shrink-0" />
              Collapse
            </>
          )}
        </button>
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-500 hover:text-slate-300 text-[12px] font-semibold overflow-hidden whitespace-nowrap transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && "Exit Admin"}
        </Link>
      </div>
    </aside>
  );
}
