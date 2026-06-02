/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { getTemplateByType, buildStarterContent } from "@/lib/templates";
import { getAllThemes, getTheme } from "@/lib/themes";

import Template from "@/components/siteTemplates/Template";
import { SiteProvider } from "@/context/SiteContext";

export default function TemplatesPreview({ type }: { type: string }) {
  const templateEntry = getTemplateByType(type);

  // 1. Initialize state with the template's default theme if it exists
  const [themeName, setThemeName] = useState(
    templateEntry?.config.theme || "light",
  );

  const searchParams = useSearchParams();
  const paramsName = searchParams.get("name");
  const paramsSlug = searchParams.get("slug");
  const fromParam = searchParams.get("from");

  // 2. Handle cases where the 'type' changes or template loads late
  useEffect(() => {
    if (templateEntry?.config.theme) {
      setThemeName(templateEntry.config.theme);
    }
  }, [type, templateEntry?.config.theme]);

  // ── Not Found ──────────────────────────────
  if (!templateEntry) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-2xl font-bold">Site not available</h1>
        <p className="text-slate-500 mt-2">This template is not found</p>
      </div>
    );
  }

  // 3. ALWAYS derive the active theme from the state 'themeName'
  const theme = getTheme(themeName);

  // Prepare URL logic
  // DEFAULT BACK BUTTON IS /templates
  let from = "/templates";
  if (fromParam) {
    const queryParams: string[] = [];
    if (paramsName) queryParams.push(`name=${encodeURIComponent(paramsName)}`);
    if (paramsSlug) queryParams.push(`slug=${encodeURIComponent(paramsSlug)}`);
    from =
      fromParam + (queryParams.length > 0 ? `?${queryParams.join("&")}` : "");
  }

  const starterContentArgs: Record<string, string | undefined> = {};
  if (paramsName) starterContentArgs.selectedTitle = paramsName;

  const templateData = templateEntry?.starterContent
    ? templateEntry.starterContent(starterContentArgs)
    : buildStarterContent(templateEntry.contentConfig, starterContentArgs);


  let useTemplateHref = `/dashboard/new?template=${encodeURIComponent(type)}`;
  const useQueryParams: string[] = [];
  if (paramsName) useQueryParams.push(`name=${encodeURIComponent(paramsName)}`);
  if (paramsSlug) useQueryParams.push(`slug=${encodeURIComponent(paramsSlug)}`);
  // Add selected theme to the final URL so the dashboard knows which one you chose
  useQueryParams.push(`theme=${encodeURIComponent(themeName)}`);

  if (useQueryParams.length) {
    useTemplateHref += `&${useQueryParams.join("&")}`;
  }

  return (
    <div className={`min-h-screen bg-white text-slate-900 ${theme.className}`}>
      <SiteProvider
        value={{
          isCustomDomain: false,
        }}
      >
        <style>{theme.css}</style>

        <header className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
          <div className="flex items-center gap-4">
            <Link
              href={from}
              className="flex p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-black" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase font-bold hidden sm:block">
                Theme
              </span>
              <select
                className="border border-slate-200 rounded-lg px-2 py-1 text-xs text-black bg-white focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
              >
                {getAllThemes().map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <Link href={useTemplateHref}>
              <button className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-md active:scale-95">
                Use Template
              </button>
            </Link>
          </div>
        </header>

        <main>
          <Template
            isEditor={false}
            canCustomize={false}
            content={templateData}
            isPreview={true}
            hasNavbar={true}
          />
        </main>
      </SiteProvider>
    </div>
  );
}
