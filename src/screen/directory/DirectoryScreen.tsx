/* eslint-disable @next/next/no-img-element */
"use client";

// src/screen/directory/DirectoryScreen.tsx
// Business directory with search, category, state, and city filters with paginated results

import { useState, useCallback, useTransition, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X, Loader2, Zap, ChevronRight, Star, MapPin, Filter } from "lucide-react";
import type { BusinessProfile, BusinessCategory } from "@/lib/business";
import { BUSINESS_CATEGORIES, NIGERIAN_STATES } from "@/lib/business";
import { BusinessCard } from "@/screen/business/BusinessProfilePage";

const SITE_STANDARD_NAME =
  process.env.NEXT_PUBLIC_SITE_STANDARD_NAME || "Quicksite";

interface DirectoryScreenProps {
  featured: BusinessProfile[];
  initial: {
    businesses: BusinessProfile[];
    nextCursor: string | null;
  };
}

export default function DirectoryScreen({
  featured = [],
  initial,
}: DirectoryScreenProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    BusinessCategory | "all"
  >("all");
  const [selectedState, setSelectedState] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [businesses, setBusinesses] = useState<BusinessProfile[]>(
    initial?.businesses || [],
  );
  const [nextCursor, setNextCursor] = useState<string | null>(
    initial?.nextCursor || null,
  );
  const [loading, setLoading] = useState(false);
  const [searching, startSearchTransition] = useTransition();

  // Used to skip the fetch on the very first render — data already comes from the `initial` prop
  const hasMounted = useRef(false);

  // ── Debounce search ───────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Core fetch ────────────────────────────────────────────────────
  const fetchPage = useCallback(
    async (opts: {
      category: BusinessCategory | "all";
      state: string;
      search: string;
      cursor?: string;
      append?: boolean;
    }) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (opts.category !== "all") params.set("category", opts.category);
        if (opts.state) params.set("state", opts.state);
        if (opts.search) params.set("search", opts.search);
        if (opts.cursor) params.set("cursor", opts.cursor);

        const res = await fetch(`/api/directory?${params}`);
        const data = await res.json();

        if (!data.businesses) {
          if (!opts.append) setBusinesses([]);
          return;
        }

        if (opts.append) {
          setBusinesses((prev) => [...prev, ...data.businesses]);
        } else {
          setBusinesses(data.businesses);
        }
        setNextCursor(data.nextCursor || null);
      } catch (err) {
        console.error("fetchPage error:", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ── Re-fetch whenever filters change (skip first mount) ───────────
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    startSearchTransition(() => {
      fetchPage({
        category: selectedCategory,
        state: selectedState,
        search: debouncedSearch,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategory, selectedState]);

  // ── Handlers ──────────────────────────────────────────────────────
  const handleCategory = (cat: BusinessCategory | "all") => {
    setSelectedCategory(cat);
  };

  const handleState = (state: string) => {
    setSelectedState(state);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedState("");
  };

  // Use debouncedSearch (not live search) so Load More uses the same term as the current results
  const loadMore = () => {
    if (!nextCursor) return;
    fetchPage({
      category: selectedCategory,
      state: selectedState,
      search: debouncedSearch,
      cursor: nextCursor,
      append: true,
    });
  };

  // ── Derived state ─────────────────────────────────────────────────
  const hasFilters = search || selectedCategory !== "all" || selectedState;
  const isLoading = loading || searching;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Header ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/5 to-secondary/5 border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 -left-32 h-64 w-64 rounded-full bg-secondary/5 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-14 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            <div className="h-6 w-6 rounded-lg bg-primary grid place-items-center">
              <Zap className="h-3.5 w-3.5 text-white fill-current" />
            </div>
            {SITE_STANDARD_NAME}
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-balance">
            Discover Nigerian <span className="text-primary">Businesses</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Find and connect with verified local businesses. Chat directly on
            WhatsApp — no middleman.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search businesses, services, or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
            {isLoading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* ── Featured strip ────────────────────────────────────── */}
        {featured.length > 0 && !hasFilters && (
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-4 w-4 text-secondary fill-current" />
              <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                Featured Businesses
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {featured.map((biz) => (
                <Link key={biz.id} href={`/biz/${biz.slug}`}>
                  <div className="bg-card border border-border rounded-xl p-3 hover:border-secondary/40 hover:shadow-md transition-all group text-center">
                    {biz.logoUrl ? (
                      <img
                        src={biz.logoUrl}
                        alt={biz.name}
                        className="h-10 w-10 rounded-xl object-cover mx-auto mb-2"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary mx-auto mb-2">
                        {biz.name.charAt(0)}
                      </div>
                    )}
                    <p className="text-xs font-bold truncate group-hover:text-primary transition-colors">
                      {biz.name}
                    </p>
                    {biz.state && (
                      <p className="text-[10px] text-muted-foreground truncate">
                        {biz.state}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Filter row ───────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          {/* Category scrollable pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1 min-w-0 no-scrollbar">
            <button
              onClick={() => handleCategory("all")}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All
            </button>
            {BUSINESS_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategory(cat.value)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat.value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          {/* State filter toggle */}
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              showFilters || selectedState
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            {selectedState || "State"}
          </button>

          {/* Clear all filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="shrink-0 flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>

        {/* State Selection Grid */}
        {showFilters && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Filter by State
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleState("")}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  !selectedState
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                All States
              </button>
              {NIGERIAN_STATES.map((state) => (
                <button
                  key={state}
                  onClick={() => handleState(state)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedState === state
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Active filter summary ────────────────────────────── */}
        {hasFilters && (
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <p>
              Showing results
              {selectedCategory !== "all" && (
                <>
                  {" "}
                  for{" "}
                  <strong className="text-foreground">
                    {
                      BUSINESS_CATEGORIES.find(
                        (c) => c.value === selectedCategory,
                      )?.label
                    }
                  </strong>
                </>
              )}
              {selectedState && (
                <>
                  {" "}
                  in <strong className="text-foreground">{selectedState}</strong>
                </>
              )}
              {search && (
                <>
                  {" "}
                  matching{" "}
                  <strong className="text-foreground">
                    &quot;{search}&quot;
                  </strong>
                </>
              )}
            </p>
          </div>
        )}

        {/* ── Grid ─────────────────────────────────────────────── */}
        {isLoading && businesses.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (businesses?.length || 0) === 0 ? (
          <div className="text-center py-20">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h2 className="font-bold text-xl mb-2">No businesses found</h2>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              {hasFilters
                ? "Try different filters or search terms."
                : "Be the first to list your business on Quicksite!"}
            </p>
            {!hasFilters && (
              <Link href="/onboarding">
                <button className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full h-10 px-6 text-sm font-semibold hover:opacity-90 transition">
                  List your business
                </button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {businesses.map((biz) => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>

            {/* Load more */}
            {nextCursor && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-border bg-card text-sm font-semibold hover:bg-muted transition disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Load more businesses"
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* ── CTA banner ───────────────────────────────────────── */}
        <div className="mt-16 bg-primary rounded-3xl p-8 text-center text-primary-foreground relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 20%, white 0%, transparent 50%)",
            }}
          />
          <div className="relative">
            <h2 className="text-2xl font-black mb-2">Is your business here?</h2>
            <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
              Join thousands of Nigerian businesses on Quicksite. Get
              discovered, build your website, and receive leads on WhatsApp —
              free.
            </p>
            <Link href="/signup">
              <button className="inline-flex items-center gap-2 bg-white text-primary rounded-full h-11 px-8 text-sm font-bold hover:opacity-90 transition shadow-lg">
                List your business free
                <ChevronRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
