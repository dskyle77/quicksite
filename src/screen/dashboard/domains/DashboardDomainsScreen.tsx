/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useUserStore } from "@/store/useUserStore";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import authFetch from "@/lib/authFetch";

import {
  Globe,
  Server,
  CheckCircle2,
  Copy,
  Loader2,
  AlertCircle,
  RefreshCw,
  XCircle,
  ExternalLink,
  Link as LinkIcon,
  Unlink,
  Lock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { canUseFeature } from "@/lib/plans";

export default function DashboardDomainsScreen() {
  const { user } = useAuth();
  const { sites } = useDashboardStore();
  const { profile } = useUserStore();
  const userPlan = profile?.plan || "free";
  const canUseDomains = canUseFeature(userPlan, "customDomain");

  const SITE_STANDARD_NAME = process.env.NEXT_PUBLIC_SITE_STANDARD_NAME;

  // Form States
  const searchParams = useSearchParams();
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [domainInput, setDomainInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verification States
  const [status, setStatus] = useState<
    "idle" | "verifying" | "valid" | "invalid"
  >("idle");
  const [foundRecords, setFoundRecords] = useState<string[]>([]);

  // Management States
  const [managedDomains, setManagedDomains] = useState<any[]>([]);
  const [unlinkingDomain, setUnlinkingDomain] = useState<string | null>(null);

  // Auto-select site from ?site= query param
  useEffect(() => {
    const siteParam = searchParams.get("site");
    if (!siteParam || sites.length === 0) return;

    const match = sites.find(
      (s) =>
        s.name.toLowerCase().replace(/\s+/g, "-") === siteParam.toLowerCase() ||
        s.id === siteParam,
    );

    if (match) setSelectedSiteId(match.id);
  }, [searchParams, sites]);

  // Listen to User's Managed Domains in Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "domains"),
      orderBy("linkedAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const domainsArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setManagedDomains(domainsArr);
    });

    return () => unsubscribe();
  }, [user]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // Action: Connect a BRAND NEW Domain
  const handleConnectNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUseDomains)
      return toast.error("Upgrade your plan to connect custom domains.");
    if (!user || !selectedSiteId || !domainInput) {
      return toast.error("Please select a site and enter a domain.");
    }

    const cleanDomain = domainInput.toLowerCase().trim();
    setIsSubmitting(true);
    setStatus("verifying");

    try {
      // Step A: Verify DNS
      const verifyRes = await authFetch("/api/domains/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: cleanDomain }),
      });
      const verification = await verifyRes.json();
      setFoundRecords(verification.found || []);

      if (!verification.isValid) {
        setStatus("invalid");
        throw new Error("DNS mismatch. Point your domain to our IP first.");
      }

      // Step B: Register with Vercel & Firestore
      setStatus("valid");
      const res = await authFetch("/api/domains/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: selectedSiteId,
          domain: cleanDomain,
          uid: user.uid,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      toast.success("Domain connected successfully!");
      setDomainInput("");
      setStatus("idle");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Action: Relink an EXISTING Domain to a different site
  const handleRelink = async (domainToMove: string) => {
    if (!canUseDomains)
      return toast.error("Upgrade your plan to manage custom domains.");
    if (!selectedSiteId)
      return toast.error("Select a 'Target Site' from the dropdown first.");

    setIsSubmitting(true);
    try {
      const res = await authFetch("/api/domains/relink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: domainToMove,
          newSiteId: selectedSiteId,
          uid: user?.uid,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Relink failed");

      toast.success(`${domainToMove} has been moved.`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Action: Unlink (delete) a domain entirely
  const handleUnlink = async (domain: string, siteId: string) => {
    if (!canUseDomains) return;
    if (
      !confirm(
        `Are you sure you want to unlink "${domain}"? This cannot be undone.`,
      )
    )
      return;

    setUnlinkingDomain(domain);
    try {
      const token = await user?.getIdToken();
      const res = await fetch("/api/domains/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ domain, siteId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unlink failed");

      toast.success(`${domain} has been unlinked.`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUnlinkingDomain(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <Globe className="text-primary" size={32} />
          Custom Domains
        </h1>
        <p className="text-slate-500 mt-2">
          Point your own domain to your {SITE_STANDARD_NAME} projects.
        </p>
      </div>

      {/* Plan Gate Banner */}
      {!canUseDomains && (
        <div className="mb-8 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 flex items-center gap-5">
          <div className="bg-amber-100 p-3 rounded-2xl shrink-0">
            <Lock className="text-amber-600" size={24} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-amber-900">
              Custom domains are a paid feature
            </p>
            <p className="text-sm text-amber-700 mt-0.5">
              Your current{" "}
              <span className="font-semibold capitalize">{userPlan}</span> plan
              doesn&apos;t include custom domains. Upgrade to Pro or higher to
              connect your own domain.
            </p>
          </div>
          <a
            href="/pricing"
            className="shrink-0 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-3 rounded-2xl text-sm transition-colors"
          >
            <Sparkles size={16} />
            Upgrade Plan
          </a>
        </div>
      )}

      <div
        className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${!canUseDomains ? "opacity-60 pointer-events-none select-none" : ""}`}
      >
        {/* LEFT: Connection Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border rounded-3xl p-6 shadow-sm">
            <h2 className="font-bold mb-4 ml-1">Connect New Domain</h2>
            <form onSubmit={handleConnectNew} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block ml-1">
                  1. Select Target Site
                </label>
                <select
                  required
                  value={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(e.target.value)}
                  disabled={!canUseDomains}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none text-sm transition-all bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="">Choose a site...</option>
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 mb-1 block ml-1">
                  2. Enter Domain
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. mysite.com"
                  value={domainInput}
                  disabled={!canUseDomains}
                  onChange={(e) => {
                    setDomainInput(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none text-sm bg-slate-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                disabled={isSubmitting || !canUseDomains}
                className={`w-full py-4 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 ${
                  status === "invalid"
                    ? "bg-red-500 shadow-red-200"
                    : "bg-primary hover:scale-[1.02]"
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : status === "invalid" ? (
                  "Retry Setup"
                ) : (
                  "Verify & Connect"
                )}
              </button>
            </form>

            {status === "invalid" && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3">
                <AlertCircle className="text-red-500 shrink-0" size={18} />
                <p className="text-[10px] text-red-700 leading-tight">
                  DNS Check Failed. Found records:{" "}
                  {foundRecords.join(", ") || "None"}. Point your A Record to
                  76.76.21.21.
                </p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
            <AlertCircle className="text-blue-500 shrink-0" size={20} />
            <p className="text-[10px] text-blue-700 leading-relaxed">
              Domain changes can take time to propagate. If your DNS is correct
              but verification fails, wait 5 minutes and try again.
            </p>
          </div>
        </div>

        {/* RIGHT: DNS Instructions */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <Globe
              className="absolute -right-10 -bottom-10 text-white/5"
              size={200}
            />
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 relative z-10">
              <Server size={24} className="text-primary" />
              Configure DNS Records
            </h2>

            <div className="space-y-4 relative z-10">
              <DNSRecordCard
                type="A Record"
                host="@"
                value="76.76.21.21"
                status={status}
                isA
                onCopy={copyToClipboard}
              />
              <DNSRecordCard
                type="CNAME Record"
                host="www"
                value="cname.vercel-dns.com"
                status={status}
                onCopy={copyToClipboard}
              />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: Domain Management List */}
      <div className="mt-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-2xl font-black">Your Managed Domains</h2>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        {managedDomains.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] py-20 text-center">
            <Globe size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">
              No domains connected to your account yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managedDomains.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-primary/5 p-3 rounded-2xl group-hover:bg-primary/10 transition-colors">
                    <Globe className="text-primary" size={24} />
                  </div>
                  <button
                    onClick={() =>
                      window.open(`https://${item.domain}`, "_blank")
                    }
                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                  >
                    <ExternalLink size={20} />
                  </button>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="font-bold text-xl truncate">{item.domain}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <LinkIcon size={12} />
                    Linked to:{" "}
                    <span className="font-bold text-slate-800">
                      {item.siteName}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Relink button — disabled on free plan */}
                  {canUseDomains ? (
                    <button
                      disabled={
                        isSubmitting ||
                        !selectedSiteId ||
                        item.siteId === selectedSiteId
                      }
                      onClick={() => handleRelink(item.domain)}
                      className="w-full py-3 bg-slate-50 hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-slate-50 disabled:hover:text-slate-900 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 uppercase tracking-tighter"
                    >
                      {isSubmitting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <RefreshCw size={14} />
                      )}
                      Relink to Selected Site
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 bg-slate-50 opacity-40 cursor-not-allowed rounded-2xl text-xs font-black flex items-center justify-center gap-2 uppercase tracking-tighter"
                    >
                      <Lock size={14} />
                      Relink (Paid Only)
                    </button>
                  )}

                  {/* Unlink button */}
                  {canUseDomains ? (
                    <button
                      disabled={unlinkingDomain === item.domain}
                      onClick={() => handleUnlink(item.domain, item.siteId)}
                      className="w-full py-3 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 disabled:opacity-40 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 uppercase tracking-tighter"
                    >
                      {unlinkingDomain === item.domain ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Unlink size={14} />
                      )}
                      {unlinkingDomain === item.domain
                        ? "Unlinking..."
                        : "Unlink Domain"}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 bg-red-50 opacity-40 cursor-not-allowed rounded-2xl text-xs font-black flex items-center justify-center gap-2 uppercase tracking-tighter text-red-400"
                    >
                      <Lock size={14} />
                      Unlink (Paid Only)
                    </button>
                  )}
                </div>

                {!selectedSiteId && canUseDomains && (
                  <p className="text-[9px] text-center mt-2 text-slate-400">
                    Select a site above to enable relinking
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for individual DNS record cards
function DNSRecordCard({ type, host, value, status, isA, onCopy }: any) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-2xl p-5 transition-all hover:border-primary/30">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">
          {type}
        </span>
        {status === "verifying" ? (
          <RefreshCw size={16} className="text-primary animate-spin" />
        ) : status === "valid" ? (
          <CheckCircle2 size={16} className="text-green-400" />
        ) : status === "invalid" && isA ? (
          <XCircle size={16} className="text-red-400" />
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
        )}
      </div>
      <div className="flex items-center justify-between bg-slate-950/50 rounded-xl p-4 border border-slate-700/50">
        <div className="grid grid-cols-2 gap-10">
          <div>
            <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">
              Host
            </p>
            <p className="font-mono text-sm">{host}</p>
          </div>
          <div>
            <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">
              Value
            </p>
            <p className="font-mono text-sm text-primary/90">{value}</p>
          </div>
        </div>
        <button
          onClick={() => onCopy(value)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
        >
          <Copy size={18} className="text-slate-500 group-hover:text-white" />
        </button>
      </div>
    </div>
  );
}
