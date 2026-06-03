/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { TemplateComponentProps } from "@/lib/templates";
import { BuilderConfig, SectionConfig } from "./types";
import { BuilderSidebar, SectionMenu, GlobalMenu } from "./BuilderSidebar";

import Reveal from "../shared/Reveal";

// Variant Registries
import { NavbarVariants } from "./variants/NavbarVariants";
import { HeroVariants } from "./variants/HeroVariants";
import { FooterVariants } from "./variants/FooterVariants";
import { SectionVariants } from "./variants/sections/index";
import { cn } from "@/lib/utils";
import { useLongPress } from "@/hooks/useLongPress";

type TemplateBuilderProps = Omit<TemplateComponentProps, "onUpdate"> & {
  onUpdate: (path: string, value: any) => void;
  customize: boolean;
  isPreview: boolean;
  hasNavbar: boolean;
};

type GlobalComponentWithMenuProps = {
  type: "navbar" | "hero" | "footer";
  children: React.ReactNode;
  isEditor: boolean;
  config: BuilderConfig;
  onConfigChange: (newConfig: BuilderConfig) => void;
  className?: string;
  cs: boolean;
  scs: () => void;
};

const GlobalComponentWithMenu = ({
  type,
  children,
  isEditor,
  config,
  onConfigChange,
  className,
  cs,
  scs,
}: GlobalComponentWithMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleChange = (v: BuilderConfig) => {
    onConfigChange(v);
    setMenuOpen(false);
  };

  const longPress = useLongPress({
    delay: 800,
    onLongPress() {
      setMenuOpen(!menuOpen);
    },
  });

  return (
    <div
      className={cn("relative", className)}
      {...longPress}
      onClick={() => scs()}
    >
      {cs && (
        <div
          className="absolute inset-0 z-20 pointer-events-none border-2 border-dashed border-indigo-400 rounded-lg min-h-16"
          style={{ boxSizing: "border-box" }}
        />
      )}
      <div
        style={
          type === "navbar" && isEditor
            ? { width: "calc(100% - 30px)" }
            : undefined
        }
      >
        {children}
      </div>
      {isEditor && (
        <div
          className={cn(
            "absolute top-4 right-3 z-31 bg-(--qs-bg-alt)/85 rounded-full w-8 h-8 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] cursor-pointer",
            type === "hero" && "top-30",
          )}
          title={`${type} Options`}
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
          className={cn(
            "absolute top-8 right-3 z-32 bg-white rounded-lg shadow-lg border border-gray-200 mt-2 w-60",
            type === "hero" && "top-38",
          )}
          style={{ minWidth: "210px" }}
        >
          <GlobalMenu config={config} onChange={handleChange} type={type} />
        </div>
      )}
    </div>
  );
};

type SectionWithMenuProps = {
  enabled: boolean;
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

  cs: boolean;
  scs: () => void;
};

const SectionWithMenu = ({
  enabled,
  sec,
  content,
  isEditor,
  slugs,
  makeHandleUpdates,
  onConfigChange,
  idx,
  config,
  cs,
  scs,
}: SectionWithMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleChange = (v: BuilderConfig) => {
    onConfigChange(v);
    setMenuOpen(false);
  };

  const SectionComponent = SectionVariants[sec.type];
  if (!SectionComponent) return null;

  // Generate unique key: e.g., "7z9xprojects"
  const contentKey = `${sec.id}`;
  const sectionContent = content[contentKey] || {};
  return (
    <div className={cn("relative", !enabled && "h-40")} onClick={() => scs()}>
      {cs && (
        <div
          className="absolute inset-0 z-20 pointer-events-none border-2 border-dashed border-indigo-400 rounded-lg"
          style={{ boxSizing: "border-box" }}
        />
      )}
      {!enabled && (
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-center items-center bg-linear-to-br from-gray-900/90 to-gray-800/70 text-white border-2 border-dashed border-red-400 shadow-xl transition-all duration-300">
          <div className="flex flex-col items-center">
            <span className="flex items-center gap-3">
              <span className="text-5xl font-black tracking-tight text-red-300 drop-shadow">
                DISABLED
              </span>
            </span>
            <p className="text-lg font-medium bg-black/20 rounded-md px-2 py-1 mt-2 shadow-inner text-red-100 text-center max-w-xs">
              This section will not show in your site preview or live website.
            </p>
          </div>
        </div>
      )}

      <SectionComponent
        variant={sec.variant as string}
        isEditor={isEditor && enabled}
        content={sectionContent}
        onUpdate={makeHandleUpdates(contentKey)}
        slugs={slugs}
        position={idx}
        anchorName={sec.anchorName}
        path={contentKey}
      />
      {isEditor && (
        <div
          className={cn(
            "absolute top-3 right-3 z-20 rounded-full w-8 h-8 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] cursor-pointer",
            idx % 2 === 0 ? "bg-(--qs-bg-alt)/85" : "bg-(--qs-bg)/85",
          )}
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
            onChange={handleChange}
            type="section"
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
  hasNavbar,
}: TemplateBuilderProps) {
  const isEditMode = isEditor && !isPreview;
  // The config constant always points to the up-to-date config object.
  const config: BuilderConfig = content.builderConfig || {};

  // Only create sidebar and react state if customize is true.
  const [sidebarOpen, setSidebarOpen] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches,
  );

  // Dynamic Sidebar Width States (Min: 280px, Max: 600px)
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const isResizingRef = useRef(false);

  const [currentSection, setCurrentSection] = useState<string>("");

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
    (s) => (isEditor && !isPreview) || s.enabled,
  );

  return (
    <div
      className="relative flex flex-1 min-h-0 w-full overflow-hidden"
      style={{ height: hasNavbar ? `calc(100vh - 64px)` : "100vh" }}
    >
      {customize && isEditor && sidebarOpen && (
        <>
          {/* Explicit width containment wrapping the Custom Sidebar */}
          <div
            style={{
              width: sidebarWidth,
              minWidth: sidebarWidth,
              flexShrink: 0,
            }}
            className="h-full relative"
          >
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
        {customize && isEditMode && !sidebarOpen && (
          <button
            className="fixed top-32 left-4 z-50 bg-(--qs-bg)/85 border rounded-full shadow-md px-4 py-2 text-xs font-semibold flex items-center gap-2 hover:bg-gray-50 transition"
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
          <GlobalComponentWithMenu
            type="navbar"
            isEditor={isEditMode}
            config={effectiveConfig}
            onConfigChange={handleConfigChange}
            // cs={currentSection === "navbar" && isEditMode}
            cs={false}
            scs={() => setCurrentSection("navbar")}
          >
            <header className="relative ">
              <Navbar
                isEditor={isEditMode}
                content={content.navbar || {}}
                onUpdate={makeHandleUpdates("navbar")}
                slugs={slugs}
              />
            </header>
          </GlobalComponentWithMenu>

          <Reveal variant="scale">
            <GlobalComponentWithMenu
              type="hero"
              isEditor={isEditMode}
              config={effectiveConfig}
              onConfigChange={handleConfigChange}
              cs={currentSection === "hero" && isEditMode}
              scs={() => setCurrentSection("hero")}
            >
              <Hero
                isEditor={isEditMode}
                content={content.hero || {}}
                onUpdate={makeHandleUpdates("hero")}
                slugs={slugs}
              />
            </GlobalComponentWithMenu>
          </Reveal>

          <main>
            {enabledSections.map((sec, i) => {
              const isSelected =
                currentSection === sec.id &&
                sec.enabled &&
                isEditMode;
              return (
                <Reveal key={sec.id} variant="bottom">
                  <SectionWithMenu
                    enabled={sec.enabled}
                    sec={sec}
                    content={content}
                    isEditor={isEditMode}
                    slugs={slugs}
                    makeHandleUpdates={makeHandleUpdates}
                    onConfigChange={handleConfigChange}
                    idx={i}
                    config={config}
                    cs={isSelected}
                    scs={() => setCurrentSection(sec.id)}
                  />
                </Reveal>
              );
            })}
          </main>

          <Reveal variant="bottom">
            <GlobalComponentWithMenu
              type="footer"
              isEditor={isEditMode}
              config={effectiveConfig}
              onConfigChange={handleConfigChange}
              cs={currentSection === "footer" && isEditMode}
              scs={() => setCurrentSection("footer")}
            >
              <Footer
                isEditor={isEditMode}
                content={content.footer || {}}
                onUpdate={makeHandleUpdates("footer")}
                slugs={slugs}
              />
            </GlobalComponentWithMenu>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
