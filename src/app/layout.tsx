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

// Fallback to 'QuickSite' if the env variable is missing
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_STANDARD_NAME || "QuickSite";
const SITE_URL = "https://quicksiteio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Your business online in minutes`,
    template: `%s`,
  },
  description:
    "Build a professional website for your Nigerian business in minutes. No coding needed, mobile-friendly, and SEO-optimized.",
  keywords: [
    "website builder Nigeria",
    "e-commerce Nigeria",
    "small business tools",
    "create a website Lagos",
    "Nigerian SMEs",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,

  // Icons configuration for your green bolt
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },

  // Social Media Previews
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Website Builder for Nigerians`,
    description:
      "Launch your business online today with the easiest website builder in Nigeria.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} Platform Preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Nigerian Website Builder`,
    description: "Build your professional business website in minutes.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
