// src/store/useSiteDisplayStore.ts
import { create } from "zustand";
import { getSiteByLookup } from "@/lib/firestore";
import type { Site } from "@/lib/types";

interface SiteDisplayState {
  slug: string | null;
  site: Site | null;
  loading: boolean;

  fetchPublicSite: (slug: string) => Promise<void>;
  fetchSiteByDomain: (slug: string) => Promise<void>;
  reset: () => void;
}

export const useSiteDisplayStore = create<SiteDisplayState>((set) => ({
  slug: null,
  site: null,
  loading: true,

  fetchPublicSite: async (slug) => {
    try {
      set({ loading: true });

      const site = await getSiteByLookup(slug);

      set({ site, slug: site?.slug });
    } catch (err) {
      console.error("Public fetch error:", err);
      set({ site: null });
    } finally {
      set({ loading: false });
    }
  },

  fetchSiteByDomain: async (domain: string) => {
    set({ loading: true });
    try {
      const site = await getSiteByLookup(domain);
      set({ site, slug: site?.slug });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  reset: () =>
    set({
      site: null,
      slug: null,
      loading: true,
    }),
}));
