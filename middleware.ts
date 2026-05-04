import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const path = url.pathname;

  const rootDomain = "quicksiteio.vercel.app";
  const shortDomain = "qsio.vercel.app";

  // 1. Standard exclusions
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/static") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Root Domain Logic
  const isRootDomain = hostname === rootDomain || hostname === "localhost:3000";
  if (isRootDomain) {
    return NextResponse.next();
  }

  // 3. Short Domain Logic
  const isShortDomain = hostname === shortDomain;

  if (isShortDomain) {
    // REDIRECT logic: If it's just the root domain, send to the main site
    if (path === "/") {
      return NextResponse.redirect(`https://${rootDomain}`);
    }

    // REWRITE logic: Treat qsio.vercel.app/[slug] as /s/[slug]
    const rewriteUrl = new URL(`/s${path}`, req.url);
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set("x-is-site", "true");
    return response;
  }

  // 4. Custom Domain Logic
  const cleanHostname = hostname.split(":")[0];
  const rewriteUrl = new URL(`/s/domain/${cleanHostname}${path}`, req.url);
  const response = NextResponse.rewrite(rewriteUrl);
  response.headers.set("x-is-site", "true");

  return response;
}
