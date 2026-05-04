"use client";

import { useState } from "react";
import {
  Search,
  RefreshCw,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";
import type { AdminDomain, AdminUser, PlanType } from "./adminTypes";
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

const DNS_RECORDS = [
  { type: "A Record", host: "@", value: "76.76.21.21" },
  { type: "CNAME", host: "www", value: "cname.vercel-dns.com" },
];

interface DeleteTarget {
  id: string;
  domain: string;
  siteId: string;
}

export default function UserDomainsScreen({
  domains: initial,
  users,
}: {
  domains: AdminDomain[];
  users: AdminUser[];
}) {
  const [domains, setDomains] = useState<AdminDomain[]>(initial);
  const [search, setSearch] = useState("");
  const [verifying, setVerifying] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = domains.filter(
    (d) =>
      d.domain.includes(search) ||
      d.siteName.toLowerCase().includes(search.toLowerCase()),
  );

  const verifyDomain = async (id: string, domain: string) => {
    setVerifying(id);
    try {
      const res = await fetch("/api/domains/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();

      if (data.isValid) {
        setDomains((prev) =>
          prev.map((d) =>
            d.id === id ? { ...d, dnsOk: true, vercelStatus: "ACTIVE" } : d,
          ),
        );
        showToast("DNS verified successfully ✓");
      } else {
        setDomains((prev) =>
          prev.map((d) =>
            d.id === id
              ? { ...d, dnsOk: false, vercelStatus: "PENDING_VERIFICATION" }
              : d,
          ),
        );
        showToast(
          `DNS check failed. Found: ${data.found?.join(", ") || "no records"}`,
          false,
        );
      }
    } catch {
      showToast("Verification request failed", false);
    } finally {
      setVerifying(null);
    }
  };

  const confirmRemove = (id: string, domain: string, siteId: string) => {
    setDeleteTarget({ id, domain, siteId });
  };

  const removeDomain = async () => {
    if (!deleteTarget) return;
    const { id, domain, siteId } = deleteTarget;
    setRemoving(id);
    setDeleteTarget(null);
    try {
      const res = await fetch("/api/domains/delete", {
        method: "DELETE",
        body: JSON.stringify({ domain, siteId }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Remove failed");
      }
      setDomains((prev) => prev.filter((d) => d.id !== id));
      showToast("Domain removed");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Remove failed", false);
    } finally {
      setRemoving(null);
    }
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
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
              <DialogTitle className="text-base">Remove domain?</DialogTitle>
            </div>
            <DialogDescription className="text-[13px] leading-relaxed pl-[52px]">
              This will permanently unlink{" "}
              <span className="font-semibold text-slate-900">
                {deleteTarget?.domain}
              </span>{" "}
              from its site and remove it from Vercel. The domain itself won&apos;t
              be deleted from your registrar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={removeDomain}
              disabled={!!removing}
            >
              {removing ? "Removing…" : "Remove domain"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total Domains",
            value: domains.length,
            color: "text-blue-600",
          },
          {
            label: "Verified (DNS OK)",
            value: domains.filter((d) => d.dnsOk).length,
            color: "text-emerald-600",
          },
          {
            label: "Pending / Failed",
            value: domains.filter((d) => !d.dnsOk).length,
            color: "text-amber-500",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3.5"
          >
            <span className={cn("text-3xl font-black", s.color)}>
              {s.value}
            </span>
            <span className="text-xs font-bold text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* DNS reference */}
      <div className="bg-slate-900 rounded-2xl p-5">
        <p className="text-[11px] font-black tracking-widest text-slate-500 uppercase mb-3.5">
          Required DNS Records
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {DNS_RECORDS.map((rec) => (
            <div
              key={rec.type}
              className="bg-slate-800 rounded-xl p-3 flex justify-between items-center"
            >
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-wide mb-1">
                  {rec.type}
                </p>
                <p className="text-xs text-slate-400">
                  Host:{" "}
                  <span className="text-slate-100 font-bold">{rec.host}</span>
                </p>
                <p className="text-xs text-slate-400">
                  Value:{" "}
                  <span className="text-slate-100 font-bold">{rec.value}</span>
                </p>
              </div>
              <button
                onClick={() => copy(rec.value, rec.type)}
                className={cn(
                  "p-2 bg-slate-700 rounded-lg",
                  copiedKey === rec.type
                    ? "text-emerald-400"
                    : "text-slate-400 hover:text-slate-200",
                )}
              >
                {copiedKey === rec.type ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search domains or sites…"
          className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-[13px] outline-none bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {[
                  "Domain",
                  "Linked Site",
                  "Owner",
                  "DNS / Vercel Status",
                  "Linked At",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2.5 text-[10px] font-black tracking-widest text-slate-400 uppercase whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((dom, i) => {
                const owner = users.find((u) => u.uid === dom.uid);
                return (
                  <tr
                    key={dom.id}
                    className={cn(
                      i < filtered.length - 1 && "border-b border-slate-50",
                      !dom.dnsOk && "bg-amber-50/50",
                    )}
                  >
                    {/* Domain */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">
                          {dom.domain}
                        </span>
                        <a
                          href={`https://${dom.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                    {/* Linked site */}
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold text-slate-600">
                        {dom.siteName}
                      </p>
                      <p className="text-[10px] text-slate-400">{dom.siteId}</p>
                    </td>
                    {/* Owner */}
                    <td className="px-4 py-3">
                      {owner ? (
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {owner.displayName}
                          </p>
                          <span
                            className={cn(
                              "text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full",
                              PLAN_COLORS[owner.plan as PlanType],
                            )}
                          >
                            {owner.plan}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    {/* DNS status */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span
                          className={cn(
                            "text-[11px] font-bold",
                            dom.dnsOk ? "text-emerald-600" : "text-red-500",
                          )}
                        >
                          DNS: {dom.dnsOk ? "✓ OK" : "✗ FAIL"}
                        </span>
                        <span
                          className={cn(
                            "text-[11px] font-semibold flex items-center gap-1",
                            STATUS_COLORS[dom.vercelStatus],
                          )}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {dom.vercelStatus.replace("_", " ")}
                        </span>
                      </div>
                    </td>
                    {/* Linked at */}
                    <td className="px-4 py-3 text-[11px] text-slate-400">
                      {dom.linkedAt
                        ? new Date(dom.linkedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => verifyDomain(dom.id, dom.domain)}
                          disabled={verifying === dom.id}
                          className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50"
                        >
                          <RefreshCw
                            className={cn(
                              "w-3 h-3",
                              verifying === dom.id && "animate-spin",
                            )}
                          />
                          {verifying === dom.id ? "Checking…" : "Verify"}
                        </button>
                        <button
                          onClick={() =>
                            confirmRemove(dom.id, dom.domain, dom.siteId)
                          }
                          disabled={removing === dom.id}
                          className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                          <Trash2 className="w-3 h-3" />
                          {removing === dom.id ? "…" : "Remove"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-slate-400 text-[13px] py-12">
              No domains found.
            </p>
          )}
        </div>
      </div>

      {toast && (
        <div
          className={cn(
            "fixed bottom-6 right-6 border rounded-xl px-4 py-3 text-[13px] font-bold shadow-lg z-50",
            toast.ok
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200",
          )}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
