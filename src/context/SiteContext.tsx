/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, ReactNode } from "react";
import { Site } from "@/lib/types";
import { createContext, useContext, Dispatch, SetStateAction } from "react";

export interface SiteContextValue {
  slugs?: Record<string, string>;
  isCustomDomain?: boolean;
  site?: Site;
  componentsGist?: any;
}

export interface SiteContextType {
  value: SiteContextValue;
  setValue: Dispatch<SetStateAction<SiteContextValue>>;
}

export const SiteContext = createContext<SiteContextType | undefined>(
  undefined,
);

export function useSiteContext(): SiteContextType {
  const ctx = useContext(SiteContext);

  if (!ctx) {
    throw new Error("useSiteContext must be used within a SiteProvider");
  }

  return ctx;
}

export function SiteProvider({
  value: initialValue,
  children,
}: {
  value: SiteContextValue;
  children: ReactNode;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <SiteContext.Provider value={{ value, setValue }}>
      {children}
    </SiteContext.Provider>
  );
}
