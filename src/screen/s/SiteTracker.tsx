"use client";

import { useEffect } from "react";

export default function SiteTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // 1. Check if we've already counted this session to prevent spamming
    const sessionKey = `v_sent_${slug}`;
    if (sessionStorage.getItem(sessionKey)) return;

    // 2. Fire the visit hit
    const trackVisit = async () => {
      try {
        await fetch("/api/analytics/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
          // keepalive ensures the request finishes even if the user leaves the page immediately
          keepalive: true,
        });

        // 3. Mark as sent for this session
        sessionStorage.setItem(sessionKey, "true");
      } catch (err) {
        console.error("Analytics hit failed", err);
      }
    };

    trackVisit();
  }, [slug]);

  return null; // This is a logic-only component
}
