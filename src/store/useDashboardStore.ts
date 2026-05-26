// src/store/useDashboardStore.ts
// ─────────────────────────────────────────────────────────────────────────────
// All write operations go through API routes so plan enforcement
// and auth validation happen server-side.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import { getUserSites, getUserSiteLimit } from "@/lib/firestore";
import type { Site, DashboardStats } from "@/lib/types";

// ── UI State ──────────────────────────────────────────────────────────────────

interface UIState {
  createModalOpen: boolean;
  deleteConfirmId: string | null;
  sidebarOpen: boolean;
}

// ── Store State ───────────────────────────────────────────────────────────────

interface DashboardState {
  sites: Site[];
  siteLimit: number;
  stats: DashboardStats;
  sitesLoading: boolean;
  sitesError: string | null;
  ui: UIState;

  // Loading states for write operations
  actionLoading: boolean;
  lastAction: "remove" | "toggleStatus" | null;

  fetchSites: (uid: string) => Promise<void>;

  removeSite: (siteId: string, token: string) => Promise<void>;
  toggleSiteStatus: (siteId: string, token: string) => Promise<void>;

  setCreateModal: (open: boolean) => void;
  setDeleteConfirm: (siteId: string | null) => void;
  setSidebarOpen: (open: boolean) => void;

  reset: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcStats(sites: Site[], siteLimit: number): DashboardStats {
  return {
    totalVisits: sites.reduce((a, s) => a + (s.visits ?? 0), 0),
    totalWhatsappClicks: sites.reduce((a, s) => a + (s.whatsappClicks ?? 0), 0),
    totalSites: sites.length,
    sitesLeft: Math.max(siteLimit - sites.length, 0),
  };
}

async function apiFetch(
  url: string,
  method: string,
  token: string,
  body?: unknown,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }

  return res;
}

// ── Initial State ─────────────────────────────────────────────────────────────

const initialStats: DashboardStats = {
  totalVisits: 0,
  totalWhatsappClicks: 0,
  totalSites: 0,
  sitesLeft: 0,
};

const initialUI: UIState = {
  createModalOpen: false,
  deleteConfirmId: null,
  sidebarOpen: false,
};

// ── Store ─────────────────────────────────────────────────────────────────────

export const useDashboardStore = create<DashboardState>((set) => ({
  sites: [],
  siteLimit: 0,
  stats: initialStats,
  sitesLoading: false,
  sitesError: null,
  ui: initialUI,
  actionLoading: false,
  lastAction: null,

  // ── Fetch sites (read — still direct Firestore, read-only is fine) ──────────

  fetchSites: async (uid) => {
    set({ sitesLoading: true, sitesError: null });
    try {
      const [sites, siteLimit] = await Promise.all([
        getUserSites(uid),
        getUserSiteLimit(uid),
      ]);
      set({
        sites,
        siteLimit,
        stats: calcStats(sites, siteLimit),
        sitesLoading: false,
      });
    } catch (e) {
      set({ sitesError: (e as Error).message, sitesLoading: false });
    }
  },

  // ── Remove site ─────────────────────────────────────────────────────────────

  removeSite: async (slug, token) => {
    set({ actionLoading: true, lastAction: "remove" });
    try {
      await apiFetch(`/api/sites/${slug}`, "DELETE", token);

      set((state) => {
        const sites = state.sites.filter((s) => s.id !== slug);
        return {
          sites,
          stats: calcStats(sites, state.siteLimit),
          ui: { ...state.ui, deleteConfirmId: null },
        };
      });
    } finally {
      set({ actionLoading: false, lastAction: null });
    }
  },

  // ── Toggle status ───────────────────────────────────────────────────────────

  toggleSiteStatus: async (siteId, token) => {
    set({ actionLoading: true, lastAction: "toggleStatus" });
    try {
      const res = await apiFetch(`/api/sites/${siteId}/status`, "PATCH", token);
      const { status: nextStatus } = await res.json();

      set((state) => ({
        sites: state.sites.map((s) =>
          s.id === siteId ? { ...s, status: nextStatus } : s,
        ),
      }));
    } finally {
      set({ actionLoading: false, lastAction: null });
    }
  },

  // ── UI ──────────────────────────────────────────────────────────────────────

  setCreateModal: (open) =>
    set((state) => ({ ui: { ...state.ui, createModalOpen: open } })),

  setDeleteConfirm: (siteId) =>
    set((state) => ({ ui: { ...state.ui, deleteConfirmId: siteId } })),

  setSidebarOpen: (open) =>
    set((state) => ({ ui: { ...state.ui, sidebarOpen: open } })),

  // ── Reset ───────────────────────────────────────────────────────────────────

  reset: () =>
    set({
      sites: [],
      siteLimit: 0,
      stats: initialStats,
      sitesLoading: false,
      sitesError: null,
      ui: initialUI,
      actionLoading: false,
      lastAction: null,
    }),
}));
