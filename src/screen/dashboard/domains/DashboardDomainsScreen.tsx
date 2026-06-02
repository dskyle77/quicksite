/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useProfileStore } from "@/store/useProfileStore";
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

// Custom Confirm Dialog Modal
function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-card text-card-foreground rounded-2xl p-6 shadow-xl w-full max-w-sm border border-border flex flex-col items-stretch">
        <h2 className="font-bold text-lg mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mb-5">{description}</p>
        )}
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-muted hover:bg-accent hover:text-accent-foreground text-muted-foreground font-bold text-xs uppercase tracking-wide transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-destructive hover:opacity-90 text-white font-bold text-xs uppercase tracking-wide transition-all cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardDomainsScreen() {
  const { user } = useAuth();
  const { profile } = useProfileStore();
  const userPlan = profile?.plan || "free";

  const { sites, fetchSites } = useDashboardStore();
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

  // Custom Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    domain: string | null;
    siteId: string | null;
  }>({ open: false, domain: null, siteId: null });

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

  useEffect(() => {
    if (user?.uid && typeof fetchSites === "function") {
      fetchSites(user.uid);
    }
  }, [user?.uid, fetchSites]);

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
      setIsSubmitting(true);
      setStatus("verifying");
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

      if (!res.ok || data?.isValid === false) {
        setStatus("invalid");
        throw new Error(data.error || "Registration failed");
      }
      setFoundRecords(data.found || []);

      setStatus("idle");
      toast.success("Domain connected successfully!");
      setDomainInput("");
    } catch (error: any) {
      toast.error(error?.message || "Failed to connect domain.");
    }
    checkFinally: {
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

    setConfirmDialog({
      open: true,
      domain,
      siteId,
    });
  };

  // When user confirms in custom dialog
  const handleUnlinkConfirm = async () => {
    if (!canUseDomains || !confirmDialog.domain || !confirmDialog.siteId) {
      setConfirmDialog({ open: false, domain: null, siteId: null });
      return;
    }

    setUnlinkingDomain(confirmDialog.domain);
    setConfirmDialog({ open: false, domain: null, siteId: null });
    try {
      const token = await user?.getIdToken();
      const res = await fetch("/api/domains/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          domain: confirmDialog.domain,
          siteId: confirmDialog.siteId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unlink failed");

      toast.success(`${confirmDialog.domain} has been unlinked.`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUnlinkingDomain(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-10 px-4 text-foreground bg-background">
      {/* Header */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-black flex items-center gap-3">
          <Globe className="text-primary" size={32} />
          Custom Domains
        </h1>
        <p className="text-muted-foreground text-sm mt-2">
          Point your own domain to your {SITE_STANDARD_NAME} projects.
        </p>
      </div>

      {/* Plan Gate Banner */}
      {!canUseDomains && (
        <div className="mb-8 bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-5">
          <div className="bg-amber-500/20 dark:bg-amber-500/10 p-3 rounded-xl shrink-0">
            <Lock className="text-amber-600 dark:text-amber-400" size={24} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-amber-900 dark:text-amber-200">
              Custom domains are a paid feature
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-0.5">
              Your current{" "}
              <span className="font-semibold capitalize">{userPlan}</span> plan
              doesn&apos;t include custom domains. Upgrade to Pro or higher to
              connect your own domain.
            </p>
          </div>
          <a
            href="/pricing"
            className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:opacity-90 font-bold px-5 py-3 rounded-xl text-sm transition-all"
          >
            <Sparkles size={16} />
            Upgrade Plan
          </a>
        </div>
      )}

      <div
        className={`grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 ${!canUseDomains ? "opacity-60 pointer-events-none select-none" : ""}`}
      >
        {/* LEFT: Connection Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-xs">
            <h2 className="font-bold text-lg mb-4 ml-1">Connect New Domain</h2>
            <form onSubmit={handleConnectNew} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-black text-muted-foreground mb-1 block ml-1">
                  1. Select Target Site
                </label>
                <select
                  required
                  value={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(e.target.value)}
                  disabled={!canUseDomains}
                  className="input"
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
                <label className="text-[10px] uppercase font-black text-muted-foreground mb-1 block ml-1">
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
                  className="input"
                />
              </div>

              <button
                disabled={isSubmitting || !canUseDomains}
                className={`w-full py-3.5 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                  status === "invalid"
                    ? "bg-destructive shadow-destructive/20"
                    : "bg-primary hover:opacity-90 shadow-primary/10"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : status === "invalid" ? (
                  "Retry Setup"
                ) : (
                  "Verify & Connect"
                )}
              </button>
            </form>

            {status === "invalid" && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex gap-3">
                <AlertCircle className="text-destructive shrink-0" size={18} />
                <p className="text-xs text-destructive dark:text-red-400 leading-tight">
                  DNS Check Failed. Found records:{" "}
                  {foundRecords.join(", ") || "None"}. Point your A Record to
                  76.76.21.21.
                </p>
              </div>
            )}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3">
            <AlertCircle className="text-primary shrink-0" size={20} />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Domain changes can take time to propagate. If your DNS is correct
              but verification fails, wait 5 minutes and try again.
            </p>
          </div>
        </div>

        {/* RIGHT: DNS Instructions */}
        <div className="lg:col-span-2">
          <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden">
            <Globe
              className="absolute -right-10 -bottom-10 text-muted/10 pointer-events-none"
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
      <div className="mt-12 md:mt-16">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-xl md:text-2xl font-black whitespace-nowrap">
            Your Managed Domains
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        {managedDomains.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-2xl py-16 md:py-20 text-center">
            <Globe
              size={48}
              className="mx-auto text-muted-foreground/30 mb-4"
            />
            <p className="text-muted-foreground text-sm font-medium">
              No domains connected to your account yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managedDomains.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="bg-primary/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <Globe className="text-primary" size={22} />
                  </div>
                  <button
                    onClick={() =>
                      window.open(`https://${item.domain}`, "_blank")
                    }
                    className="p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <ExternalLink size={18} />
                  </button>
                </div>

                <div className="space-y-1 mb-5">
                  <h3 className="font-bold text-lg truncate">{item.domain}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <LinkIcon size={12} />
                    Linked to:{" "}
                    <span className="font-bold text-card-foreground">
                      {item.siteName}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Relink button */}
                  {canUseDomains ? (
                    <button
                      disabled={
                        isSubmitting ||
                        !selectedSiteId ||
                        item.siteId === selectedSiteId
                      }
                      onClick={() => handleRelink(item.domain)}
                      className="w-full py-2.5 bg-muted hover:bg-primary hover:text-white dark:text-muted-foreground dark:hover:text-white disabled:opacity-30 disabled:hover:bg-muted disabled:hover:text-muted-foreground rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 uppercase tracking-tight cursor-pointer"
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
                      className="w-full py-2.5 bg-muted opacity-40 cursor-not-allowed rounded-xl text-xs font-black flex items-center justify-center gap-2 uppercase tracking-tight"
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
                      className="w-full py-2.5 bg-destructive/10 hover:bg-destructive hover:text-white text-destructive dark:text-red-400 dark:hover:text-white disabled:opacity-40 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 uppercase tracking-tight cursor-pointer"
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
                      className="w-full py-2.5 bg-destructive/5 opacity-40 cursor-not-allowed rounded-xl text-xs font-black flex items-center justify-center gap-2 uppercase tracking-tight text-destructive"
                    >
                      <Lock size={14} />
                      Unlink (Paid Only)
                    </button>
                  )}
                </div>

                {!selectedSiteId && canUseDomains && (
                  <p className="text-[10px] text-center mt-3 text-muted-foreground">
                    Select a site above to enable relinking
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        title="Unlink Domain"
        description={
          confirmDialog.domain
            ? `Are you sure you want to unlink "${confirmDialog.domain}"? This cannot be undone.`
            : undefined
        }
        confirmText="Unlink"
        cancelText="Cancel"
        onCancel={() =>
          setConfirmDialog({ open: false, domain: null, siteId: null })
        }
        onConfirm={handleUnlinkConfirm}
      />
    </div>
  );
}

// Sub-component for individual DNS record cards
function DNSRecordCard({ type, host, value, status, isA, onCopy }: any) {
  return (
    <div className="bg-muted/30 border border-border rounded-xl p-4 md:p-5 transition-all hover:border-primary/40">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
          {type}
        </span>
        {status === "verifying" ? (
          <RefreshCw size={16} className="text-primary animate-spin" />
        ) : status === "valid" ? (
          <CheckCircle2 size={16} className="text-green-500" />
        ) : status === "invalid" && isA ? (
          <XCircle size={16} className="text-destructive" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
        )}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-background rounded-xl p-3.5 border border-border gap-3 sm:gap-6">
        <div className="flex gap-8 md:gap-12">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
              Host
            </p>
            <p className="font-mono text-sm break-all">{host}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
              Value
            </p>
            <p className="font-mono text-sm text-primary font-semibold break-all">
              {value}
            </p>
          </div>
        </div>
        <button
          onClick={() => onCopy(value)}
          className="self-end sm:self-center p-2 hover:bg-muted rounded-lg transition-colors group cursor-pointer"
        >
          <Copy
            size={16}
            className="text-muted-foreground group-hover:text-foreground"
          />
        </button>
      </div>
    </div>
  );
}
