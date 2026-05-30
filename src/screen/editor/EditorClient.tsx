/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import {
  Loader2,
  Save,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { getAllThemes } from "@/lib/themes";
import { useSiteEditorStore } from "@/store/useSiteEditorStore";
import EditorScreen from "@/screen/editor/EditorScreen";
import { SiteProvider } from "@/context/SiteContext";
import { useState } from "react";

interface EditorClientProps {
  slug: string;
  subslug: string | null;
}

export default function EditorClient({ slug, subslug }: EditorClientProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const { user, loading: authLoading } = useAuth();

  // Destructure store with selective selectors for better performance
  const siteData = useSiteEditorStore((s) => s.site);
  const dataLoading = useSiteEditorStore((s) => s.loading);
  const isSaving = useSiteEditorStore((s) => s.isSaving);
  const { updateSite, saveSite } = useSiteEditorStore();

  const handleSave = async () => {
    if (!user) return;
    const previousCanEdit = canEdit;
    setCanEdit(false);
    try {
      await saveSite();
      toast.success("Changes saved successfully");
    } catch (err: any) {
      toast.error(err instanceof Error ? err.message : "Server error.");
    } finally {
      // Revert to preview mode state if active
      setCanEdit(isPreview ? false : previousCanEdit);
    }
  };

  const togglePreview = () => {
    const nextPreviewState = !isPreview;
    setIsPreview(nextPreviewState);
    setCanEdit(!nextPreviewState); // Sets canEdit to false when preview is active
  };

  // We show loading if auth is working OR if we're waiting for data
  const isInitialLoading = authLoading || (dataLoading && !siteData);

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white">
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <div className="absolute h-2 w-2 bg-primary rounded-full" />
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-lg font-semibold text-slate-900">
            Preparing Editor
          </p>
          <p className="text-sm text-slate-500 animate-pulse">
            Syncing your workspace...
          </p>
        </div>
      </div>
    );
  }

  // Robust Error/Not Found State
  if (!siteData && !dataLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Site not found</h2>
        <p className="text-slate-600 mt-2 max-w-sm">
          We couldn&apos;t retrieve the data for{" "}
          <span className="font-mono font-bold text-black">
            &quot;{slug}&quot;
          </span>
          . It may have been deleted or you may have insufficient permissions.
        </p>
        <Link
          href="/dashboard/sites"
          className="mt-8 px-6 py-3 bg-white border border-slate-200 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-all"
        >
          Back to Sites
        </Link>
      </div>
    );
  }

  if (!siteData) return null;

  // Main Render
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50/50">
      <header className="h-16 border-b bg-white flex items-center justify-between px-3 sm:px-6 shrink-0 z-50 gap-2">
        {/* Left Section */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
          <Link
            href={subslug ? `${slug}` : `/dashboard/sites`}
            className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-full transition-all shrink-0"
          >
            <ArrowLeft size={18} className="text-slate-600 sm:w-5 sm:h-5" />
          </Link>
          <div className="min-w-0 flex flex-col">
            <h1 className="font-bold text-slate-900 truncate text-xs sm:text-base leading-tight max-w-[120px] sm:max-w-[200px] md:max-w-none">
              {siteData?.name || "Untitled Site"}
            </h1>
            <div className="flex items-center gap-1">
              <div
                className={`w-1.5 h-1.5 rounded-full ${isPreview ? "bg-amber-500" : "bg-green-500"}`}
              />
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">
                {isPreview ? "Preview Mode" : "Live Editor"}
              </span>
            </div>
          </div>
          {subslug && (
            <Link
              href={`/editor/${slug}`}
              className="hidden lg:inline-flex ml-2 items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
              title="Go to site home"
            >
              Home
            </Link>
          )}
        </div>

        {/* Right Section / Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Theme Dropdown */}
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-slate-100 rounded-lg max-w-[100px] sm:max-w-none">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase hidden md:inline">
              Theme
            </span>
            <select
              className="bg-transparent text-[11px] sm:text-xs font-bold text-slate-900 outline-none cursor-pointer max-w-full"
              value={siteData?.theme}
              onChange={(e) => updateSite({ theme: e.target.value })}
              disabled={isSaving}
            >
              {getAllThemes().map(({ id }) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>

          {/* Preview Toggle Button */}
          <button
            onClick={togglePreview}
            className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
              isPreview
                ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            title={isPreview ? "Back to editing" : "Preview live layout"}
          >
            {isPreview ? <EyeOff size={15} /> : <Eye size={15} />}
            <span className="hidden sm:inline">
              {isPreview ? "Edit" : "Preview"}
            </span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="relative flex items-center gap-1.5 bg-black text-white px-3 sm:px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {isSaving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span className="hidden sm:inline">Save</span>
              </>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto min-h-full">
          <SiteProvider value={{ site: siteData }}>
            <EditorScreen
              canEdit={canEdit}
              data={siteData!}
              onChange={(updated) => updateSite(updated)}
              slugs={{ slug, subslug }}
            />
          </SiteProvider>
        </div>
      </main>
    </div>
  );
}
