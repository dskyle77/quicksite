/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  TemplateComponentProps,
  BuilderConfig,
  SectionVariantKey,
} from "./types";
import { BuilderSidebar } from "./BuilderSidebar"; // Import the sidebar we created

// Variant Registries
import { NavbarVariants } from "./variants/NavbarVariants";
import { HeroVariants } from "./variants/HeroVariants";
import { FooterVariants } from "./variants/FooterVariants";
import { SectionVariants } from "./variants/sectionVariants/index";

export default function TemplateBuilder({
  isEditor,
  content,
  onUpdate,
  slugs,
}: TemplateComponentProps) {
  const builderConfig = content.builderConfig;
  const [config, setConfig] = useState<BuilderConfig>(builderConfig);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const onClose = () => {
    setSidebarOpen(false);
  };
  const handleConfigChange = (newConfig: BuilderConfig) => {
    setConfig(newConfig);
    onUpdate("builderConfig", newConfig);
  };

  const Navbar = NavbarVariants[config.navbar] ?? NavbarVariants["classic"];
  const Hero = HeroVariants[config.hero] ?? HeroVariants["dynamic"];
  const Footer = FooterVariants[config.footer] ?? FooterVariants["classic"];

  const enabledSections = config.sections.filter((s) => s.enabled);

  return (
    <div
      className="flex"
      style={{
        height: "calc(100vh - 4rem)", 
      }}
    >
      {isEditor && sidebarOpen && (
        <aside className="w-80 h-full overflow-y-auto overflow-x-hidden border-r">
          <BuilderSidebar
            config={config}
            onChange={handleConfigChange}
            open={sidebarOpen}
            onClose={onClose}
          />
        </aside>
      )}

      <div
        className={`flex-1 ${isEditor ? "bg-gray-100 p-2" : ""}`}
        style={{
          height: "100%",
          overflowY: "auto",
        }}
      >
        {isEditor && !sidebarOpen && (
          <button
            className="fixed top-18 left-4 z-100 bg-white border rounded-full shadow-md px-4 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-gray-50 transition"
            style={{
              boxShadow: "0 2px 10px 0 rgba(0,0,0,0.08)",
            }}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            type="button"
          >
            {/* Hamburger icon */}
            <span className="block w-5 h-5">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <line x1="4" x2="20" y1="7" y2="7" strokeLinecap="round" />
                <line x1="4" x2="20" y1="12" y2="12" strokeLinecap="round" />
                <line x1="8" x2="20" y1="17" y2="17" strokeLinecap="round" />
              </svg>
            </span>
            Open Sidebar
          </button>
        )}

        <div
          className={`${isEditor ? "max-w-7xl mx-auto shadow-2xl bg-white min-h-full" : ""}`}
        >
          <Navbar
            isEditor={isEditor}
            content={content.navbar || {}}
            onUpdate={(path, val) => onUpdate(`navbar.${path}`, val)}
            slugs={slugs}
          />

          <Hero
            isEditor={isEditor}
            content={content.hero || {}}
            onUpdate={(path, val) => onUpdate(`hero.${path}`, val)}
            slugs={slugs}
          />

          <main>
            {enabledSections.map((sec, i) => {
              const SectionComponent = SectionVariants[sec.type];
              if (!SectionComponent) return null;

              // Generate unique key: e.g., "7z9xprojects"
              const contentKey = `${sec.id}${sec.type}`;
              const sectionContent = content[contentKey] || {};

              return (
                <SectionComponent
                  key={sec.id}
                  variant={sec.variant as SectionVariantKey}
                  isEditor={isEditor}
                  content={sectionContent}
                  onUpdate={(path, val) =>
                    onUpdate(`${contentKey}.${path}`, val)
                  }
                  slugs={slugs}
                  position={i}
                />
              );
            })}
          </main>

          <Footer
            isEditor={isEditor}
            content={content.footer || {}}
            onUpdate={(path, val) => onUpdate(`footer.${path}`, val)}
            slugs={slugs}
          />
        </div>
      </div>
    </div>
  );
}
