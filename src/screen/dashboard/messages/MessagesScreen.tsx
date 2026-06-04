/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Loader2, Mail, Trash2, Zap, Globe, ArrowUpRight, Filter, ListFilter, MessageSquare, ListTodo } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import authFetch from "@/lib/authFetch";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type MessageField = {
  id: string;
  label: string;
  value: string | string[];
  type: string;
};

type Message = {
  id: string;
  name?: string;
  email?: string;
  subject?: string;
  body: string;
  createdAt: string;
  anchorName?: string;
  site?: string;
  messageType?: "contact" | "form";
  formTitle?: string;
  fields?: MessageField[];
};

export default function MessagesScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Filter States
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [selectedAnchor, setSelectedAnchor] = useState<string>("all");

  // State for dialog
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    authFetch("/api/messages")
      .then(async (res) => {
        if (!res.ok) throw new Error("Could not fetch messages");
        return res.json();
      })
      .then((data) => setMessages(data.messages ?? []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setDeleteError(null);
    try {
      const res = await authFetch(
        `/api/messages?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete message.");
      }
      setMessages((prev) =>
        prev ? prev.filter((msg) => msg.id !== id) : prev,
      );
      setPendingDeleteId(null);
    } catch (err: any) {
      setDeleteError(err?.message || "Failed to delete message.");
    } finally {
      setDeletingId(null);
    }
  };

  // Derived Filter Data
  const sites = useMemo(() => {
    if (!messages) return [];
    const siteSet = new Set(messages.map(m => m.site).filter(Boolean));
    return Array.from(siteSet) as string[];
  }, [messages]);

  const anchorsForSelectedSite = useMemo(() => {
    if (!messages) return [];
    const filtered = selectedSite === "all" ? messages : messages.filter(m => m.site === selectedSite);
    const anchorSet = new Set(filtered.map(m => m.anchorName).filter(Boolean));
    return Array.from(anchorSet) as string[];
  }, [messages, selectedSite]);

  const filteredMessages = useMemo(() => {
    if (!messages) return [];
    return messages.filter(m => {
      const siteMatch = selectedSite === "all" || m.site === selectedSite;
      const anchorMatch = selectedAnchor === "all" || m.anchorName === selectedAnchor;
      return siteMatch && anchorMatch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [messages, selectedSite, selectedAnchor]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="h-20 w-20 rounded-3xl bg-muted grid place-items-center mb-6">
          <Mail className="h-10 w-10 text-muted-foreground/20" />
        </div>
        <h2 className="font-black text-2xl mb-3 tracking-tight">Messages</h2>
        <p className="text-muted-foreground max-w-sm text-center text-sm font-medium">
          Sign in to see messages you receive from your portfolio forms.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Mail className="h-5 w-5 text-primary-foreground" />
             </div>
             <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
               Inbox
             </h2>
          </div>
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {messages?.length || 0} communications received across all sites
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-2xl border border-border/50">
            <div className="flex items-center gap-2 pl-2">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Site</span>
            </div>
            <select
              value={selectedSite}
              onChange={(e) => {
                setSelectedSite(e.target.value);
                setSelectedAnchor("all");
              }}
              className="bg-transparent text-sm font-bold pr-8 py-1.5 outline-none cursor-pointer"
            >
              <option value="all">All Sites</option>
              {sites.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-2xl border border-border/50">
            <div className="flex items-center gap-2 pl-2">
              <ListFilter className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Source</span>
            </div>
            <select
              value={selectedAnchor}
              onChange={(e) => setSelectedAnchor(e.target.value)}
              className="bg-transparent text-sm font-bold pr-8 py-1.5 outline-none cursor-pointer"
            >
              <option value="all">All Forms</option>
              {anchorsForSelectedSite.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {deleteError && (
        <div className="mb-8 p-5 rounded-3xl border border-red-500/20 bg-red-500/5 text-sm text-red-600 font-bold flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
            {deleteError}
          </div>
          <button onClick={() => setDeleteError(null)} className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100">Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
           <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-3xl border-4 border-primary/10" />
              <div className="absolute inset-0 rounded-3xl border-4 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary animate-pulse" />
              </div>
            </div>
          <div className="space-y-1 text-center">
            <p className="text-base font-black tracking-tight">Syncing Messages</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">Please wait a moment...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Confirm Delete Dialog */}
          <ConfirmDialog
            open={!!pendingDeleteId}
            title="Delete Permanently?"
            message="This will remove the message and all associated form data from our servers. You cannot undo this action."
            loading={!!deletingId}
            onCancel={() => (deletingId ? null : setPendingDeleteId(null))}
            onConfirm={() => {
              if (pendingDeleteId) {
                handleDelete(pendingDeleteId);
              }
            }}
          />

          {filteredMessages.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredMessages.map((msg) => {
                const isForm = msg.messageType === "form";
                
                return (
                  <div
                    key={msg.id}
                    className="group relative rounded-[2.5rem] border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 flex flex-col"
                  >
                    <div className="p-8 md:p-10">
                      {/* Top Metadata */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-5">
                          <div className="h-16 w-16 rounded-3xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center font-black text-primary text-2xl shadow-inner border border-primary/10">
                            {(msg.name ?? "A").charAt(0).toUpperCase()}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-black text-xl tracking-tight leading-none">
                              {msg.name ?? "Anonymous"}
                            </h4>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                              {msg.email && (
                                <a
                                  href={`mailto:${msg.email}`}
                                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5"
                                >
                                  {msg.email}
                                  <ArrowUpRight className="h-3 w-3" />
                                </a>
                              )}
                              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                <Globe className="h-3 w-3" />
                                {msg.site}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5">
                           <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isForm ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`}>
                             {isForm ? <ListTodo className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
                             {isForm ? "Form Submission" : "Direct Message"}
                           </div>
                           <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                             {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {new Date(msg.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                           </div>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="space-y-6">
                        {isForm && msg.formTitle && (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg border border-border/50 text-xs font-bold text-muted-foreground">
                            <Filter className="h-3 w-3" />
                            {msg.formTitle}
                          </div>
                        )}

                        {isForm && msg.fields && msg.fields.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {msg.fields.map((field, fIdx) => (
                              <div key={field.id || fIdx} className="bg-muted/30 p-5 rounded-2xl border border-border/20 group-hover:bg-muted/40 transition-colors">
                                <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground mb-2 opacity-70">
                                  {field.label}
                                </label>
                                <div className="text-sm font-bold text-foreground/90">
                                  {Array.isArray(field.value) ? (
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                      {field.value.map((val, vIdx) => (
                                        <span key={vIdx} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px]">{val}</span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="leading-relaxed">{field.value || "—"}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="relative">
                            {msg.subject && (
                              <h5 className="text-sm font-black mb-3 text-foreground/80">Re: {msg.subject}</h5>
                            )}
                            <div className="bg-muted/30 p-8 rounded-3xl border border-border/20 italic font-medium text-foreground/80 text-lg leading-relaxed group-hover:bg-muted/40 transition-colors">
                              &ldquo;{msg.body}&rdquo;
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 py-5 border-t border-border/30 bg-muted/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                          FROM: {msg.anchorName || "Global"}
                        </span>
                      </div>
                      <button
                        onClick={() => setPendingDeleteId(msg.id)}
                        disabled={deletingId === msg.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-destructive hover:bg-destructive/10 transition-all active:scale-95 group/del cursor-pointer"
                      >
                        {deletingId === msg.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 transition-transform group-hover/del:-rotate-12" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-card border border-border/50 rounded-4xl py-16 md:py-20 flex flex-col items-center justify-center text-center gap-10 shadow-inner overflow-hidden group">
              <div className="h-32 w-32 rounded-[2.5rem] bg-muted/30 flex items-center justify-center relative transition-transform duration-700 group-hover:scale-110">
                 <Mail className="h-12 w-12 text-muted-foreground/20" />
                 <div className="absolute top-0 right-0 h-4 w-4 bg-primary rounded-full animate-ping" />
              </div>
              
              <div className="space-y-4 max-w-sm px-6">
                <h2 className="font-black text-3xl tracking-tight">
                  Inbox Clear
                </h2>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  {selectedSite !== "all" || selectedAnchor !== "all" 
                    ? "No messages match your current filters. Try adjusting them to see more results."
                    : "Your inbox is looking fresh. Once visitors interact with your sites, their submissions will be displayed here."}
                </p>
              </div>

              {(selectedSite !== "all" || selectedAnchor !== "all") ? (
                <button
                  onClick={() => {
                    setSelectedSite("all");
                    setSelectedAnchor("all");
                  }}
                  className="px-8 h-12 rounded-2xl bg-secondary text-secondary-foreground font-black text-sm hover:bg-secondary/80 transition-all active:scale-95 cursor-pointer"
                >
                  Reset All Filters
                </button>
              ) : (
                <Link
                  href="/dashboard/sites"
                  className="inline-flex items-center gap-3 bg-primary text-primary-foreground rounded-2xl h-14 px-10 text-sm font-black shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-500 cursor-pointer"
                >
                  Launch a Site
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
