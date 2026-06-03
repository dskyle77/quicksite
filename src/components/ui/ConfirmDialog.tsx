"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading,
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!mounted || !open) return null;

  const variantClasses = {
    danger: "bg-red-600 hover:bg-red-700 shadow-red-600/20",
    primary: "bg-primary hover:bg-primary/90 shadow-primary/20",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={loading ? undefined : onCancel}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3 className="text-xl font-black mb-2 text-foreground tracking-tight">
            {title}
          </h3>
        )}
        {message && (
          <div className="text-muted-foreground text-sm mb-8 leading-relaxed font-medium">
            {message}
          </div>
        )}
        <div className="flex gap-3">
          <button
            className="flex-1 h-12 rounded-2xl text-sm font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer disabled:opacity-50"
            onClick={loading ? undefined : onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            className={`flex-1 h-12 rounded-2xl text-sm font-bold text-white shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${variantClasses[variant]} ${
              loading ? "opacity-60 pointer-events-none" : ""
            }`}
            onClick={loading ? undefined : onConfirm}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
