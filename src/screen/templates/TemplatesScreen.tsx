// src/features/templates/TemplateGallery.tsx
"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { TemplateCard } from "./TemplateCard";
import { templatesRegistry, templatesCategories } from "@/lib/templates";

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

  // Filter templates
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

  // Group filtered templates by category
  const grouped = useMemo(() => {
    return filtered.reduce(
      (acc, template) => {
        const cat = template.meta.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(template);
        return acc;
      },
      {} as Record<string, typeof templatesRegistry>,
    );
  }, [filtered]);

  const groupEntries = Object.entries(grouped);

  return (
    <section className="pt-16 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <span className="inline-flex items-center border border-border px-2.5 py-0.5 text-xs rounded-full mb-4 font-medium bg-muted/50">
            Templates
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3 text-balance">
            Production-ready catalogue template, ready in one click.
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose one reliable template, launch quickly, and customize all
            content from your Firebase data.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 h-10 rounded-lg border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring transition"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring transition capitalize"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="capitalize">
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        {groupEntries.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No templates found for{" "}
            <span className="font-medium text-foreground">
              &quot;{search}&quot;
            </span>
            .
          </div>
        ) : (
          <div className="space-y-14">
            {groupEntries.map(([category, templates]) => (
              <div key={category}>
                {/* Category heading — only show when not filtered to one category */}
                {selectedCategory === "all" && (
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-lg font-semibold capitalize">
                      {category}
                    </h2>
                    <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">
                      {templates.length}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                )}

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {templates.map((template, i) => (
                    <TemplateCard
                      key={template.config.type}
                      type={template.config.type}
                      title={template.meta.title}
                      description={template.meta.description}
                      category={template.meta.category}
                      image={template.meta.image}
                      previewHref={buildQuery(
                        `/templates/${template.config.type}`,
                        "?",
                      )}
                      useHref={buildQuery(
                        `/dashboard/new?template=${encodeURIComponent(template.config.type)}`,
                        "&",
                      )}
                      delay={i * 40}
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
