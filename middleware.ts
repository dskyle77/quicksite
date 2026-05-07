import { NextResponse, NextRequest } from "next/server";
import { generalApiLimiter } from "@/lib/rateLimit"; // Ensure this path is correct

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const path = url.pathname;

  const rootDomain = "quicksiteio.vercel.app";
  const shortDomain = "qsio.vercel.app";

  /**
   * 1. Rate Limiting for API Routes
   * We apply this first to block spam before any other logic runs.
   */
  if (path.startsWith("/api")) {
    // Robust IP detection to satisfy TypeScript
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";

    const { success, reset } = await generalApiLimiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "X-RateLimit-Reset": reset.toString() },
        },
      );
    }
    // If successful, allow the request to proceed to the actual API route
    return NextResponse.next();
  }

  /**
   * 2. Standard exclusions
   * Ignore Next.js internals, static files, and files with extensions (favicon.ico, etc.)
   */
  if (
    path.startsWith("/_next") ||
    path.startsWith("/static") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  /**
   * 3. Root Domain Logic
   */
  const isRootDomain = hostname === rootDomain || hostname === "localhost:3000";
  if (isRootDomain) {
    return NextResponse.next();
  }

  /**
   * 4. Short Domain Logic (qsio.vercel.app)
   */
  const isShortDomain = hostname === shortDomain;

  if (isShortDomain) {
    // If user hits the base short domain, send them to the landing page
    if (path === "/") {
      return NextResponse.redirect(`https://${rootDomain}`);
    }

    // Rewrite: qsio.vercel.app/my-site -> /s/my-site
    const rewriteUrl = new URL(`/s${path}`, req.url);
    const response = NextResponse.rewrite(rewriteUrl);
    response.headers.set("x-is-site", "true");
    return response;
  }

  /**
   * 5. Custom Domain Logic
   * Maps customdomain.com/path to /s/domain/customdomain.com/path
   */
  const cleanHostname = hostname.split(":")[0];
  const rewriteUrl = new URL(`/s/domain/${cleanHostname}${path}`, req.url);
  const response = NextResponse.rewrite(rewriteUrl);
  response.headers.set("x-is-site", "true");

  return response;
}

// Ensure the middleware only runs on relevant paths to keep the app fast
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
