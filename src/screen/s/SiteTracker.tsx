"use client";

import { useEffect } from "react";

export default function SiteTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const sessionKey = `v_sent_${slug}`;

    if (sessionStorage.getItem(sessionKey)) return;

    sessionStorage.setItem(sessionKey, "true");

    const trackVisit = async () => {
      try {
        await fetch("/api/analytics/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
          keepalive: true,
        });
      } catch (err) {
        console.error("Analytics hit failed", err);
        sessionStorage.removeItem(sessionKey);
      }
    };

    trackVisit();
  }, [slug]);

  return null;
}
