"use client";

import { useState, useCallback, useEffect } from "react";
import authFetch from "@/lib/authFetch";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Eye,
  Trash2,
  ExternalLink,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import type { AdminSite, AdminUser, PlanType } from "./adminTypes";
import { PLAN_COLORS, STATUS_COLORS } from "./adminTypes";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function SitesScreen({
  sites: initial,
  users: initialUsers,
  nextCursor: initialNextCursor,
  currentSearch,
  currentStatus,
}: {
  sites: AdminSite[];
  users: AdminUser[];
  nextCursor: string | null;
  currentSearch?: string;
  currentStatus?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Data state
  const [sites, setSites] = useState<AdminSite[]>(initial);
  const [users] = useState<AdminUser[]>(initialUsers);
  const [search, setSearch] = useState(currentSearch || "");
  const [filter, setFilter] = useState(currentStatus || "all");

  // Pagination state
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [loading, setLoading] = useState(false);

  // Action state
  const [deleteTarget, setDeleteTarget] = useState<AdminSite | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch logic for pagination
  const fetchPage = useCallback(
    async (cursor?: string, s?: string, f?: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (cursor) params.set("cursor", cursor);
        if (s) params.set("search", s);
        if (f && f !== "all") params.set("status", f);

        const res = await authFetch(`/api/admin/sites?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch sites");

        const data = await res.json();
        setSites(data.sites);
        setNextCursor(data.nextCursor);
        
        // In a real app, we might want to fetch users for these sites if not already loaded
        // For simplicity, we rely on the parent page to provide them or we could fetch them here.
      } catch (err) {
        toast.error("Failed to load sites");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Debounced search
  useEffect(() => {
    if (search === (currentSearch || "")) return;
    const timer = setTimeout(() => {
      setCursorStack([]);
      fetchPage(undefined, search, filter);
      
      const params = new URLSearchParams(searchParams.toString());
      if (search) params.set("search", search);
      else params.delete("search");
      params.delete("cursor");
      router.replace(`${pathname}?${params.toString()}`);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchPage, pathname, router, searchParams, currentSearch, filter]);

  const handleFilter = (f: string) => {
    setFilter(f);
    setCursorStack([]);
    fetchPage(undefined, search, f);
    
    const params = new URLSearchParams(searchParams.toString());
    if (f !== "all") params.set("status", f);
    else params.delete("status");
    params.delete("cursor");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const goNext = async () => {
    if (!nextCursor) return;
    setCursorStack((prev) => [...prev, sites[0]?.id ?? ""]);
    await fetchPage(nextCursor, search, filter);
  };

  const goPrev = async () => {
    if (cursorStack.length === 0) return;
    const newStack = [...cursorStack];
    const prevCursor = newStack.pop();
    setCursorStack(newStack);
    await fetchPage(newStack.length === 0 ? undefined : prevCursor, search, filter);
  };

  const deleteSite = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await authFetch(`/api/admin/sites/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      setSites((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      toast.success("Site deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Delete confirmation modal */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <DialogTitle className="text-base">Delete site?</DialogTitle>
            </div>
            <DialogDescription className="text-[13px] leading-relaxed pl-[52px]">
              <span className="font-semibold text-slate-900">
                {deleteTarget?.name}
              </span>{" "}
              will be permanently deleted along with all its content. This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteSite}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete site"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <div className="flex gap-2.5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sites…"
            className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-[13px] outline-none bg-white"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => handleFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-[13px] bg-white cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {[
                  "Site",
                  "Owner",
                  "Status",
                  "Custom Domain",
                  "Visits",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5 text-[10px] font-black tracking-widest text-slate-400 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400 mx-auto" />
                  </td>
                </tr>
              ) : sites.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-slate-400 text-[13px] py-12"
                  >
                    No sites found.
                  </td>
                </tr>
              ) : (
                sites.map((site, i) => {
                  const owner = users.find((u) => u.uid === site.uid);
                  return (
                    <tr
                      key={site.id}
                      className={cn(
                        i < sites.length - 1 && "border-b border-slate-50",
                      )}
                    >
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-900">{site.name}</p>
                        <p className="text-[11px] text-slate-400">
                          /s/{site.slug}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-slate-600">
                          {owner?.displayName ?? "—"}
                        </p>
                        {owner && (
                          <span
                            className={cn(
                              "text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full",
                              PLAN_COLORS[owner.plan as PlanType],
                            )}
                          >
                            {owner.plan}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "text-[11px] font-semibold flex items-center gap-1.5",
                            STATUS_COLORS[site.status],
                          )}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {site.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {site.customDomain ? (
                          <a
                            href={`https://${site.customDomain}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline"
                          >
                            {site.customDomain}{" "}
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-black text-slate-900">
                        {site.visits.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <a
                            href={`/s/${site.slug}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <button className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200">
                              <Eye className="w-3 h-3" /> View
                            </button>
                          </a>
                          <button
                            onClick={() => setDeleteTarget(site)}
                            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between bg-slate-50">
          <p className="text-[12px] text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-700">{sites.length}</span>{" "}
            sites
          </p>
          <div className="flex gap-2">
            <button
              onClick={goPrev}
              disabled={cursorStack.length === 0 || loading}
              className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              onClick={goNext}
              disabled={!nextCursor || loading}
              className="flex items-center gap-1 text-[12px] font-bold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
