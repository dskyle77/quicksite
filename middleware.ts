import { NextResponse, NextRequest } from "next/server";
import { generalApiLimiter } from "@/lib/rateLimit";

const ROOT_DOMAIN = "quicksiteio.vercel.app";
const SHORT_DOMAIN = "qsio.vercel.app";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  /**
   * 1. Rate limit API routes
   */
  if (pathname.startsWith("/api")) {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";
    const { success, reset } = await generalApiLimiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "X-RateLimit-Reset": reset.toString() } },
      );
    }
    return NextResponse.next();
  }

  /**
   * 2. Skip Next.js internals and static files
   */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  /**
   * 3. Root domain — no rewrite needed
   */
  if (hostname === ROOT_DOMAIN || hostname === "localhost:3000") {
    return NextResponse.next();
  }

  /**
   * 4. Short domain (qsio.vercel.app)
   * / → redirect to root domain landing page
   * /my-site → rewrite to /s/my-site
   */
  if (hostname === SHORT_DOMAIN) {
    if (pathname === "/") {
      return NextResponse.redirect(`https://${ROOT_DOMAIN}`);
    }
    const rewriteUrl = new URL(`/s${pathname}`, req.url);
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set("x-is-site", "true");
    return response;
  }

  /**
   * 5. Custom domain
   * customdomain.com/ → rewrite to /s/customdomain.com
   * customdomain.com/path → rewrite to /s/customdomain.com/path
   */
  const cleanHostname = hostname.split(":")[0];
  const slugPath = pathname === "/" ? "" : pathname;
  const rewriteUrl = new URL(`/s/${cleanHostname}${slugPath}`, req.url);
  const response = NextResponse.rewrite(rewriteUrl);
  response.headers.set("x-is-site", "true");
  response.headers.set("x-is-custom-domain", "true");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
