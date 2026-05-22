import { createContext, useContext, ReactNode } from "react";

// 1. Define the shape of your context value.
// You can extend this to include any site-level data you want accessible in children.
export interface SiteContextValue {
  slug: string;
  subslug: string;
  // Add other properties as desired for your project, such as:
  // siteId?: string;
  // siteName?: string;
  // isCustomDomain?: boolean;
  // [key: string]: any;
}

// 2. Create the context (supports undefined to allow no value by default).
export const SiteContext = createContext<SiteContextValue | undefined>(undefined);

// 3. Custom hook to consume context (throws an error if used outside provider).
export function useSiteContext(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error("useSiteContext must be used within a SiteProvider");
  }
  return ctx;
}

// 4. SiteProvider supports passing ALL site-level properties, not just slugs.
// Usage: <SiteProvider value={{slug, subslug, siteId, etc}}>{children}</SiteProvider>
export function SiteProvider({
  value,
  children,
}: {
  value: SiteContextValue;
  children: ReactNode;
}) {
  return (
    <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
  );
}