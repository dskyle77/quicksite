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
} from "lucide-react";
import { toast } from "sonner";

export default function DomainsPage() {
  const { user } = useAuth();
  const { sites } = useDashboardStore();

  const SITE_STANDARD_NAME = process.env.NEXT_PUBLIC_SITE_STANDARD_NAME;

  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [domain, setDomain] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedSiteId || !domain) {
      return toast.error("Please fill in all fields");
    }

    // Basic domain validation
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domain)) {
      return toast.error("Please enter a valid domain (e.g., example.com)");
    }

    setIsSubmitting(true);
    try {
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
        {/* Left: Form Section */}
        <div className="lg:col-span-1 space-y-6">
          <form
            onSubmit={handleConnect}
            className="bg-white border rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div>
              <label className="text-sm font-bold block mb-2 ml-1">
                Select Site
              </label>
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
              <label className="text-sm font-bold block mb-2 ml-1">
                Domain Name
              </label>
              <input
                required
                type="text"
                placeholder="www.yourdomain.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <button
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Connect Domain"
              )}
            </button>
          </form>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
            <AlertCircle className="text-blue-500 shrink-0" size={20} />
            <p className="text-xs text-blue-700 leading-relaxed">
              Domain propagation can take up to 24 hours depending on your
              registrar.
            </p>
          </div>
        </div>

        {/* Right: DNS Instructions Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Server size={24} className="text-primary" />
              Required DNS Settings
            </h2>

            <p className="text-slate-400 text-sm mb-8">
              Log in to your domain provider (e.g. GoDaddy) and add these
              records to point your domain to our servers.
            </p>

            <div className="space-y-4">
              {/* A Record */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-primary">
                    A Record
                  </span>
                  <CheckCircle2 size={16} className="text-slate-600" />
                </div>
                <div className="flex items-center justify-between bg-slate-900 rounded-lg p-3 border border-slate-700">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">
                        Host
                      </p>
                      <p className="font-mono">@</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">
                        Value
                      </p>
                      <p className="font-mono">76.76.21.21</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard("76.76.21.21")}
                    className="p-2 hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <Copy size={16} className="text-slate-400" />
                  </button>
                </div>
              </div>

              {/* CNAME Record */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-primary">
                    CNAME Record
                  </span>
                  <CheckCircle2 size={16} className="text-slate-600" />
                </div>
                <div className="flex items-center justify-between bg-slate-900 rounded-lg p-3 border border-slate-700">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">
                        Host
                      </p>
                      <p className="font-mono">www</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase">
                        Value
                      </p>
                      <p className="font-mono text-xs">cname.vercel-dns.com</p>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard("cname.vercel-dns.com")}
                    className="p-2 hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <Copy size={16} className="text-slate-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
