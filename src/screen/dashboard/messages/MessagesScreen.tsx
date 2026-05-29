/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Mail, Trash2, Zap, Globe, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfileStore } from "@/store/useProfileStore";
import authFetch from "@/lib/authFetch";

// Simple Dialog component for confirmation
function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      style={{ backdropFilter: "blur(2px)" }}
    >
      <div className="bg-white dark:bg-card rounded-xl p-6 max-w-sm w-full shadow-lg border border-border">
        {title && (
          <h3 className="text-lg font-semibold mb-2 text-red-600">{title}</h3>
        )}
        {message && <div className="text-base mb-5">{message}</div>}
        <div className="flex justify-end gap-3">
          <button
            className="px-3 py-2 rounded text-sm bg-muted text-muted-foreground hover:bg-accent"
            onClick={loading ? undefined : onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            className={`px-3 py-2 rounded text-sm bg-red-600 text-white hover:bg-red-700 transition ${loading ? "opacity-60 pointer-events-none" : ""}`}
            onClick={loading ? undefined : onConfirm}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin inline-block align-middle mr-1" />
            ) : null}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

type Message = {
  id: string;
  name?: string;
  email?: string;
  subject?: string;
  body: string;
  createdAt: string;
  anchorName?: string;
  site?: string;
};

export default function MessagesScreen() {
  const { user } = useAuth();
  const { profile } = useProfileStore();
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  // This now does not prompt; dialog handles confirmation
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

  // Utility function for grouping messages by site and anchorName
  function groupBySiteAndAnchorName(messages: Message[]) {
    const grouped: {
      [site: string]: {
        [anchor: string]: Message[];
      };
    } = {};
    messages.forEach((msg) => {
      const siteKey =
        typeof msg.site === "string" && msg.site.trim() !== ""
          ? msg.site
          : "Other";
      const anchorKey =
        typeof msg.anchorName === "string" && msg.anchorName.trim() !== ""
          ? msg.anchorName
          : "General Form";
      if (!grouped[siteKey]) grouped[siteKey] = {};
      if (!grouped[siteKey][anchorKey]) grouped[siteKey][anchorKey] = [];
      grouped[siteKey][anchorKey].push(msg);
    });
    return grouped;
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Inbox
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Manage leads and inquiries from your site forms.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <div className="px-4 py-2 bg-primary/10 rounded-xl border border-primary/20 text-[11px] font-bold text-primary uppercase tracking-widest">
             {messages?.length || 0} Total Messages
           </div>
        </div>
      </div>

      {deleteError && (
        <div className="mb-8 p-4 rounded-2xl border border-destructive/20 bg-destructive/5 text-sm text-destructive font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
          {deleteError}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
           <div className="relative">
              <div className="h-14 w-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary animate-pulse" />
              </div>
            </div>
          <p className="text-sm font-bold text-muted-foreground animate-pulse">Fetching your messages...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Confirm Delete Dialog */}
          <ConfirmDialog
            open={!!pendingDeleteId}
            title="Delete Message"
            message="Are you sure you want to delete this message? This action cannot be undone."
            loading={!!deletingId}
            onCancel={() => (deletingId ? null : setPendingDeleteId(null))}
            onConfirm={() => {
              if (pendingDeleteId) {
                handleDelete(pendingDeleteId);
              }
            }}
          />
          {messages && messages.length > 0 ? (() => {
            // Double-group: first by site, then by anchorName
            const grouped = groupBySiteAndAnchorName(messages);

            return (
              <div className="space-y-16">
                {Object.entries(grouped).map(([siteKey, anchors]) => (
                  <div key={siteKey} className="relative">
                    <div className="sticky top-20 z-10 py-4 bg-background/80 backdrop-blur-sm mb-6 flex items-center justify-between border-b border-border/50">
                      <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Globe className="h-4 w-4 text-primary" />
                         </div>
                         <h3 className="font-black text-xl tracking-tight text-foreground">
                           {siteKey}
                         </h3>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {Object.values(anchors).reduce(
                          (sum, arr) => sum + arr.length,
                          0,
                        )}{" "}
                        Messages
                      </span>
                    </div>

                    <div className="space-y-10 pl-4 md:pl-10 border-l-2 border-border/30 ml-4 md:ml-5">
                      {Object.entries(anchors).map(
                        ([anchorKey, anchorMessages]) => (
                          <div key={anchorKey} className="space-y-4 relative">
                            <div className="absolute -left-[21px] md:-left-[41px] top-0 h-4 w-4 rounded-full bg-background border-2 border-primary shadow-sm z-10" />
                            
                            <div className="flex items-center gap-2 mb-4">
                              <span className="font-bold text-muted-foreground text-sm uppercase tracking-widest">
                                {anchorKey}
                              </span>
                            </div>

                            <div className="grid gap-6">
                              {anchorMessages.map((msg) => (
                                <div
                                  key={msg.id}
                                  className="group relative rounded-4xl border border-border/50 bg-card shadow-sm p-8 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 flex flex-col"
                                >
                                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                    <div className="flex items-center gap-4">
                                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-lg shadow-inner">
                                        {(msg.name ?? "A").charAt(0).toUpperCase()}
                                      </div>
                                      <div className="space-y-0.5">
                                        <h4 className="font-black text-lg tracking-tight">
                                          {msg.name ?? "Anonymous"}
                                        </h4>
                                        {msg.email && (
                                          <a
                                            href={`mailto:${msg.email}`}
                                            className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1.5"
                                          >
                                            {msg.email}
                                            <ArrowUpRight className="h-3 w-3" />
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                                      <span className="bg-muted px-2 py-0.5 rounded-md">
                                        {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                      </span>
                                      <span>
                                        {new Date(msg.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                  </div>

                                  {msg.subject && (
                                    <div className="mb-4 text-xs font-black uppercase tracking-widest text-primary bg-primary/5 border border-primary/10 px-3 py-1 rounded-full w-fit">
                                      {msg.subject}
                                    </div>
                                  )}

                                  <div className="mb-8 text-base text-foreground/90 leading-relaxed font-medium whitespace-pre-wrap bg-muted/30 p-6 rounded-2xl border border-border/30 italic">
                                    &quot;{msg.body}&quot;
                                  </div>

                                  <div className="flex justify-end pt-4 border-t border-border/50">
                                    <button
                                      onClick={() => setPendingDeleteId(msg.id)}
                                      disabled={deletingId === msg.id}
                                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-all active:scale-95 cursor-pointer"
                                    >
                                      {deletingId === msg.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <>
                                          <Trash2 className="w-4 h-4" />
                                          Delete Message
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })() : (
            <div className="bg-card border border-border/50 rounded-[2.5rem] p-24 flex flex-col items-center justify-center text-center gap-8 shadow-inner relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 bg-primary/5 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="h-24 w-24 rounded-3xl bg-muted/50 flex items-center justify-center relative">
                 <Mail className="h-10 w-10 text-muted-foreground/30" />
              </div>
              
              <div className="space-y-3 max-w-sm">
                <h2 className="font-black text-2xl tracking-tight">
                  No messages yet
                </h2>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed text-center">
                  Your inbox is currently empty. Once people start filling out forms on your sites, their messages will appear here.
                </p>
              </div>
              
              <Link
                href="/dashboard/sites"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-2xl h-12 px-10 text-sm font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer"
              >
                View Your Sites
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
