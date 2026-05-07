import { create } from "zustand";
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
} from "@/lib/firestore";
import type { UserProfile } from "@/lib/types";

interface UserState {
  profile: UserProfile | null;

  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // ── Actions ─────────────────────────────────────
  fetchProfile: (uid: string) => Promise<void>;
  getUserPlan: () => "free" | "growth" | "pro" | null;
  refreshProfile: (uid: string) => Promise<void>;
  updateProfile: (
    uid: string,
    data: Partial<Omit<UserProfile, "uid" | "createdAt" | "updatedAt">>,
  ) => Promise<void>;

  clearUser: () => void;
}

// Explicitly typed useProfileStore to fix lint errors
export const useProfileStore = create<UserState>((set, get) => ({
  profile: null,

  isLoading: false,
  isSaving: false,
  error: null,

  // ── Fetch user (with auto-create fallback) ──────
  async fetchProfile(uid: string): Promise<void> {
    if (!uid) return;

    set({ isLoading: true, error: null });

    try {
      let profile = await getUserProfile(uid);

      // Auto-create profile if it doesn't exist
      if (!profile) {
        await createUserProfile(uid, {});
        profile = await getUserProfile(uid);
      }

      set({ profile: profile });
    } catch (err) {
      // Using type-safe error message access
      set({
        error: err instanceof Error ? err.message : "Failed to fetch user",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  getUserPlan() {
    const { profile } = get();
    return profile?.plan ?? null;
  },

  // ── Force refresh (no caching logic yet) ────────
  async refreshProfile(uid: string): Promise<void> {
    if (!uid) return;

    try {
      const profile = await getUserProfile(uid);
      set({ profile: profile });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to refresh user",
      });
    }
  },

  // ── Update profile ──────────────────────────────
  async updateProfile(
    uid: string,
    data: Partial<Omit<UserProfile, "uid" | "createdAt" | "updatedAt">>,
  ): Promise<void> {
    if (!uid) return;

    set({ isSaving: true, error: null });

    try {
      await updateUserProfile(uid, data);

      // optimistic update
      set((state) => ({
        profile: state.profile ? { ...state.profile, ...data } : state.profile,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update user",
      });
    } finally {
      set({ isSaving: false });
    }
  },

  // ── Clear (on logout) ───────────────────────────
  clearUser() {
    set({ profile: null, error: null });
  },
}));
