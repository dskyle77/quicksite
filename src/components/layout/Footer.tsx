// src/components/layout/Footer.tsx
import React from "react";
import { Zap } from "lucide-react";
import Link from "next/link";

const LINKS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Templates", href: "/templates" },
      { label: "Pricing", href: "/pricing" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  // {
  //   title: "Company",
  //   links: [
  //     { label: "About", href: "/about" },
  //     { label: "Blog", href: "/blog" },
  //     { label: "Careers", href: "/careers" },
  //     { label: "Contact", href: "/contact" },
  //   ],
  // },
  {
    title: "Support",
    links: [
      { label: "Help", href: "/support" },
      { label: "WhatsApp Us", href: "https://wa.me/2348161592059" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/dskyle77/",
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/dskyle77",
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4"
      >
        <path d="M6.21 3h3.67l4.07 5.55L18.87 3H22l-6.48 8.55L22 21h-3.77l-4.38-6.1L6.09 21H3l6.71-8.86L2 3zm2.7 2.16L18.11 19h1.13l-9.2-13.84zm6.08-.02l-9.1 13.86h-1.1l9.1-13.86z" />
   
      </svg>
    ),
  },

  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61578315550045",
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 8h-2a2 2 0 0 0-2 2v2h4l-.5 3.5H12v7H9v-7H7v-3h2v-2a4 4 0 0 1 4-4h3v3z" />
      </svg>
    ),
  },
];
const SITE_STANDARD_NAME = process.env.NEXT_PUBLIC_SITE_STANDARD_NAME;
const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN_NAME;

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/40 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="h-9 w-9 rounded-xl bg-primary grid place-items-center">
                <Zap className="h-5 w-5 text-primary-foreground fill-current" />
              </div>
              <div>
                <p className="font-bold text-lg leading-tight">
                  {SITE_STANDARD_NAME}
                </p>
                <p className="text-xs text-muted-foreground">{DOMAIN_NAME}</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your business online in minutes. Built proudly for Nigerian
              entrepreneurs 🇳🇬
            </p>
            <div className="flex gap-2">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-8 w-8 grid place-items-center border border-border rounded-full hover:bg-primary/10 hover:border-primary/40 text-muted-foreground hover:text-foreground transition"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="font-semibold text-sm mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-primary transition"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground gap-3">
          <p>© {new Date().getFullYear()} GXU Studios LTD</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/privacy" className="hover:text-primary transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary transition">
              Terms
            </Link>
            <span>Made in Lagos 🇳🇬</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
