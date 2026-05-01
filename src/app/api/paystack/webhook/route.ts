// src/app/api/paystack/webhook/route.ts
// POST /api/paystack/webhook
// Paystack calls this after a successful charge. Verifies the signature,
// then sets users/{uid}.plan in Firestore.
//
// There are two different URLs:
//
// 1. The **webhook URL** — this is for Paystack to notify your backend of payment status (called server-to-server). This should be registered in your Paystack dashboard:
//     e.g. https://quicksiteio.vercel.app/api/paystack/webhook
//
// 2. The **callback_url** — this is sent when creating a transaction and is where Paystack redirects the *user's browser* after payment. In this project, it's set to something like:
//     e.g. https://quicksiteio.vercel.app/dashboard?upgrade=success
//
// TL;DR:
// - Webhook URL → Paystack server calls your backend (/api/paystack/webhook).
// - Callback URL → After payment, user is redirected there (e.g. dashboard or success page).

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
