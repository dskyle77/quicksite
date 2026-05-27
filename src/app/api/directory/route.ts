// src/app/api/directory/route.ts
// GET /api/directory — paginated, filtered business directory

import { NextResponse } from "next/server";
import { getDirectoryListings } from "@/server/businessFirestore";
import type { BusinessCategory } from "@/lib/business";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const category = (searchParams.get("category") || "all") as
  | BusinessCategory
  | "all";
  const state = searchParams.get("state") || undefined;
  const search = searchParams.get("search") || undefined;
  const featured = searchParams.get("featured") === "true";
  const cursor = searchParams.get("cursor") || undefined;

  try {
    const { businesses, nextCursor } = await getDirectoryListings(
      { category, state, search, featured }, 
      cursor,
    );
    return NextResponse.json({
      businesses: businesses || [],
      nextCursor: nextCursor || null,
    });
  } catch (err) {
    console.error("api/directory error:", err);
    return NextResponse.json(
      { error: (err as Error).message, businesses: [], nextCursor: null },
      { status: 500 },
    );
  }
}
