/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Loader2, Mail, Trash2 } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center py-12">
        <Mail className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Messages</h2>
        <p className="text-center max-w-md mb-4">
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
          : "Uncategorized";
      if (!grouped[siteKey]) grouped[siteKey] = {};
      if (!grouped[siteKey][anchorKey]) grouped[siteKey][anchorKey] = [];
      grouped[siteKey][anchorKey].push(msg);
    });
    return grouped;
  }

  return (
    <div className="max-w-5xl mx-auto py-5 px-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full h-12 w-12 shadow-sm border border-primary/15">
          <Mail className="w-7 h-7" />
        </span>
        <h2 className="text-3xl font-bold tracking-tight">Inbox</h2>
      </div>
      <p className="mb-8 text-muted-foreground text-base">
        View and manage messages sent through your forms below.
      </p>
      {deleteError && (
        <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-2 flex items-center gap-2 text-sm text-red-700 shadow-sm">
          <span className="font-medium">Error:</span> {deleteError}
        </div>
      )}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin w-9 h-9 text-primary/60" />
        </div>
      ) : (
        <div className="w-full">
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
              <div>
                {Object.entries(grouped).map(([siteKey, anchors]) => (
                  <div key={siteKey} className="mb-10">
                    <div className="mb-4 flex items-center gap-2">
                      <span className="font-bold text-lg text-primary">
                        {siteKey}
                      </span>
                      <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                        {Object.values(anchors).reduce(
                          (sum, arr) => sum + arr.length,
                          0,
                        )}{" "}
                        message
                        {Object.values(anchors).reduce(
                          (sum, arr) => sum + arr.length,
                          0,
                        ) === 1
                          ? ""
                          : "s"}
                      </span>
                    </div>
                    {/* Group by anchorName under each site */}
                    {Object.entries(anchors).map(
                      ([anchorKey, anchorMessages]) => (
                        <div key={anchorKey} className="mb-6 ml-2">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-primary/70 text-base">
                              {anchorKey}
                            </span>
                            <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                              {anchorMessages.length} message
                              {anchorMessages.length === 1 ? "" : "s"}
                            </span>
                          </div>
                          <ul className="space-y-6">
                            {anchorMessages.map((msg) => (
                              <li
                                key={msg.id}
                                className="relative rounded-xl border border-border bg-card shadow-sm p-6 group transition hover:border-primary/80 flex flex-col"
                              >
                                <div className="flex flex-col md:flex-row md:justify-between gap-2 mb-2 relative">
                                  <div className="flex items-center gap-3">
                                    <span className="font-semibold text-lg">
                                      {msg.name ?? "Anonymous"}
                                    </span>
                                    {msg.email && (
                                      <a
                                        href={`mailto:${msg.email}`}
                                        className="ml-1 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-medium hover:underline"
                                        tabIndex={-1}
                                      >
                                        {msg.email}
                                      </a>
                                    )}
                                  </div>
                                  <span className="text-xs text-muted-foreground select-none">
                                    {new Date(msg.createdAt).toLocaleString(
                                      undefined,
                                      {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      },
                                    )}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mb-1">
                                  {msg.subject && (
                                    <div className="text-xs py-0.5 px-2 rounded bg-accent border font-medium text-accent-foreground">
                                      {msg.subject}
                                    </div>
                                  )}
                                </div>
                                <div className="mb-4 mt-2 text-base whitespace-pre-wrap text-neutral-900 dark:text-neutral-100 leading-relaxed">
                                  {msg.body}
                                </div>
                                {/* Delete icon at the bottom right */}
                                <div className="flex justify-end mt-auto">
                                  <button
                                    title="Delete message"
                                    className={`
                                      p-2 rounded-full border border-red-200 bg-white dark:bg-card shadow 
                                      hover:bg-red-600/10 transition 
                                      ${
                                        deletingId === msg.id
                                          ? "opacity-60 pointer-events-none"
                                          : "opacity-60 hover:opacity-100"
                                      }
                                    `}
                                    onClick={() => setPendingDeleteId(msg.id)}
                                    aria-label="Delete message"
                                    disabled={deletingId === msg.id}
                                    style={{ zIndex: 2 }}
                                  >
                                    {deletingId === msg.id ? (
                                      <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                                    ) : (
                                      <Trash2 className="w-5 h-5 text-red-500 hover:text-red-800" />
                                    )}
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ),
                    )}
                  </div>
                ))}
              </div>
            );
          })() : (
            <div className="py-20 text-center text-lg font-medium text-muted-foreground flex flex-col items-center gap-2">
              <Mail className="w-10 h-10 mb-2 text-muted-foreground/50" />
              <span>No messages received yet.</span>
              <span className="text-sm text-muted-foreground/80">
                Your inbox is waiting for its first message.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
