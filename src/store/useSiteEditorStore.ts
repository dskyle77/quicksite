/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/useSiteEditorStore.ts
// saveSite hits PATCH /api/sites/[id] — auth enforced server-side.

import { create } from "zustand";
import { getPrivateSite } from "@/lib/firestore";
import type { Site } from "@/lib/types";
import authFetch from "@/lib/authFetch";

interface SiteEditorState {
  site: Site | null;
  images: Record<string, File>;
  loading: boolean;
  isSaving: boolean;

  fetchSite: (uid: string, slug: string) => Promise<void>;
  updateSite: (updates: Partial<Site>) => void;
  saveSite: () => Promise<void>;
  setImage: (pos: string, data: File) => void;
  reset: () => void;
}

export const useSiteEditorStore = create<SiteEditorState>((set, get) => ({
  site: null,
  images: {},
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

  setImage: (path, data) => {
    set((state) => ({
      images: { ...state.images, [path]: data },
    }));
  },

  saveSite: async () => {
    const { site, images } = get();
    if (!site || !images) return;

    try {
      set({ isSaving: true });

      // Use FormData instead of JSON
      const form = new FormData();
      form.append("name", site.name ?? "");
      form.append("theme", site.theme ? JSON.stringify(site.theme) : "");
      form.append("content", JSON.stringify(site.content ?? {}));

      // Append each image as a file in FormData (e.g., images[path])
      if (images) {
        Object.entries(images).forEach(([path, file]) => {
          if (file) {
            // you could use a key like 'images[path]' or simply path
            form.append(`images[${path}]`, file);
          }
        });
      }

      const res = await authFetch(`/api/sites/${site.id}`, {
        method: "PATCH",
        body: form,
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

  reset: () => set({ site: null, loading: true, isSaving: false }),
}));