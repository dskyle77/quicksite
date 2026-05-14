"use client";

import Link from "next/link";
import { Loader2, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/useAuth";
import { getAllThemes } from "@/lib/themes";
import { useSiteEditorStore } from "@/store/useSiteEditorStore";
import EditorScreen from "@/screen/editor/EditorScreen";

interface EditorClientProps {
  slug: string;
  subslug: string | null;
}

export default function EditorClient({ slug, subslug }: EditorClientProps) {
  const { user, loading: authLoading } = useAuth();

  // Destructure store with selective selectors for better performance
  const siteData = useSiteEditorStore((s) => s.site);
  const dataLoading = useSiteEditorStore((s) => s.loading);
  const isSaving = useSiteEditorStore((s) => s.isSaving);
  const { updateSite, saveSite } = useSiteEditorStore();

  const handleSave = async () => {
    if (!user) return;
    try {
      await saveSite();
      toast.success("Changes saved successfully");
    } catch (error) {
      toast.error("Error saving changes");
    }
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

  // 4. Robust Error/Not Found State
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

  // 5. Main Render
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50/50">
      <header className="h-16 border-b bg-white flex items-center justify-between px-4 sm:px-6 shrink-0 z-50">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={subslug ? `${slug}` : `/dashboard/sites`}
            className="p-2 hover:bg-slate-100 rounded-full transition-all"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div className="min-w-0 flex flex-col">
            <h1 className="font-bold text-slate-900 truncate text-sm sm:text-base leading-tight">
              {siteData?.name || "Untitled Site"}
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Live Editor
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

        <div className="flex items-center gap-2 sm:gap-4 ">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
            <span className="text-[11px] font-bold text-slate-400 uppercase hidden md:inline">
              Theme
            </span>
            <select
              className="bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer"
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

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="relative flex items-center gap-2 bg-black text-white px-4 sm:px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="hidden sm:inline">Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span className="hidden sm:inline">Save Changes</span>
              </>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto min-h-full">
          <EditorScreen
            data={siteData!}
            onChange={(updated) => updateSite(updated)}
            slugs={{ slug, subslug }}
          />
        </div>
      </main>
    </div>
  );
}
