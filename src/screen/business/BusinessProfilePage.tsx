/* eslint-disable @next/next/no-img-element */
"use client";

// src/screen/business/BusinessProfilePage.tsx
// Public-facing business profile page

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Mail,
  Globe,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  Share2,
  ChevronRight,
  Star,
  Zap,
} from "lucide-react";
import type { BusinessProfile } from "@/lib/business";
import {
  buildWhatsAppUrl,
  getCategoryByValue,
} from "@/lib/business";

const SITE_STANDARD_NAME =
  process.env.NEXT_PUBLIC_SITE_STANDARD_NAME || "Quicksite";
const SITE_SHORT_NAME = process.env.NEXT_PUBLIC_SITE_SHORT_NAME || "qsio";
const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN_NAME || ".vercel.app";

interface BusinessProfilePageProps {
  profile: BusinessProfile;
  similar: BusinessProfile[];
}

export default function BusinessProfilePage({
  profile,
  similar,
}: BusinessProfilePageProps) {
  const [copied, setCopied] = useState(false);
  const category = getCategoryByValue(profile.category);
  const locationParts = [profile.city, profile.state].filter(Boolean);
  const location = locationParts.join(", ");

  // Track profile view
  useEffect(() => {
    const key = `pv_${profile.slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/business/${profile.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _action: "track_view" }),
    }).catch(() => {});
  }, [profile.slug]);

  const handleWhatsApp = () => {
    if (!profile.whatsappNumber) return;
    const msg = `Hi ${profile.name}! I found you on ${SITE_STANDARD_NAME} and I'd like to know more.`;
    fetch(`/api/business/${profile.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _action: "track_whatsapp" }),
    }).catch(() => {});
    window.open(buildWhatsAppUrl(profile.whatsappNumber, msg), "_blank");
  };

  const handleWhatsAppShare = () => {
    const url = window.location.href;
    const msg = `Check out ${profile.name} on ${SITE_STANDARD_NAME}: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/biz"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Directory
          </Link>
          <Link href="/" className="flex items-center gap-1.5">
            <div className="h-7 w-7 rounded-lg bg-primary grid place-items-center">
              <Zap className="h-4 w-4 text-primary-foreground fill-current" />
            </div>
            <span className="font-bold text-sm hidden sm:inline">
              {SITE_STANDARD_NAME}
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 text-xs font-bold bg-[#25D366]/10 text-[#25D366] px-3 py-1.5 rounded-full hover:bg-[#25D366]/20 transition"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Send to WhatsApp
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition"
            >
              <Share2 className="h-3.5 w-3.5" />
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Cover image / header ─────────────────────────────── */}
      <div className="relative">
        {profile.coverUrl ? (
          <div
            className="h-48 sm:h-64 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${profile.coverUrl})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ) : (
          <div className="h-32 sm:h-48 w-full bg-linear-to-br from-primary/20 to-secondary/20" />
        )}
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left: Profile card ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile header */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                {/* Logo / Avatar */}
                <div className="shrink-0">
                  {profile.logoUrl ? (
                    <img
                      src={profile.logoUrl}
                      alt={profile.name}
                      className="h-20 w-20 rounded-2xl object-cover border-4 border-background shadow-lg"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-2xl bg-primary border-4 border-background shadow-lg flex items-center justify-center text-2xl font-black text-white">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Identity */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl font-black truncate">
                      {profile.name}
                    </h1>
                    {profile.isVerified && (
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    )}
                    {profile.isFeatured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-secondary/10 text-secondary rounded-full">
                        <Star className="h-3 w-3 fill-current" /> Featured
                      </span>
                    )}
                  </div>
                  {profile.tagline && (
                    <p className="text-base text-muted-foreground leading-snug">
                      {profile.tagline}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {category && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                        {category.emoji} {category.label}
                      </span>
                    )}
                    {location && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                        <MapPin className="h-3 w-3" /> {location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {profile.description && (
                <p className="text-sm text-muted-foreground leading-relaxed mt-4 border-t border-border pt-4">
                  {profile.description}
                </p>
              )}

              {/* Tags */}
              {profile.tags && profile.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {profile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[11px] bg-muted rounded-full text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-primary">
                  {(profile.profileViews ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Profile views
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-secondary">
                  {(profile.whatsappClicks ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  WhatsApp chats
                </p>
              </div>
            </div>

            {/* Primary site link */}
            {profile.primarySiteSlug && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Business Website
                </p>
                <a
                  href={`https://${SITE_SHORT_NAME}${DOMAIN_NAME}/s/${profile.primarySiteSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-muted rounded-xl hover:bg-muted/80 transition group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm font-medium truncate">
                      {SITE_SHORT_NAME}
                      {DOMAIN_NAME}/s/{profile.primarySiteSlug}
                    </span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition shrink-0" />
                </a>
              </div>
            )}
          </div>

          {/* ── Right: CTA sidebar ── */}
          <div className="space-y-4">
            {/* WhatsApp CTA */}
            {profile.whatsappNumber ? (
              <div className="bg-card border border-border rounded-2xl p-5 sticky top-20">
                <p className="font-bold text-base mb-1">Get in touch</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Chat directly with {profile.name} on WhatsApp
                </p>
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl py-3.5 font-bold text-sm hover:opacity-90 transition shadow-lg shadow-[#25D366]/20"
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat on WhatsApp
                </button>

                {/* Other contacts */}
                <div className="mt-4 space-y-2 pt-4 border-t border-border">
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition"
                    >
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="truncate">{profile.email}</span>
                    </a>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition"
                    >
                      <Globe className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {profile.website.replace(/^https?:\/\//, "")}
                      </span>
                      <ExternalLink className="h-3 w-3 ml-auto shrink-0" />
                    </a>
                  )}
                  {profile.address && (
                    <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{profile.address}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-5">
                <p className="text-sm text-muted-foreground text-center py-4">
                  No contact details provided yet.
                </p>
              </div>
            )}

            {/* Powered by */}
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
              >
                <Zap className="h-3 w-3 text-primary fill-current" />
                Powered by {SITE_STANDARD_NAME}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Similar businesses ─────────────────────────────── */}
        {similar.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Similar Businesses</h2>
              <Link
                href={`/biz?category=${profile.category}`}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {similar.map((biz) => (
                <BusinessCard key={biz.id} business={biz} compact />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Reusable business card ────────────────────────────────────────────────────

export function BusinessCard({
  business,
  compact = false,
}: {
  business: BusinessProfile;
  compact?: boolean;
}) {
  const category = getCategoryByValue(business.category);

  if (compact) {
    return (
      <Link href={`/biz/${business.slug}`}>
        <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-md transition-all group">
          <div className="flex items-center gap-2 mb-2">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name}
                className="h-8 w-8 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-black text-primary shrink-0">
                {business.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold truncate">{business.name}</p>
              {business.state && (
                <p className="text-[10px] text-muted-foreground truncate">
                  {business.state}
                </p>
              )}
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground">
            {category?.emoji} {category?.label}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/biz/${business.slug}`}>
      <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all group h-full flex flex-col">
        {/* Cover / header */}
        <div className="h-24 bg-linear-to-br from-primary/10 to-secondary/10 relative flex items-center justify-center">
          {business.coverUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{ backgroundImage: `url(${business.coverUrl})` }}
            />
          ) : null}
          <div className="relative z-10">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name}
                className="h-12 w-12 rounded-xl object-cover border-2 border-white shadow"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-lg font-black text-white">
                {business.name.charAt(0)}
              </div>
            )}
          </div>
          {business.isVerified && (
            <div className="absolute top-2 right-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors">
            {business.name}
          </h3>
          {business.tagline && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex-1">
              {business.tagline}
            </p>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="text-[10px] text-muted-foreground">
              {category?.emoji} {category?.label}
            </span>
            {business.state && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                <MapPin className="h-2.5 w-2.5" />
                {business.state}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
