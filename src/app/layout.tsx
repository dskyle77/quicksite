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
    default: `${SITE_NAME} — Turn your WhatsApp business into a brand`,
    template: `%s`,
  },
  description:
    "Quicksite is the easiest way for Nigerian SMEs to go online. Get an SEO-optimized business page, WhatsApp lead system, and discoverable listing in minutes.",
  keywords: [
    "WhatsApp business Nigeria",
    "business directory Nigeria",
    "website builder Lagos",
    "Nigerian small business",
    "get discovered on Google Nigeria",
    "Quicksite Nigeria",
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
    title: `${SITE_NAME} — Turn your WhatsApp business into a brand`,
    description:
      "The discovery platform for Nigerian small businesses. Get found on Google and receive leads on WhatsApp.",
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
    title: `${SITE_NAME} | Nigerian Business Discovery`,
    description: "Launch your professional brand on the web in minutes.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
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
