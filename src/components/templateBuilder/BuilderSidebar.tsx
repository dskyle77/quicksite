/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { variantOptions } from "./variantOptions";
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

const Select = <T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full rounded-lg border px-3 py-2 text-sm outline-none bg-white"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
};

export const BuilderSidebar: React.FC<BuilderSidebarProps> = ({
  config,
  onChange,
  open = true,
  onClose,
}) => {
  // ----------------------------
  // UPDATE ROOT
  // ----------------------------
  const updateRoot = (key: "navbar" | "hero" | "footer", value: string) => {
    onChange({ ...config, [key]: value });
  };

  // ----------------------------
  // UPDATE SECTION
  // ----------------------------
  const updateSection = (id: string, updates: Partial<SectionConfig>) => {
    onChange({
      ...config,
      sections: config.sections.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      ),
    });
  };

  // ----------------------------
  // ADD SECTION
  // ----------------------------
  const addSection = (type: string) => {
    // Validate that type is actually a SectionType
    if (!Object.keys(variantOptions).includes(type)) {
      return;
    }
    const stype = type as SectionType;
    const variants = variantOptions[stype] as readonly SectionVariantKey[];
    const newSection: SectionConfig = {
      id: crypto.randomUUID(),
      type: stype,
      variant: variants[0],
      enabled: true,
    };

    onChange({
      ...config,
      sections: [...config.sections, newSection],
    });
  };

  // ----------------------------
  // REMOVE SECTION
  // ----------------------------
  const removeSection = (id: string) => {
    onChange({
      ...config,
      sections: config.sections.filter((s) => s.id !== id),
    });
  };

  // ----------------------------
  // MOVE SECTION
  // ----------------------------
  const moveSection = (id: string, dir: "up" | "down") => {
    const idx = config.sections.findIndex((s) => s.id === id);
    if (idx === -1) return;

    const arr = [...config.sections];
    const target = dir === "up" ? idx - 1 : idx + 1;

    if (target < 0 || target >= arr.length) return;

    [arr[idx], arr[target]] = [arr[target], arr[idx]];

    onChange({ ...config, sections: arr });
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          h-full w-[340px]
          transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          overflow-y-auto border-r bg-white
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

          <button onClick={onClose}>
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
                className="text-xs border rounded px-2 py-1 bg-white"
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
              {config.sections.map((section, index) => {
                const variants = variantOptions[
                  section.type
                ] as readonly SectionVariantKey[];

                return (
                  <div
                    key={section.id}
                    className="rounded-xl border bg-gray-50 p-4"
                  >
                    {/* HEADER */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link
                          className="font-medium capitalize text-xl"
                          href={"#" + section.type}
                        >
                          {section.type}
                        </Link>
                        <p className="text-[10px] text-gray-400">
                          {section.id.slice(0, 8)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-end min-w-[82px]">
                        <button
                          onClick={() => removeSection(section.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:bg-red-50 transition px-2 py-1 rounded disabled:opacity-30"
                          disabled={config.sections.length === 1}
                          type="button"
                          title="Remove this section"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 18 18"
                          >
                            <path
                              d="M4 4l10 10M14 4L4 14"
                              strokeLinecap="round"
                            />
                          </svg>
                          Remove
                        </button>
                        <button
                          onClick={() =>
                            updateSection(section.id, {
                              enabled: !section.enabled,
                            })
                          }
                          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition ${
                            section.enabled
                              ? "text-gray-700 bg-gray-200 hover:bg-gray-300"
                              : "text-gray-400 bg-gray-100 hover:bg-gray-200"
                          }`}
                          type="button"
                          title={
                            section.enabled
                              ? "Disable section"
                              : "Enable section"
                          }
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
                                className="w-3.5 h-3.5"
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
                    <div className="mb-3">
                      <label className="text-xs text-gray-500">Variant</label>
                      <Select
                        value={section.variant}
                        options={variants}
                        onChange={(v) =>
                          updateSection(section.id, { variant: v })
                        }
                      />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-between">
                      <button
                        onClick={() => moveSection(section.id, "up")}
                        disabled={index === 0}
                        className="text-xs px-2 py-1 border rounded disabled:opacity-30"
                      >
                        ↑ Up
                      </button>

                      <button
                        onClick={() => moveSection(section.id, "down")}
                        disabled={index === config.sections.length - 1}
                        className="text-xs px-2 py-1 border rounded disabled:opacity-30"
                      >
                        ↓ Down
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
};
