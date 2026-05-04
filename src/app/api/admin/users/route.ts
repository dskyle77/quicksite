import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import { getAllUsers } from "@/server/adminFirestore";

export async function GET() {
  const caller = await getUserFromSession();
  if (!caller?.uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Optionally check if the user is actually an admin
  // This assumes your users collection has an isAdmin field
  const { adminDb } = await import("@/server/firebase-admin");
  const callerDoc = await adminDb.collection("users").doc(caller.uid).get();
  if (!callerDoc.data()?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users", details: (error as Error).message },
      { status: 500 },
    );
  }
}
