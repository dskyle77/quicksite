// src/store/useSiteDisplayStore.ts
import { create } from "zustand";
import { getSiteByLookup } from "@/lib/firestore";
import type { Site } from "@/lib/types";

interface SiteDisplayState {
  site: Site | null;
  loading: boolean;

  fetchPublicSite: (slug: string) => Promise<void>;
  fetchSiteByDomain: (slug: string) => Promise<void>;
  reset: () => void;
}

export const useSiteDisplayStore = create<SiteDisplayState>((set) => ({
  site: null,
  loading: true,

  // 🌐 Load public site (visitor view)
  fetchPublicSite: async (slug) => {
    try {
      set({ loading: true });

      const data = await getSiteByLookup(slug);

      set({ site: data ?? null });
    } catch (err) {
      console.error("Public fetch error:", err);
      set({ site: null });
    } finally {
      set({ loading: false });
    }
  },
  // Inside useSiteDisplayStore
  fetchSiteByDomain: async (domain: string) => {
    set({ loading: true });
    try {
      const site = await getSiteByLookup(domain);
      set({ site, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error(error);
    }
  },

  // 🧹 Reset public state
  reset: () =>
    set({
      site: null,
      loading: true,
    }),
}));
