"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/lib/useAuth";
import { getAllThemes } from "@/lib/themes";
import { useSiteEditorStore } from "@/store/useSiteEditorStore";

import EditorScreen from "@/screen/editor/EditorScreen";

export default function SiteEditorPage() {
  const { user } = useAuth();

  const params = useParams();
  const slug = params.slug as string;
  const subslug = params.subslug as string;
  const slugs = { slug, subslug };

  const siteData = useSiteEditorStore((s) => s.site);
  const loading = useSiteEditorStore((s) => s.loading);
  const isSaving = useSiteEditorStore((s) => s.isSaving);

  const updateSite = useSiteEditorStore((s) => s.updateSite);
  const saveSite = useSiteEditorStore((s) => s.saveSite);

  const handleSave = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      await saveSite(token);
      toast.success("All changes saved!");
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Could not save changes.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium">Powering up the editor...</p>
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold">Site Not Found</h2>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-16 border-b bg-background flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/sites"
            className="p-2 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-bold text-foreground leading-none">
              {siteData.name || "Untitled Site"}
            </h1>
            <p className="text-[10px] text-foreground/60 font-mono mt-1 uppercase tracking-wider">
              Mode: Editing
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 italic hidden sm:block">
            Theme
          </span>
          <select
            className="border border-black rounded-full px-3 py-1 text-xs text-black bg-white/80 focus:ring-2 focus:ring-primary outline-none transition-all"
            value={siteData.theme}
            onChange={(e) => updateSite({ theme: e.target.value })}
            disabled={isSaving}
          >
            {getAllThemes().map(({ id }) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-slate-100 p-4 md:p-8">
        <div className="max-w-300 mx-auto min-h-full">
          <EditorScreen
            data={siteData}
            onChange={(updated) => updateSite(updated)}
            slugs={slugs}
          />
        </div>
      </main>
    </div>
  );
}
