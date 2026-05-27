"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Zap, MapPin } from "lucide-react";
import type { BusinessProfile } from "@/lib/business";

export default function RecentlyJoinedSection() {
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await fetch("/api/directory?pageSize=8");
        const data = await res.json();
        if (data.businesses) setBusinesses(data.businesses);
      } catch (err) {
        console.error("Failed to fetch recently joined businesses:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRecent();
  }, []);

  if (loading || businesses.length === 0) return null;

  return (
    <section className="py-24 bg-muted/30 border-t border-border/60">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div className="max-w-xl">
            <h2 className="text-3xl font-black tracking-tight mb-3">
              Recently Joined <span className="text-primary">Businesses</span>
            </h2>
            <p className="text-muted-foreground">
              Discover the latest Nigerian SMEs that have moved their business online with Quicksite.
            </p>
          </div>
          <Link 
            href="/biz" 
            className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            Explore Directory <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {businesses.map((biz) => (
            <Link key={biz.id} href={`/biz/${biz.slug}`}>
              <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-lg transition-all group h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  {biz.logoUrl ? (
                    <img 
                      src={biz.logoUrl} 
                      alt={biz.name} 
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-black text-primary">
                      {biz.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                      {biz.name}
                    </p>
                    {biz.state && (
                      <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <MapPin className="h-2.5 w-2.5" /> {biz.state}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2 flex-1 italic">
                  &quot;{biz.tagline || biz.description || "Building a brand in Nigeria..."}&quot;
                </p>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    {biz.category}
                  </span>
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="h-3 w-3 text-primary fill-current" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link 
            href="/biz" 
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
          >
            Explore Directory <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
