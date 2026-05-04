import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import { adminDb } from "@/server/firebase-admin";
import { getDomainsPaginated } from "@/server/adminFirestore";

export async function GET(req: Request) {
  const caller = await getUserFromSession();
  if (!caller?.uid)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const callerDoc = await adminDb.collection("users").doc(caller.uid).get();
  if (!callerDoc.data()?.isAdmin)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  try {
    const { domains, nextCursor } = await getDomainsPaginated({ cursor, search });
    return NextResponse.json({ domains, nextCursor });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch domains", details: (error as Error).message },
      { status: 500 },
    );
  }
}