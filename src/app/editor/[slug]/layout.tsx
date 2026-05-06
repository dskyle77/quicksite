"use client";

import { ReactNode } from "react";
import { useEffect, use } from "react";
import { useAuth } from "@/lib/useAuth";
import { useSiteEditorStore } from "@/store/useSiteEditorStore";
import { toast } from "sonner";

// Explicit types for layout props
interface EditorLayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string; subslug?: string }>;
}

export default function EditorLayout({ children }: EditorLayoutProps) {
  return <>{children}</>;
}
