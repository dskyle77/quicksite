// @/screen/s/SiteRenderer.tsx
import { useSiteContext } from "@/context/SiteContext";
import { getTemplateByType } from "@/lib/templates";
import { getTheme } from "@/lib/themes";
import Template from "@/components/siteTemplates/Template";
import SiteTracker from "./SiteTracker";

export default function SiteRenderer() {
  const { value } = useSiteContext();
  const { isCustomDomain, site } = value;

  // Validate template exists
  const templateEntry = getTemplateByType(site?.type || "");
  if (!templateEntry?.config) {
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
  const theme = getTheme(site?.theme || "");
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

  return (
    <div className={`w-full h-full ${theme.className || ""}`}>
      {theme.css && <style>{theme.css}</style>}
      <Template
        isEditor={false}
        canCustomize={false}
        content={site?.content || {}}
        isCustomDomain={isCustomDomain}
        isPreview={true}
        hasNavbar={false}
      />
      <SiteTracker />
    </div>
  );
}
