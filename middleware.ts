import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // 1. Define your internal domains
  // For production, use your primary Vercel URL
  const rootDomain = "quicksiteio.vercel.app";
  
  // 2. Standard exclusions (Next.js internals, static files, and API)
  if (
    url.pathname.startsWith("/_next") || 
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/static") ||
    url.pathname.includes(".") // Handles files like favicon.ico, robots.txt
  ) {
    return NextResponse.next();
  }

  // 3. Determine if we are on the Root Domain
  // We check for localhost (without a subdomain) or the exact production root
  const isRootDomain = 
    hostname === rootDomain || 
    hostname === "localhost:3000" ||
    hostname.split(':')[0] === "127.0.0.1";

  if (isRootDomain) {
    return NextResponse.next();
  }

  // 4. CUSTOM DOMAIN / SUBDOMAIN LOGIC
  // If we reach here, it's a custom domain (user-domain.com) 
  // or a test subdomain (newsitenewsite.vercel.app)
  
  // Clean the hostname (remove port for local testing if necessary)
  const cleanHostname = hostname.split(":")[0];

  // Rewrite to the dynamic directory
  // Result: /s/domain/newsitenewsite.vercel.app/[original-path]
  return NextResponse.rewrite(
    new URL(`/s/domain/${cleanHostname}${url.pathname}`, req.url)
  );
}