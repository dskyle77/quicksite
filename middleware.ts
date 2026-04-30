import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // 1. Define your internal domains
  const rootDomain = "quicksiteio.vercel.app";

  // 2. Standard exclusions
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/static") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 3. Root Domain Logic
  const isRootDomain =
    hostname === rootDomain ||
    hostname === "localhost:3000" ||
    hostname.split(":")[0] === "127.0.0.1";

  if (isRootDomain) {
    return NextResponse.next();
  }

  // 4. CUSTOM DOMAIN / SUBDOMAIN LOGIC
  const cleanHostname = hostname.split(":")[0];

  // Create the rewrite URL
  const rewriteUrl = new URL(
    `/s/domain/${cleanHostname}${url.pathname}`,
    req.url,
  );

  // 5. Inject the 'x-is-site' header
  // This is the key to hiding the Navbar/Footer in your layout
  const response = NextResponse.rewrite(rewriteUrl);
  response.headers.set("x-is-site", "true");

  return response;
}
