// src/app/layout.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import RootLayoutShell from "@/components/layout/RootLayoutShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_STANDARD_NAME = process.env.NEXT_PUBLIC_SITE_STANDARD_NAME;

export const metadata: Metadata = {
  title: `${SITE_STANDARD_NAME} — Your business online in minutes`,
  description:
    "Build a professional website for your Nigerian business in minutes. No coding needed.",
  keywords: ["website builder", "Nigeria", "small business", "online store"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const isSite = headersList.get("x-is-site") === "true";
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <RootLayoutShell isSite={isSite}>{children}</RootLayoutShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
