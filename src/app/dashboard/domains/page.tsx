/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useAuth } from "@/hooks/useAuth";
import {
  Globe,
  Server,
  CheckCircle2,
  Copy,
  Loader2,
  AlertCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function DomainsPage() {
  const { user } = useAuth();
  const { sites } = useDashboardStore();

  const SITE_STANDARD_NAME = process.env.NEXT_PUBLIC_SITE_STANDARD_NAME;

  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [domain, setDomain] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New States for Verification
  const [status, setStatus] = useState<"idle" | "verifying" | "valid" | "invalid">("idle");
  const [foundRecords, setFoundRecords] = useState<string[]>([]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedSiteId || !domain) {
      return toast.error("Please fill in all fields");
    }

    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domain)) {
      return toast.error("Please enter a valid domain");
    }

    setIsSubmitting(true);
    setStatus("verifying");

    try {
      // 1. Verify DNS First (Internal API)
      const verifyRes = await fetch("/api/domains/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.toLowerCase().trim() }),
      });
      
      const verification = await verifyRes.json();
      setFoundRecords(verification.found || []);

      if (!verification.isValid) {
        setStatus("invalid");
        throw new Error("DNS records do not match. See the instructions on the right.");
      }

      // 2. If DNS is valid, register with Vercel/Firestore
      setStatus("valid");
      const token = await user.getIdToken();
      const res = await fetch("/api/domains/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          siteId: selectedSiteId,
          domain: domain.toLowerCase().trim(),
          uid: user.uid,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register domain");

      toast.success("Domain linked successfully!");
      setDomain("");
      setStatus("idle");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="mb-10">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <Globe className="text-primary" size={32} />
          Custom Domains
        </h1>
        <p className="text-slate-500 mt-2">
          Connect your own domain to your {SITE_STANDARD_NAME} projects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleConnect} className="bg-white border rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <label className="text-sm font-bold block mb-2 ml-1">Select Site</label>
              <select
                required
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="">Choose a site...</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name} ({site.slug})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold block mb-2 ml-1">Domain Name</label>
              <input
                required
                type="text"
                placeholder="www.yourdomain.com"
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  if(status !== 'idle') setStatus('idle'); // Reset status on change
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <button
              disabled={isSubmitting}
              className={`w-full py-4 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                status === 'invalid' ? 'bg-red-500' : 'bg-primary hover:opacity-90'
              } disabled:opacity-50`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : status === 'invalid' ? "Retry Connection" : "Connect Domain"}
            </button>
          </form>

          {status === "invalid" && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3">
              <XCircle className="text-red-500 shrink-0" size={20} />
              <div>
                <p className="text-xs text-red-700 font-bold">Verification Failed</p>
                <p className="text-[10px] text-red-600 leading-tight">
                  We found: {foundRecords.length > 0 ? foundRecords.join(", ") : "no records"}. 
                  Ensure your DNS is updated and try again.
                </p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
            <AlertCircle className="text-blue-500 shrink-0" size={20} />
            <p className="text-xs text-blue-700">
              Domain propagation can take up to 24 hours.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Server size={24} className="text-primary" />
              Required DNS Settings
            </h2>

            <div className="space-y-4">
              {/* A Record */}
              <DNSRecordCard 
                type="A Record" 
                host="@" 
                value="76.76.21.21" 
                status={status} 
                isA 
                onCopy={copyToClipboard} 
              />
              {/* CNAME Record */}
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
    </div>
  );
}

// Sub-component for Cleaner Code
function DNSRecordCard({ type, host, value, status, isA, onCopy }: any) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-black uppercase tracking-widest text-primary">{type}</span>
        {status === "verifying" ? <RefreshCw size={16} className="text-slate-400 animate-spin" /> : 
         status === "valid" ? <CheckCircle2 size={16} className="text-green-500" /> : 
         status === "invalid" && isA ? <XCircle size={16} className="text-red-500" /> :
         <CheckCircle2 size={16} className="text-slate-600" />}
      </div>
      <div className="flex items-center justify-between bg-slate-900 rounded-lg p-3 border border-slate-700">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-[10px] text-slate-500 uppercase">Host</p>
            <p className="font-mono">{host}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase">Value</p>
            <p className="font-mono text-xs">{value}</p>
          </div>
        </div>
        <button onClick={() => onCopy(value)} className="p-2 hover:bg-slate-800 rounded-md">
          <Copy size={16} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}