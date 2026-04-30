import { NextResponse } from "next/server";
import dns from "node:dns/promises";

export async function POST(req: Request) {
  try {
    const { domain } = await req.json();

    if (!domain) {
      return NextResponse.json(
        { isValid: false, error: "Domain is required" },
        { status: 400 },
      );
    }

    // Explicitly type aRecords as string[] to avoid the 'never' type error
    const aRecords: string[] = await dns.resolve4(domain).catch(() => []);

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
