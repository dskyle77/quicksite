// src/app/api/paystack/initialize/route.ts
// POST /api/paystack/initialize
// Creates a Paystack transaction and returns an authorization URL.

import { NextResponse } from "next/server";
import { getUserFromSession } from "@/server/auth";
import type { Plan } from "@/lib/plans";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

// Must match your Paystack dashboard plan codes exactly (or use price amounts)
// Amount is in KOBO (multiply Naira by 100)
const PLAN_AMOUNTS: Record<Exclude<Plan, "free">, number> = {
  basic: 150000, // ₦1,500
  growth: 400000, // ₦4,000
  pro: 1000000, // ₦10,000
};

export async function POST(req: Request) {
  try {
    const user = await getUserFromSession();
    if (!user?.uid || !user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = (await req.json()) as { plan: Exclude<Plan, "free"> };

    if (!plan || !(plan in PLAN_AMOUNTS)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const amount = PLAN_AMOUNTS[plan];

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount,
        currency: "NGN",
        // Attach uid + plan so the webhook knows what to update
        metadata: {
          uid: user.uid,
          plan,
          cancel_action: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
      }),
    });

    const data = await res.json();

    if (!data.status) {
      throw new Error(data.message || "Paystack initialization failed");
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
