import { NextResponse } from "next/server";
import dns from "node:dns/promises";

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();
    const cleanDomain = domain.toLowerCase().trim();

    // 1. If it's a vercel.app domain, we don't need to check DNS
    // Vercel handles these automatically, so we mark it as valid immediately.
    if (cleanDomain.endsWith(".vercel.app")) {
      return NextResponse.json({
        isValid: true,
        found: ["Vercel Internal Routing"],
      });
    }

    // 2. For custom domains (mysite.com), perform the A Record check
    const aRecords: string[] = await dns.resolve4(cleanDomain).catch(() => []);
    const targetIp = "76.76.21.21";
    const isValid = aRecords.includes(targetIp);

    return NextResponse.json({
      isValid,
      found: aRecords,
    });
  } catch (e) {
    return NextResponse.json(
      {
        isValid: false,
        error: "DNS resolution failed",
      },
      { status: 500 },
    );
  }
}
