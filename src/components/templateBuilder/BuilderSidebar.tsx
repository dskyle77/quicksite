/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { variantOptions } from "./contentBlocks";
import {
  BuilderConfig,
  SectionConfig,
  SectionVariantKey,
  SectionType,
} from "./types";

type BuilderSidebarProps = {
  config: BuilderConfig;
  onChange: (config: BuilderConfig) => void;
  open?: boolean;
  onClose?: () => void;
};

// ─── Design tokens ────────────────────────────────────────────────────────────
// Warm off-white surface (#faf9f7), slate typography, indigo accent.
// Distinct from a generic white canvas without going dark.

const cls = {
  card: "rounded-xl border border-stone-200 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md hover:border-stone-300",
  cardDisabled: "opacity-55 grayscale-[0.3] bg-stone-50",
  input:
    "w-full rounded-lg border border-stone-300 bg-stone-50 px-2.5 py-1.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/70 focus:border-indigo-400 transition disabled:opacity-40 disabled:cursor-not-allowed",
  inputError: "border-red-400 focus:ring-red-400/60 focus:border-red-400",
  label: "mb-1 block text-[10px] font-bold uppercase tracking-widest text-stone-400",
  btnBase:
    "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-400/50",
  btnGhost: "border border-stone-200 bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700",
  btnDanger: "border border-red-200 bg-red-50 text-red-500 hover:bg-red-100",
  btnDangerDisabled: "opacity-30 cursor-not-allowed",
  btnEnable: "border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
  btnDisable: "border border-stone-200 bg-stone-100 text-stone-500 hover:bg-stone-200",
};

// ─── Custom Select ────────────────────────────────────────────────────────────

const Select = <T extends string>({
  value,
  options,
  onChange,
  disabled,
}: {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  disabled?: boolean;
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      disabled={disabled}
      className={`${cls.input} appearance-none pr-8 cursor-pointer`}
    >
      {options?.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  </div>
);

// ─── SectionMenu ──────────────────────────────────────────────────────────────

export const SectionMenu: React.FC<{
  config: BuilderConfig;
  section: SectionConfig;
  index: number;
  onChange: (config: BuilderConfig) => void;
}> = ({ config, section, index, onChange }) => {
  const [inputValue, setInputValue] = React.useState(section.anchorName ?? "");
  const [showDuplicateError, setShowDuplicateError] = React.useState(false);

  const updateSection = (id: string, updates: Partial<SectionConfig>) => {
    onChange({
      ...config,
      sections: config.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  const removeSection = (id: string) => {
    onChange({ ...config, sections: config.sections.filter((s) => s.id !== id) });
  };

  const moveSection = (id: string, dir: "up" | "down") => {
    const idx = config.sections.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const arr = [...config.sections];
    const target = dir === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    onChange({ ...config, sections: arr });
    setTimeout(scrollTo)
  };

  const variants = variantOptions[section.type] as readonly SectionVariantKey[];

  const handleAnchorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const isDuplicate = config.sections.some(
      (s) =>
        s.id !== section.id &&
        s.anchorName?.toLowerCase().trim() === val.toLowerCase().trim(),
    );
    setShowDuplicateError(isDuplicate);
    if (!isDuplicate) updateSection(section.id, { anchorName: val });
  };

  useEffect(() => {
    setInputValue(section.anchorName ?? "");
  }, [section.anchorName]);

  const isDisabled = !section.enabled;
  const isFirst = index === 0;
  const isLast = index === config.sections.length - 1;
  const isOnly = config.sections.length === 1;

  const scrollTo = () => {
    if (!section.anchorName) return;
    const el = document.getElementById(section.anchorName);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.location.hash = `#${section.anchorName}`;
  };

  return (
    <div
      className={`${cls.card} ${isDisabled ? cls.cardDisabled : "cursor-pointer"}`}
      title={section.anchorName ? `Scroll to #${section.anchorName}` : ""}
      onClick={isDisabled ? undefined : scrollTo}
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={isDisabled ? undefined : (e) => { if (e.key === "Enter" || e.key === " ") scrollTo(); }}
      role="button"
      aria-disabled={isDisabled}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-3 gap-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex-1 min-w-0">
          <input
            className={`${cls.input} font-semibold ${showDuplicateError ? cls.inputError : ""}`}
            type="text"
            value={inputValue}
            onChange={handleAnchorInputChange}
            placeholder="anchor-name"
            spellCheck={false}
            autoComplete="off"
            disabled={isDisabled}
          />
          {showDuplicateError && (
            <p className="mt-1 text-[10px] text-red-500">Anchor name already in use.</p>
          )}
          <p className="mt-1 text-[9px] text-stone-300 font-mono">{section.id.slice(0, 8)}</p>
        </div>

        <div className="flex flex-col gap-1.5 items-end shrink-0">
          <button
            onClick={() => removeSection(section.id)}
            className={`${cls.btnBase} ${cls.btnDanger} ${isOnly || isDisabled ? cls.btnDangerDisabled : ""}`}
            disabled={isOnly || isDisabled}
            type="button"
            title="Remove section"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 18 18">
              <path d="M4 4l10 10M14 4L4 14" strokeLinecap="round" />
            </svg>
            Remove
          </button>

          <button
            onClick={() => updateSection(section.id, { enabled: !section.enabled })}
            className={`${cls.btnBase} ${section.enabled ? cls.btnDisable : cls.btnEnable}`}
            type="button"
          >
            {section.enabled ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 18 18">
                  <path d="M5 9l4 4 4-8" strokeLinecap="round" />
                </svg>
                Disable
              </>
            ) : (
              <>
                <svg className="w-3 h-3 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 18 18">
                  <circle cx="9" cy="9" r="7" />
                </svg>
                Enable
              </>
            )}
          </button>
        </div>
      </div>

      {/* VARIANT */}
      <div className="mb-3" onClick={(e) => e.stopPropagation()}>
        <label className={cls.label}>Variant</label>
        <Select
          value={section.variant}
          options={variants}
          onChange={(v) => updateSection(section.id, { variant: v })}
          disabled={isDisabled}
        />
      </div>

      {/* MOVE */}
      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => moveSection(section.id, "up")}
          disabled={isFirst || isDisabled}
          className={`${cls.btnBase} ${cls.btnGhost} flex-1 justify-center ${isFirst || isDisabled ? "opacity-30 cursor-not-allowed" : ""}`}
        >
          ↑ Up
        </button>
        <button
          onClick={() => moveSection(section.id, "down")}
          disabled={isLast || isDisabled}
          className={`${cls.btnBase} ${cls.btnGhost} flex-1 justify-center ${isLast || isDisabled ? "opacity-30 cursor-not-allowed" : ""}`}
        >
          ↓ Down
        </button>
      </div>
    </div>
  );
};

// ─── BuilderSidebar ───────────────────────────────────────────────────────────

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  config,
  onChange,
  open,
  onClose,
}) => {
  const updateRoot = (key: "navbar" | "hero" | "footer", value: string) => {
    onChange({ ...config, [key]: value });
  };

  const addSection = (type: string) => {
    if (!Object.keys(variantOptions).includes(type)) return;
    const stype = type as SectionType;
    const variants = variantOptions[stype] as readonly SectionVariantKey[];
    const newSectionId = crypto.randomUUID();
    const newSection: SectionConfig = {
      id: newSectionId,
      type: stype,
      variant: variants[0],
      enabled: true,
      anchorName: newSectionId + stype,
    };
    onChange({ ...config, sections: [...config.sections, newSection] });
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-x-0 bottom-0 top-16 z-40 bg-black/30 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={[
          "fixed left-0 top-16 z-50",
          "h-[calc(100vh-4rem)] w-full",
          "overflow-y-auto overflow-x-hidden border-r border-stone-200 bg-[#faf9f7]",
          "transform transition-transform duration-200 ease-out",
          "md:static md:top-auto md:z-auto md:h-full md:max-w-none md:shrink-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-[#faf9f7]">
          <div>
            <h2 className="text-sm font-bold text-stone-800 tracking-tight">🎨 Builder</h2>
            <p className="text-[10px] text-stone-400">Customize your sections</p>
          </div>
          <button
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-7">
          {/* GLOBAL LAYOUT */}
          <section>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
              Global Layout
            </h3>
            <div className="space-y-3">
              {(["navbar", "hero", "footer"] as const).map((key) => (
                <div key={key}>
                  <label className={cls.label}>{key}</label>
                  <Select
                    value={config[key]}
                    options={variantOptions[key] as any}
                    onChange={(v) => updateRoot(key, v)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* PAGE SECTIONS */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Page Sections
              </h3>
              <div className="relative">
                <select
                  className="appearance-none text-xs border border-stone-200 rounded-lg pl-2.5 pr-7 py-1 bg-white text-indigo-600 font-semibold shadow-sm hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 cursor-pointer transition"
                  onChange={(e) => { if (e.target.value) { addSection(e.target.value); e.target.value = ""; } }}
                >
                  <option value="">+ Add section</option>
                  {Object.keys(variantOptions).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-stone-400">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              {config.sections?.map((section, index) => (
                <SectionMenu
                  key={section.id}
                  config={config}
                  section={section}
                  index={index}
                  onChange={onChange}
                />
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
};