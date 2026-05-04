import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const path = url.pathname;

  // 1. Define your domains
  const rootDomain = "quicksiteio.vercel.app";
  const shortDomain = "qsio.vercel.app"; // Your short link domain

  // 2. Standard exclusions (Assets, API, etc.)
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/static") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  // 3. Root Domain Logic (The Main App)
  const isRootDomain = hostname === rootDomain || hostname === "localhost:3000";

  if (isRootDomain) {
    // If someone visits quicksiteio.vercel.app/s/[slug], let it pass through
    // to the actual file at app/s/[slug]/page.tsx
    return NextResponse.next();
  }

  // 4. Short Domain or Custom Domain Logic
  const isShortDomain = hostname === shortDomain;
  const cleanHostname = hostname.split(":")[0];

  let rewriteUrl: URL;

  if (isShortDomain) {
    // Treat qsio.vercel.app/[slug] as a rewrite to /s/[slug]
    // Note: path already contains the leading slash, e.g., "/my-site"
    rewriteUrl = new URL(`/s${path}`, req.url);
  } else {
    // Treat everything else as a Custom Domain
    // Rewrites to /s/domain/[hostname][path]
    rewriteUrl = new URL(`/s/domain/${cleanHostname}${path}`, req.url);
  }

  // 5. Inject the 'x-is-site' header
  const response = NextResponse.rewrite(rewriteUrl);
  response.headers.set("x-is-site", "true");

  return response;
}
