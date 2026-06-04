/* eslint-disable react-hooks/set-state-in-effect */
// hooks/useMobile.ts
import { useState, useEffect } from "react";

export function useMobile(breakpoint: number = 768) {
  // 1. Initialize with null or a safe default to avoid server/client mismatch
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    // 2. This code ONLY runs on the client side, where `window` is safe to use
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    // Set the initial true state now that we are on the client
    setIsMobile(media.matches);

    // 3. Listen for future screen size changes (e.g., rotating a phone or resizing a browser)
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", listener);

    // Clean up listener on unmount
    return () => media.removeEventListener("change", listener);
  }, [breakpoint]);

  // Returns null on server, and true/false on client
  return isMobile;
}
