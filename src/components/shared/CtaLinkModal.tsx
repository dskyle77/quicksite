"use client";

import { useState, useRef, useEffect } from "react";
import { useSiteDisplayStore } from "@/store/useSiteDisplayStore";
// ─── Types ────────────────────────────────────────────────────────────────────

export type LinkConfig = {
  type: "whatsapp" | "url";
  phone?: string;
  message?: string;
  url?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function buildHref(config?: LinkConfig): string {
  if (!config) return "#";
  if (config.type === "whatsapp") {
    const phone = (config.phone ?? "").replace(/\D/g, "");
    const msg = encodeURIComponent(config.message ?? "");
    return phone ? `https://wa.me/${phone}${msg ? `?text=${msg}` : ""}` : "#";
  }
  return config.url || "#";
}

// ─── LinkConfigMenu ───────────────────────────────────────────────────────────

interface LinkConfigMenuProps {
  value?: LinkConfig;
  onChange: (cfg: LinkConfig) => void;
  onClose: () => void;
}

function LinkConfigMenu({ value, onChange, onClose }: LinkConfigMenuProps) {
  const [tab, setTab] = useState<"whatsapp" | "url">(value?.type ?? "whatsapp");
  const [phone, setPhone] = useState(value?.phone ?? "");
  const [message, setMessage] = useState(value?.message ?? "");
  const [url, setUrl] = useState(value?.url ?? "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const handleSave = () => {
    onChange(
      tab === "whatsapp"
        ? { type: "whatsapp", phone, message }
        : { type: "url", url },
    );
    onClose();
  };

  // WhatsApp Branding Colors
  const WA_GREEN = "#25D366";
  const WA_TEAL = "#075E54";
  const WA_LIGHT_GREEN = "#DCF8C6";

  // Render as a true popup modal with overlay centred in the screen
  return (
    <div className="fixed inset-0 flex items-center justify-center z-9999">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close popup"
        tabIndex={-1}
      />

      <div
        ref={ref}
        className="relative w-[22rem] max-w-[95vw] rounded-3xl shadow-2xl p-5 transition-all animate-in fade-in zoom-in duration-200"
        style={{
          background: "var(--qs-bg)",
          border: `1px solid ${tab === "whatsapp" ? WA_GREEN : "var(--qs-border)"}`,
        }}
        onMouseDown={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Tabs */}
        <div
          className="mb-4 flex rounded-xl p-1 text-sm font-medium"
          style={{ background: "var(--qs-bg-alt)" }}
        >
          {(["whatsapp", "url"] as const).map((t) => {
            const isActive = tab === t;
            const isWhatsAppTab = t === "whatsapp";

            return (
              <button
                key={t}
                className="flex-1 rounded-lg py-1.5 capitalize transition-all"
                style={
                  isActive
                    ? {
                        background: isWhatsAppTab ? WA_TEAL : "var(--qs-primary)",
                        color: "#FFFFFF",
                      }
                    : { color: "var(--qs-text-muted)" }
                }
                onClick={() => setTab(t)}
              >
                {isWhatsAppTab ? "📱 WhatsApp" : "🔗 Custom URL"}
              </button>
            );
          })}
        </div>

        {tab === "whatsapp" ? (
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#075E54]">
                WhatsApp Number
              </label>
              <input
                type="tel"
                placeholder="e.g. 2348012345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl px-3 py-2 text-sm outline-none border transition-focus"
                style={{
                  background: WA_LIGHT_GREEN,
                  borderColor: WA_GREEN,
                  color: "#128C7E",
                }}
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#075E54]">
                Pre-filled Message
              </label>
              <textarea
                placeholder="Hi, I'd like to get started…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl px-3 py-2 text-sm outline-none border"
                style={{
                  background: "#FFFFFF",
                  borderColor: WA_GREEN,
                  color: "#444",
                }}
              />
            </div>
          </div>
        ) : (
          <div>
            <label
              className="mb-1 block text-xs font-semibold"
              style={{ color: "var(--qs-text-muted)" }}
            >
              URL
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-sm outline-none"
              style={{
                background: "var(--qs-bg-alt)",
                border: "1px solid var(--qs-border)",
                color: "var(--qs-text)",
              }}
            />
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button
            className="flex-1 rounded-xl py-2 text-sm font-bold transition-all active:scale-95"
            style={{
              background: tab === "whatsapp" ? WA_GREEN : "var(--qs-primary)",
              color: tab === "whatsapp" ? "#fff" : "var(--qs-primary-fg)",
              boxShadow:
                tab === "whatsapp" ? "0 2px 8px rgba(37, 211, 102, 0.3)" : "none",
            }}
            onClick={handleSave}
          >
            {tab === "whatsapp" ? "Set WhatsApp Link" : "Save URL"}
          </button>
          <button
            className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-black/5"
            style={{
              background: "transparent",
              color: "var(--qs-text-muted)",
            }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
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
}

export default function CtaLink({
  isEditor,
  label,
  linkConfig,
  onLabelChange,
  onLinkChange,
  className,
  style,
}: CtaLinkProps) {
  const { slug } = useSiteDisplayStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  const href = buildHref(linkConfig);

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
        />
      )}
    </span>
  );
}
