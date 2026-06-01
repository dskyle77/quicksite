// src/features/templates/TemplateGallery.tsx
"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { TemplateCard } from "./TemplateCard";
import { templatesRegistry, templatesCategories } from "@/lib/templates";
import { Search } from "lucide-react";

export default function TemplateGallery() {
  const searchParams = useSearchParams();
  const paramsName = searchParams.get("name");
  const paramsSlug = searchParams.get("slug");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const buildQuery = (base: string, c: string = "?") => {
    const queryParams: string[] = [];
    if (paramsName) queryParams.push(`name=${encodeURIComponent(paramsName)}`);
    if (paramsSlug) queryParams.push(`slug=${encodeURIComponent(paramsSlug)}`);
    return queryParams.length > 0
      ? `${base}${c}${queryParams.join("&")}`
      : base;
  };

  const categories = ["all", ...templatesCategories];

  const filtered = useMemo(() => {
    return templatesRegistry.filter((t) => {
      const matchesSearch =
        search.trim() === "" ||
        t.meta.title.toLowerCase().includes(search.toLowerCase()) ||
        t.meta.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.meta.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || t.meta.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <section className="min-h-screen bg-linear-to-b from-background to-muted/30 pb-16">
      <div className="container mx-auto px-4 pt-12">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            ✨ Beautiful Templates
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Start faster with stunning templates
          </h1>
          <p className="text-xl text-muted-foreground">
            Production-ready catalogue designs that connect directly to your Firebase data.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 h-12 rounded-2xl border border-border bg-background text-base focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-12 rounded-2xl border border-border bg-background px-5 text-sm focus:ring-2 focus:ring-primary/30"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-xl font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(
              filtered.reduce((acc, t) => {
                const cat = t.meta.category;
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(t);
                return acc;
              }, {} as Record<string, typeof templatesRegistry>)
            ).map(([category, templates]) => (
              <div key={category}>
                {selectedCategory === "all" && (
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-semibold capitalize">{category}</h2>
                    <div className="px-3 py-1 text-sm bg-muted rounded-full text-muted-foreground">
                      {templates.length} templates
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {templates.map((template, i) => (
                    <TemplateCard
                      key={template.config.type}
                      type={template.config.type}
                      title={template.meta.title}
                      description={template.meta.description}
                      category={template.meta.category}
                      // image={template.meta.image}
                      isPremium={template.config.isPremium}
                      previewHref={buildQuery(`/templates/${template.config.type}`)}
                      useHref={buildQuery(
                        `/dashboard/new?template=${encodeURIComponent(template.config.type)}`,
                        "&"
                      )}
                      delay={i * 25}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}