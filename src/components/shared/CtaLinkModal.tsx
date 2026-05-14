"use client";

import { useState, useRef, useEffect } from "react";

import { createPortal } from "react-dom";
import { useSiteDisplayStore } from "@/store/useSiteDisplayStore";
// ─── Types ────────────────────────────────────────────────────────────────────

export type LinkConfig = {
  type: "whatsapp" | "url";
  phone?: string;
  message?: string;
  url?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function buildHref(
  config?: LinkConfig,
  messageOverride?: string,
): string {
  if (!config) return "#";
  if (config.type === "whatsapp") {
    const phone = (config.phone ?? "").replace(/\D/g, "");
    const msg =
      typeof messageOverride === "string"
        ? encodeURIComponent(messageOverride)
        : encodeURIComponent(config.message ?? "");
    return phone ? `https://wa.me/${phone}${msg ? `?text=${msg}` : ""}` : "#";
  }
  return config.url || "#";
}

// ─── LinkConfigMenu ───────────────────────────────────────────────────────────

interface LinkConfigMenuProps {
  value?: LinkConfig;
  onChange: (cfg: LinkConfig) => void;
  onClose: () => void;
  messageOverride?: string;
}

function LinkConfigMenu({
  value,
  onChange,
  onClose,
  messageOverride,
}: LinkConfigMenuProps) {
  const [tab, setTab] = useState<"whatsapp" | "url">(value?.type ?? "whatsapp");
  const [phone, setPhone] = useState(value?.phone ?? "");
  const [message, setMessage] = useState(value?.message ?? "");
  const [url, setUrl] = useState(value?.url ?? "");

  const ref = useRef<HTMLDivElement>(null);

  // WhatsApp branding
  const WA_GREEN = "#25D366";
  const WA_TEAL = "#075E54";
  const WA_LIGHT_GREEN = "#DCF8C6";

  // Close on outside click (cleaner + safer)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleSave = () => {
    if (tab === "whatsapp") {
      onChange({
        type: "whatsapp",
        phone,
        message: messageOverride ?? message,
      });
    } else {
      onChange({
        type: "url",
        url,
      });
    }

    onClose();
  };

  // Prevent SSR crash
  if (typeof window === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-99999 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
        className="relative w-88 max-w-[95vw] rounded-3xl shadow-2xl p-5 animate-in fade-in zoom-in duration-200"
        style={{
          background: "#fff",
          border: `1px solid ${
            tab === "whatsapp" ? "#25D366" : "#e5e7eb"
          }`,
        }}
      >
        {/* Tabs */}
        <div
          className="mb-4 flex rounded-xl p-1 text-sm font-medium"
          style={{ background: "#f9fafb" }}
        >
          {(["whatsapp", "url"] as const).map((t) => {
            const isActive = tab === t;
            const isWhatsAppTab = t === "whatsapp";

            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 rounded-lg py-1.5 capitalize"
                style={{
                  background: isActive
                    ? isWhatsAppTab
                      ? "#075E54"
                      : "#0051ff"
                    : "transparent",
                  color: isActive ? "#fff" : "#6B7280",
                }}
              >
                {isWhatsAppTab ? "📱 WhatsApp" : "🔗 Custom URL"}
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        {tab === "whatsapp" ? (
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-[#075E54]">
                WhatsApp Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="2348012345678"
                className="w-full rounded-xl px-3 py-2 text-sm border outline-none"
                style={{
                  background: "#DCF8C6",
                  borderColor: "#25D366",
                  color: "#128C7E",
                }}
              />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase text-[#075E54]">
                Pre-filled Message
              </label>

              <textarea
                rows={3}
                value={messageOverride ?? message}
                onChange={
                  messageOverride
                    ? undefined
                    : (e) => setMessage(e.target.value)
                }
                readOnly={messageOverride !== undefined}
                className="w-full resize-none rounded-xl px-3 py-2 text-sm border outline-none"
                style={{
                  background: "#fff",
                  borderColor: "#25D366",
                  color: "#444",
                }}
              />

              {messageOverride && (
                <p className="mt-1 text-[10px] text-gray-500 italic">
                  Message is locked by system
                </p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#6B7280]">
              URL
            </label>

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-xl px-3 py-2 text-sm border outline-none"
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                color: "#121212",
              }}
            />
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 rounded-xl py-2 text-sm font-bold active:scale-95"
            style={{
              background: tab === "whatsapp" ? "#25D366" : "#0051ff",
              color: "#fff",
              boxShadow:
                tab === "whatsapp"
                  ? "0 2px 8px rgba(37, 211, 102, 0.3)"
                  : "none",
            }}
          >
            {tab === "whatsapp" ? "Set WhatsApp Link" : "Save URL"}
          </button>

          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm text-[#6B7280]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
// ─── CtaLink (default export) ─────────────────────────────────────────────────

export interface CtaLinkProps {
  isEditor: boolean;
  label: string;
  linkConfig?: LinkConfig;
  onLabelChange: (label: string) => void;
  onLinkChange: (cfg: LinkConfig) => void;
  className?: string;
  style?: React.CSSProperties;
  messageOverride?: string;
}

export default function CtaLink({
  isEditor,
  label,
  linkConfig,
  onLabelChange,
  onLinkChange,
  className,
  style,
  messageOverride,
}: CtaLinkProps) {
  const { slug } = useSiteDisplayStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  const href = buildHref(linkConfig, messageOverride);

  const handleClick = () => {
    if (linkConfig?.type !== "whatsapp") return;

    fetch("api/analytics/whatsapp-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
  };

  if (!isEditor) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
        onClick={handleClick}
      >
        {label}
      </a>
    );
  }

  return (
    <span ref={wrapRef} className="relative inline-flex flex-col items-center">
      <span className="inline-flex items-center gap-1">
        <span
          className={className}
          style={style}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) =>
            onLabelChange(e.currentTarget.textContent?.trim() ?? label)
          }
        >
          {label}
        </span>
        <button
          title="Edit link"
          className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-xs transition-transform hover:scale-110"
          style={{
            background:
              linkConfig?.type === "whatsapp" ? "#25D366" : "var(--qs-bg-alt)",
            border: "1px solid var(--qs-border)",
            color:
              linkConfig?.type === "whatsapp" ? "#fff" : "var(--qs-text-muted)",
            flexShrink: 0,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
        >
          {linkConfig?.type === "whatsapp" ? "📱" : "🔗"}
        </button>
      </span>

      {linkConfig && (
        <span
          className="truncate max-w-[160px] text-[10px] font-medium absolute -bottom-3"
          style={{
            color:
              linkConfig.type === "whatsapp"
                ? "#128C7E"
                : "var(--qs-text-muted)",
          }}
        >
          {linkConfig.type === "whatsapp"
            ? `wa.me/${linkConfig.phone ?? ""}`
            : (linkConfig.url ?? "")}
        </span>
      )}

      {menuOpen && (
        <LinkConfigMenu
          value={linkConfig}
          onChange={onLinkChange}
          onClose={() => setMenuOpen(false)}
          messageOverride={messageOverride}
        />
      )}
    </span>
  );
}
