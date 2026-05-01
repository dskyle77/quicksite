// src/app/api/paystack/webhook/route.ts

import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { adminDb } from "@/server/firebase-admin";
import type { Plan } from "@/lib/plans";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();

    // 1. Verify signature — reject anything not from Paystack
    const signature = req.headers.get("x-paystack-signature");
    const expected = createHmac("sha512", PAYSTACK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (signature !== expected) {
      console.warn("Paystack webhook: invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // 2. Only handle successful charges
    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const { metadata, status } = event.data;

    if (status !== "success") {
      return NextResponse.json({ received: true });
    }

    const uid = metadata?.uid as string | undefined;
    const plan = metadata?.plan as Plan | undefined;

    if (!uid || !plan) {
      console.error(
        "Paystack webhook: missing uid or plan in metadata",
        metadata,
      );
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    // 3. Update Firestore
    await adminDb.collection("users").doc(uid).update({
      plan,
      planUpdatedAt: new Date().toISOString(),
      // Store the Paystack reference for records
      paystackReference: event.data.reference,
    });

    console.log(`✅ Plan updated: ${uid} → ${plan}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("Paystack webhook error:", message);
    // Always return 200 to Paystack — otherwise it retries endlessly
    return NextResponse.json({ received: true, error: message });
  }
}
