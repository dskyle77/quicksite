"use client";

// src/context/AuthContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Auth source of truth. On every sign-in it:
//  1. Sets the Firebase user in context
//  2. Creates / updates the Firestore profile
//  3. Loads the profile + sites into the Zustand store
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  AuthError,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { createOrUpdateUserProfile } from "@/lib/firestore";
import { useUserStore } from "@/store/useUserStore";
import { useDashboardStore } from "@/store/useDashboardStore";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendReset: (email: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ── Friendly Firebase errors ──────────────────────────────────────────────────

function friendlyError(err: unknown): string {
  const code = (err as AuthError)?.code ?? "";
  const map: Record<string, string> = {
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/network-request-failed": "Network error. Check your connection.",
  };
  return (
    map[code] ?? (err instanceof Error ? err.message : "Something went wrong.")
  );
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { fetchProfile } = useUserStore();
  const { fetchSites, reset } = useDashboardStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Hydrate Zustand on every page load / token refresh
        await Promise.all([
          fetchProfile(firebaseUser.uid),
          fetchSites(firebaseUser.uid),
        ]);
      } else {
        reset();
      }
      setLoading(false);
    });
    return unsub;
  }, [fetchSites, fetchProfile, reset]);

  const afterSignIn = async (u: User) => {
    await fetch("/api/auth/create-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        photoURL: u.photoURL,
        phoneNumber: u.phoneNumber,
      }),
    });
    await Promise.all([fetchProfile(u.uid), fetchSites(u.uid)]);
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: u } = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await afterSignIn(u);
    } catch (err) {
      throw new Error(friendlyError(err));
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const { user: u } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(u, { displayName: name });
      setUser({ ...u, displayName: name } as User);
      await afterSignIn({ ...u, displayName: name } as User);
    } catch (err) {
      throw new Error(friendlyError(err));
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { user: u } = await signInWithPopup(auth, googleProvider);
      await afterSignIn(u);
    } catch (err) {
      throw new Error(friendlyError(err));
    }
  };

  const sendReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      throw new Error(friendlyError(err));
    }
  };

  const logOut = async () => {
    await signOut(auth);
    reset();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        sendReset,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
