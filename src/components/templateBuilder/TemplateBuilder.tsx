/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { TemplateComponentProps } from "@/lib/templates";
import { BuilderConfig, SectionVariantKey, SectionConfig } from "./types";
import { BuilderSidebar, SectionMenu } from "./BuilderSidebar";

// Variant Registries
import { NavbarVariants } from "./variants/NavbarVariants";
import { HeroVariants } from "./variants/HeroVariants";
import { FooterVariants } from "./variants/FooterVariants";
import { SectionVariants } from "./variants/sections/index";

type TemplateBuilderProps = Omit<TemplateComponentProps, "onUpdate"> & {
  onUpdate: (path: string, value: any) => void;
  customize: boolean;
  isPreview: boolean;
  hasNavbar: boolean;
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
  isPreview,
  hasNavbar
}: TemplateBuilderProps) {
  const isEditMode = isEditor && !isPreview
  // The config constant always points to the up-to-date config object.
  const config: BuilderConfig = content.builderConfig || {};

  // Only create sidebar and react state if customize is true.
  const [sidebarOpen, setSidebarOpen] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches,
  );

  // Dynamic Sidebar Width States (Min: 280px, Max: 600px)
  const [sidebarWidth, setSidebarWidth] = useState(340);
  const isResizingRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (!mq.matches) setSidebarOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Window-level event handling for fluid mouse movements during resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      // Calculate delta width from viewport left edge
      const newWidth = Math.max(280, Math.min(e.clientX, 600));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };

    if (sidebarOpen && customize && isEditor) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [sidebarOpen, customize, isEditor]);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none"; // Stop textual selections during movement
  };

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
      className="relative flex flex-1 min-h-0 w-full overflow-hidden"
      style={{ height: hasNavbar ? `calc(100vh - 64px)` : "100vh" }}
    >
      {customize && isEditor && sidebarOpen && (
        <>
          {/* Explicit width containment wrapping the Custom Sidebar */}
          <div style={{ width: sidebarWidth, minWidth: sidebarWidth, flexShrink: 0 }} className="h-full relative">
            <BuilderSidebar
              config={internalConfig}
              onChange={handleConfigChange}
              open={sidebarOpen}
              onClose={onClose}
            />
          </div>

          {/* Interactive Drag Handle Overlay Line */}
          <div
            onMouseDown={startResizing}
            className="w-1.5 h-full bg-gray-200 hover:bg-indigo-500 cursor-col-resize transition-colors duration-150 absolute top-0 z-50 select-none"
            style={{ left: sidebarWidth - 3 }}
          />
        </>
      )}

      <div
        className={`min-w-0 flex-1 w-full ${customize && isEditor ? "bg-gray-100 " : ""}`}
        style={{
          height: "100%",
          overflowY: "auto",
        }}
      >
        {customize && isEditor && !sidebarOpen && (
          <button
            className="fixed top-32 left-4 z-30 bg-white border rounded-full shadow-md px-4 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-gray-50 transition"
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
            <span className="md:inline hidden">Open Sidebar</span>
          </button>
        )}

        <div className={`@container w-full`}>
          <Navbar
            isEditor={isEditMode}
            content={content.navbar || {}}
            onUpdate={makeHandleUpdates("navbar")}
            slugs={slugs}
          />

          <Hero
            isEditor={isEditMode}
            content={content.hero || {}}
            onUpdate={makeHandleUpdates("hero")}
            slugs={slugs}
          />

          <main>
            {enabledSections.map((sec, i) => (
              <SectionWithMenu
                key={sec.id + sec.type}
                sec={sec}
                content={content}
                isEditor={isEditMode}
                slugs={slugs}
                makeHandleUpdates={makeHandleUpdates}
                onConfigChange={handleConfigChange}
                idx={i}
                config={config}
              />
            ))}
          </main>

          <Footer
            isEditor={isEditMode}
            content={content.footer || {}}
            onUpdate={makeHandleUpdates("footer")}
            slugs={slugs}
          />
        </div>
      </div>
    </div>
  );
}