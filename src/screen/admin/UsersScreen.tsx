"use client";

import { useState, useCallback } from "react";
import authFetch from "@/lib/authFetch";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { AdminUser, PlanType } from "./adminTypes";
import { PLAN_COLORS, STATUS_COLORS } from "./adminTypes";
import { cn } from "@/lib/utils";

const VALID_PLANS: PlanType[] = ["free", "growth", "pro"];

export default function UsersScreen({
  users: initial,
  nextCursor: initialNextCursor,
}: {
  users: AdminUser[];
  nextCursor: string | null;
}) {
  const [users, setUsers] = useState<AdminUser[]>(initial);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [toast, setToast] = useState("");

  // Pagination state
  const [cursorStack, setCursorStack] = useState<string[]>([]); // stack of cursors for "prev"
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor,
  );
  const [loading, setLoading] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchPage = useCallback(async (cursor?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cursor) params.set("cursor", cursor);
      const res = await authFetch(`/api/admin/users?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUsers(data.users);
      setNextCursor(data.nextCursor);
    } catch {
      showToast("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  const goNext = async () => {
    if (!nextCursor) return;
    // Push current "first user id" as the back-cursor
    setCursorStack((prev) => [...prev, users[0]?.uid ?? ""]);
    await fetchPage(nextCursor);
  };

  const goPrev = async () => {
    if (cursorStack.length === 0) return;
    const newStack = [...cursorStack];
    const prevCursor = newStack.pop();
    setCursorStack(newStack);
    // If stack is now empty, fetch the very first page (no cursor)
    await fetchPage(newStack.length === 0 ? undefined : prevCursor);
  };

  const filtered = users.filter(
    (u) =>
      (u.displayName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())) &&
      (planFilter === "all" || u.plan === planFilter),
  );

  const changePlan = async (uid: string, plan: PlanType) => {
    await authFetch(`/api/admin/users/${uid}/plan`, {
      method: "PATCH",
      body: JSON.stringify({ plan }),
      headers: { "Content-Type": "application/json" },
    });
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, plan } : u)));
    showToast("Plan updated");
  };

  const toggleStatus = async (uid: string, current: string) => {
    const status = current === "active" ? "suspended" : "active";
    await authFetch(`/api/admin/users/${uid}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      headers: { "Content-Type": "application/json" },
    });
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, status } : u)));
    showToast("Status updated");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex gap-2.5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users…"
            className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-[13px] outline-none bg-white"
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-[13px] bg-white cursor-pointer"
        >
          <option value="all">All Plans</option>
          {VALID_PLANS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["User", "Joined", "Plan", "Sites", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2.5 text-[10px] font-black tracking-widest text-slate-400 uppercase whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400 mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center text-slate-400 text-[13px] py-12"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filtered.map((user, i) => (
                  <tr
                    key={user.uid}
                    className={cn(
                      i < filtered.length - 1 && "border-b border-slate-50",
                    )}
                  >
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[11px] font-black shrink-0">
                          {user.displayName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2) || "??"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {user.displayName || "—"}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Joined */}
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    {/* Plan */}
                    <td className="px-4 py-3">
                      <select
                        value={user.plan}
                        onChange={(e) =>
                          changePlan(user.uid, e.target.value as PlanType)
                        }
                        className={cn(
                          "text-[11px] font-black px-2 py-1 rounded-full border-none cursor-pointer uppercase tracking-wide",
                          PLAN_COLORS[user.plan as PlanType],
                        )}
                      >
                        {VALID_PLANS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </td>
                    {/* Sites */}
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {user.siteCount}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-[11px] font-semibold flex items-center gap-1.5",
                          STATUS_COLORS[user.status],
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {user.status}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStatus(user.uid, user.status)}
                        className={cn(
                          "text-[11px] font-bold px-2.5 py-1 rounded-lg",
                          user.status === "active"
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
                        )}
                      >
                        {user.status === "active" ? "Suspend" : "Restore"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between bg-slate-50">
          <p className="text-[12px] text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-700">{filtered.length}</span>{" "}
            of <span className="font-bold text-slate-700">{users.length}</span>{" "}
            loaded users
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

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl px-4 py-3 text-[13px] font-bold shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
