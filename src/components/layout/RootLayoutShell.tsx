"use client";

// src/components/layout/RootLayoutShell.tsx
import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MARKETING_PATHS = ["/", "/pricing", "/templates", "/support"];

export default function RootLayoutShell({
  children,
  isSite
}: {
  children: React.ReactNode;
  isSite: boolean;
}) {
  const pathname = usePathname();
  const isMarketing = MARKETING_PATHS.includes(pathname);
  const showShell = isMarketing && !isSite
  const { resolvedTheme } = useTheme();

  return (
    <>
      {showShell && <Navbar />}
      <main className="flex-1">{children}</main>
      {showShell && <Footer />}

      <Toaster
        richColors
        position="top-right"
        closeButton
        theme={resolvedTheme as "light" | "dark"}
        toastOptions={{
          style: {
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "500",
          },
        }}
      />
    </>
  );
}
