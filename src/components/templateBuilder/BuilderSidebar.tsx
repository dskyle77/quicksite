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

// Select component with outline for focus and always visible outline for discoverability
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
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      disabled={disabled}
      className="w-full rounded-lg border px-3 py-2 text-sm bg-white outline-blue-400 focus:outline-blue-500 focus:outline-4 disabled:bg-gray-100 disabled:text-gray-400"
      style={{ outlineOffset: "2px" }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
};

export const SectionMenu: React.FC<{
  config: BuilderConfig;
  section: SectionConfig;
  index: number;
  onChange: (config: BuilderConfig) => void;
}> = ({ config, section, index, onChange }) => {
  const [inputValue, setInputValue] = React.useState(section.anchorName ?? "");
  const [showDuplicateError, setShowDuplicateError] = React.useState(false);

  // Helper: update single section in config
  const updateSection = (id: string, updates: Partial<SectionConfig>) => {
    onChange({
      ...config,
      sections: config.sections.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      ),
    });
  };

  // Helper: remove section
  const removeSection = (id: string) => {
    onChange({
      ...config,
      sections: config.sections.filter((s) => s.id !== id),
    });
  };

  // Helper: move section up or down
  const moveSection = (id: string, dir: "up" | "down") => {
    const idx = config.sections.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const arr = [...config.sections];
    const target = dir === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    onChange({ ...config, sections: arr });
  };

  // Get variants for this section type
  const variants = variantOptions[section.type] as readonly SectionVariantKey[];

  // Handler for anchor input change
  const handleAnchorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnchorName = e.target.value;
    setInputValue(newAnchorName);

    // Check for duplicate
    const isDuplicate = config.sections.some(
      (s) =>
        s.id !== section.id &&
        s.anchorName?.toLowerCase().trim() ===
          newAnchorName.toLowerCase().trim(),
    );
    setShowDuplicateError(isDuplicate);

    if (!isDuplicate) {
      updateSection(section.id, { anchorName: newAnchorName });
    }
  };

  useEffect(() => {
    setInputValue(section.anchorName ?? "");
  }, [section.anchorName]);

  // If the section is disabled, all UI should look and act disabled (grayed out, not interactive)
  const isDisabled = !section.enabled;

  return (
    <div
      className={`rounded-xl border bg-gray-50 p-4 transition hover:shadow-md ${
        isDisabled ? "opacity-75 grayscale-[0.5] bg-gray-100" : "cursor-pointer"
      }`}
      title={section.anchorName ? `Go to #${section.anchorName}` : ""}
      onClick={
        isDisabled
          ? undefined
          : () => {
              if (section.anchorName) {
                const el = document.getElementById(section.anchorName);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  window.location.hash = `#${section.anchorName}`;
                }
              }
            }
      }
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={
        isDisabled
          ? undefined
          : (e) => {
              if ((e.key === "Enter" || e.key === " ") && section.anchorName) {
                const el = document.getElementById(section.anchorName);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  window.location.hash = `#${section.anchorName}`;
                }
              }
            }
      }
      role="button"
      aria-disabled={isDisabled}
    >
      {/* HEADER */}
      <div
        className="flex items-start justify-between mb-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <input
            className={`w-full font-semibold text-lg bg-white rounded border ${showDuplicateError ? "border-red-400" : "border-gray-300"}  px-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400  outline-blue-400 focus:outline-blue-500 focus:outline-4 ${
              isDisabled
                ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed placeholder-gray-300"
                : ""
            }`}
            style={{ outlineOffset: 2 }}
            type="text"
            value={inputValue}
            onChange={handleAnchorInputChange}
            placeholder="Anchor name"
            spellCheck={false}
            autoComplete="off"
            disabled={isDisabled}
            aria-disabled={isDisabled}
          />
          {showDuplicateError ? (
            <p className="mt-0.5 text-[11px] text-red-500">
              This anchor name is already used by another section.
            </p>
          ) : null}
          <p className="text-[10px] text-gray-400">{section.id.slice(0, 8)}</p>
        </div>
        <div className="flex flex-col gap-2 items-end min-w-[82px]">
          <button
            onClick={() => removeSection(section.id)}
            className={`flex items-center gap-1 text-xs font-semibold text-red-500 hover:bg-red-50 transition px-2 py-1 rounded outline-blue-400 focus:outline-blue-500 focus:outline-4 ${
              config.sections.length === 1 || isDisabled
                ? "opacity-30 cursor-not-allowed bg-red-100 text-red-300"
                : ""
            }`}
            style={{ outlineOffset: 1 }}
            disabled={config.sections.length === 1 || isDisabled}
            type="button"
            title="Remove this section"
            aria-disabled={config.sections.length === 1 || isDisabled}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 18 18"
            >
              <path d="M4 4l10 10M14 4L4 14" strokeLinecap="round" />
            </svg>
            Remove
          </button>

          {/* ENABLE / DISABLE TOGGLE */}
          <button
            onClick={() =>
              updateSection(section.id, {
                enabled: !section.enabled,
              })
            }
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition outline-blue-400 focus:outline-blue-500 focus:outline-4 ${
              section.enabled
                ? "text-gray-700 bg-gray-200 hover:bg-gray-300"
                : "text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-sm"
            }`}
            style={{ outlineOffset: 1 }}
            type="button"
            title={section.enabled ? "Disable section" : "Enable section"}
            // Removed disabled={isDisabled} so it remains clickable!
          >
            {section.enabled ? (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 18 18"
                >
                  <path d="M5 9l4 4 4-8" strokeLinecap="round" />
                </svg>
                Disable
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 18 18"
                >
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
        <label className="text-xs text-gray-500">Variant</label>
        <Select
          value={section.variant}
          options={variants}
          onChange={(v) => updateSection(section.id, { variant: v })}
          disabled={isDisabled}
        />
      </div>

      {/* ACTIONS */}
      <div
        className="flex justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => moveSection(section.id, "up")}
          disabled={index === 0 || isDisabled}
          className={`text-xs px-2 py-1 border rounded outline-blue-400 focus:outline-blue-500 focus:outline-4 ${
            index === 0 || isDisabled
              ? "opacity-30 cursor-not-allowed bg-gray-100 text-gray-300"
              : ""
          }`}
          style={{ outlineOffset: 1 }}
          aria-disabled={index === 0 || isDisabled}
        >
          ↑ Up
        </button>

        <button
          onClick={() => moveSection(section.id, "down")}
          disabled={index === config.sections.length - 1 || isDisabled}
          className={`text-xs px-2 py-1 border rounded outline-blue-400 focus:outline-blue-500 focus:outline-4 ${
            index === config.sections.length - 1 || isDisabled
              ? "opacity-30 cursor-not-allowed bg-gray-100 text-gray-300"
              : ""
          }`}
          style={{ outlineOffset: 1 }}
          aria-disabled={index === config.sections.length - 1 || isDisabled}
        >
          ↓ Down
        </button>
      </div>
    </div>
  );
};

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  config,
  onChange,
  open,
  onClose,
}) => {
  // ----------------------------
  // UPDATE ROOT
  // ----------------------------
  const updateRoot = (key: "navbar" | "hero" | "footer", value: string) => {
    onChange({ ...config, [key]: value });
  };

  // ----------------------------
  // ADD SECTION
  // ----------------------------
  const addSection = (type: string) => {
    if (!Object.keys(variantOptions).includes(type)) {
      return;
    }
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

    onChange({
      ...config,
      sections: [...config.sections, newSection],
    });
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-x-0 bottom-0 top-16 z-40 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-16 z-50
          h-[calc(100vh-4rem)] w-80 max-w-[min(20rem,85vw)]
          overflow-y-auto overflow-x-hidden border-r bg-white
          transform transition-transform duration-200 ease-out
          md:static md:top-auto md:z-auto md:h-full md:max-w-none md:shrink-0
          \${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">🎨 Builder</h2>
            <p className="text-xs text-gray-500">
              Customize your website sections
            </p>
          </div>

          <button
            className=" outline-blue-400 focus:outline-blue-500 focus:outline-4 rounded"
            style={{ outlineOffset: 1 }}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-8">
          {/* GLOBAL */}
          <section>
            <h3 className="text-sm font-semibold mb-3 text-gray-700">
              Global Layout
            </h3>

            <div className="space-y-3">
              {(["navbar", "hero", "footer"] as const).map((key) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 capitalize">
                    {key}
                  </label>
                  <Select
                    value={config[key]}
                    options={variantOptions[key] as any}
                    onChange={(v) => updateRoot(key, v)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* SECTIONS */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Page Sections
              </h3>

              <select
                className="text-xs border rounded px-2 py-1 bg-white  outline-blue-400 focus:outline-blue-500 focus:outline-4"
                style={{ outlineOffset: 1 }}
                onChange={(e) => e.target.value && addSection(e.target.value)}
              >
                <option value="">+ Add</option>
                {Object.keys(variantOptions).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {config.sections.map((section, index) => (
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
