"use client";

import { ReactNode } from "react";
import EditorLayout from "@/screen/editor/EditorLayout";

interface EditorLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: EditorLayoutProps) {
  return <EditorLayout>{children}</EditorLayout>;
}
