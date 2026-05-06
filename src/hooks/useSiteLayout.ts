import { useEffect } from "react";
import { useSiteDisplayStore } from "@/store/useSiteDisplayStore";
import { toast } from "sonner";

export function useSiteLayout(fetchFn: () => Promise<void>) {
  const reset = useSiteDisplayStore((s) => s.reset);

  useEffect(() => {
    fetchFn().catch(() => toast.error("Failed to load site"));
    return () => reset();
  }, []);
}
