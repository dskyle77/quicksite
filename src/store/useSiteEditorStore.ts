// src/store/useSiteEditorStore.ts
// saveSite hits PATCH /api/sites/[id]/content — auth enforced server-side.

import { create } from "zustand";
import { getPrivateSite } from "@/lib/firestore";
import type { Site } from "@/lib/types";
import authFetch from "@/lib/authFetch";

interface SiteEditorState {
  site: Site | null;
  loading: boolean;
  isSaving: boolean;

  fetchSite: (uid: string, slug: string) => Promise<void>;
  updateSite: (updates: Partial<Site>) => void;
  saveSite: () => Promise<void>;
  reset: () => void;
}

export const useSiteEditorStore = create<SiteEditorState>((set, get) => ({
  site: null,
  loading: true,
  isSaving: false,

  fetchSite: async (uid, slug) => {
    try {
      set({ loading: true });
      const data = await getPrivateSite(uid, slug);
      if (!data) throw new Error("Site not found.");
      set({ site: data });
    } catch (err) {
      console.error("Editor fetch error:", err);
      set({ site: null });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateSite: (updates) => {
    const current = get().site;
    if (!current) return;
    set({ site: { ...current, ...updates } });
  },

  // 💾 Save via API route — auth validated server-side
  saveSite: async () => {
    const { site } = get();
    if (!site) return;

    try {
      set({ isSaving: true });

      const res = await authFetch(`/api/sites/${site.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: site.content,
          theme: site.theme,
          name: site.name,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Save failed (${res.status})`);
      }
    } catch (err) {
      console.error("Save error:", err);
      throw err;
    } finally {
      set({ isSaving: false });
    }
  },

  // 🧹 Reset editor state
  reset: () => set({ site: null, loading: true, isSaving: false }),
}));
