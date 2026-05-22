/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { TemplateComponentProps } from "@/lib/templates";
import { BuilderConfig, SectionVariantKey, SectionConfig } from "./types";
import { BuilderSidebar, SectionMenu } from "./BuilderSidebar";

// Variant Registries
import { NavbarVariants } from "./variants/NavbarVariants";
import { HeroVariants } from "./variants/HeroVariants";
import { FooterVariants } from "./variants/FooterVariants";
import { SectionVariants } from "./variants/sectionVariants/index";

type TemplateBuilderProps = Omit<TemplateComponentProps, "onUpdate"> & {
  onUpdate: (path: string, value: any) => void;
  customize: boolean;
};

type SectionWithMenuProps = {
  sec: SectionConfig;
  content: Record<string, any>;
  isEditor: boolean;
  slugs: any;
  makeHandleUpdates: (
    sectionPrefix: string,
  ) => (path: string | null, val: any) => void;
  onConfigChange: (newConfig: BuilderConfig) => void;
  idx: number;
  config: BuilderConfig;
};

const SectionWithMenu = ({
  sec,
  content,
  isEditor,
  slugs,
  makeHandleUpdates,
  onConfigChange,
  idx,
  config,
}: SectionWithMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const SectionComponent = SectionVariants[sec.type];
  if (!SectionComponent) return null;

  // Generate unique key: e.g., "7z9xprojects"
  const contentKey = `${sec.id}${sec.type}`;
  const sectionContent = content[contentKey] || {};
  return (
    <div style={{ position: "relative" }}>
      <SectionComponent
        variant={sec.variant as SectionVariantKey}
        isEditor={isEditor}
        content={sectionContent}
        onUpdate={makeHandleUpdates(contentKey)}
        slugs={slugs}
        position={idx + 1}
        anchorName={sec.anchorName}
        path={contentKey}
      />
      {isEditor && (
        <div
          className="absolute top-3 right-3 z-20 bg-white/85 rounded-full w-8 h-8 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] cursor-pointer"
          title="Section Options"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X />
          ) : (
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          )}
        </div>
      )}
      {isEditor && menuOpen && (
        <div
          className="absolute top-8 right-0 z-30 bg-white rounded-lg shadow-lg border border-gray-200 mt-2 w-60"
          style={{ minWidth: "210px" }}
        >
          <SectionMenu
            config={config}
            section={sec}
            index={idx}
            onChange={onConfigChange}
          />
        </div>
      )}
    </div>
  );
};

export default function TemplateBuilder({
  isEditor,
  content,
  onUpdate,
  slugs,
  customize,
}: TemplateBuilderProps) {
  // The config constant always points to the up-to-date config object.
  const config: BuilderConfig = content.builderConfig || {};

  // Only create sidebar and react state if customize is true.
  const [sidebarOpen, setSidebarOpen] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (!mq.matches) setSidebarOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // If not customizing, config is static. Otherwise we allow interactive update.
  const [internalConfig, setInternalConfig] = useState<BuilderConfig>(config);

  // Pick the config source: if customize, use state, else use just config from props.
  const effectiveConfig = customize ? internalConfig : config;

  const onClose = () => {
    setSidebarOpen(false);
  };

  const handleConfigChange = (newConfig: BuilderConfig) => {
    setInternalConfig(newConfig);
    onUpdate("builderConfig", newConfig);
  };

  // -- Handle Updates: Provides sectioned update paths to subcomponents --
  const makeHandleUpdates = (sectionPrefix: string) => {
    return (path: string | null, val: any) => {
      if (!path) {
        onUpdate(sectionPrefix, val);
      } else {
        onUpdate(`${sectionPrefix}.${path}`, val);
      }
    };
  };

  const Navbar =
    NavbarVariants[effectiveConfig.navbar] ?? NavbarVariants["classic"];
  const Hero = HeroVariants[effectiveConfig.hero] ?? HeroVariants["split"];
  const Footer =
    FooterVariants[effectiveConfig.footer] ?? FooterVariants["classic"];

  const enabledSections = (effectiveConfig.sections || []).filter(
    (s) => s.enabled,
  );

  return (
    <div
      className="relative flex min-h-0 w-full"
    >
      {customize && isEditor && sidebarOpen && (
        <BuilderSidebar
          config={internalConfig}
          onChange={handleConfigChange}
          open={sidebarOpen}
          onClose={onClose}
        />
      )}

      <div
        className={`min-w-0 flex-1 w-full ${customize && isEditor ? "bg-gray-100 p-2" : ""}`}
        style={{
          height: "100%",
          overflowY: "auto",
        }}
      >
        {customize && isEditor && !sidebarOpen && (
          <button
            className="fixed top-20 left-4 z-30 bg-white border rounded-full shadow-md px-4 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-gray-50 transition"
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
          className={`@container w-full ${
            customize && isEditor
              ? "max-w-7xl mx-auto shadow-2xl bg-white min-h-full"
              : ""
          }`}
        >
          <Navbar
            isEditor={isEditor}
            content={content.navbar || {}}
            onUpdate={makeHandleUpdates("navbar")}
            slugs={slugs}
          />

          <Hero
            isEditor={isEditor}
            content={content.hero || {}}
            onUpdate={makeHandleUpdates("hero")}
            slugs={slugs}
          />

          <main>
            {enabledSections.map((sec, i) => (
              <SectionWithMenu
                key={i}
                sec={sec}
                content={content}
                isEditor={isEditor}
                slugs={slugs}
                makeHandleUpdates={makeHandleUpdates}
                onConfigChange={handleConfigChange}
                idx={i}
                config={config}
              />
            ))}
          </main>

          <Footer
            isEditor={isEditor}
            content={content.footer || {}}
            onUpdate={makeHandleUpdates("footer")}
            slugs={slugs}
          />
        </div>
      </div>
    </div>
  );
}
