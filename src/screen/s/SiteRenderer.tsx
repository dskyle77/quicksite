import { getTemplateByType } from "@/lib/templates";
import { getTheme } from "@/lib/themes";

import type { Site } from "@/lib/types";

import SiteTracker from "./SiteTracker";

export default function SiteRenderer({
  site,
  slugs,
  isCustomDomain,
}: {
  site: Site;
  slugs: Record<string, string>;
  isCustomDomain?: boolean;
}) {
  // Validate template exists
  const templateEntry = getTemplateByType(site.type);
  if (!templateEntry?.template) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-semibold mb-2">Page Unavailable</h1>
          <p className="text-gray-600">
            This page is currently unavailable. Please check back later or
            contact the site owner.
          </p>
        </div>
      </div>
    );
  }

  // Validate theme exists
  const theme = getTheme(site.theme);
  if (!theme) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-semibold mb-2">Page Unavailable</h1>
          <p className="text-gray-600">
            This page is currently unavailable. Please check back later or
            contact the site owner.
          </p>
        </div>
      </div>
    );
  }

  const Template = templateEntry.template;

  return (
    <div className={`w-full h-full ${theme.className || ""}`}>
      {theme.css && <style>{theme.css}</style>}
      <Template
        isEditor={false}
        content={site.content || {}}
        slugs={slugs}
        isCustomDomain={isCustomDomain}
      />
      <SiteTracker slug={slugs.slug} />
    </div>
  );
}
