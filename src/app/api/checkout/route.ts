import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/**
 * Create a CREEM checkout URL for a subscription plan.
 * Resilient to DB failures — payment flow always works.
 */
// Hardcoded product IDs — ignore stale env vars
const PLAN_PRODUCTS: Record<string, string> = {
  starter: "prod_2nG2k8uhSIHSFwLAstNoFO",
  pro: "prod_3jVL3w9v9Fhk6MAMDom6IM",
};

export async function POST(req: NextRequest) {
  try {
    // 1. Try to get session — if DB is down, this might fail
    let session;
    let userId = "";
    let userEmail = "";
    try {
      session = await getServerSession(authOptions);
      userId = (session?.user as any)?.id || "";
      userEmail = (session?.user as any)?.email || "";
    } catch (authErr) {
      console.warn("Auth check failed (DB unavailable):", authErr);
    }

    // 2. Parse request body
    const { plan } = await req.json();
    if (!plan || !PLAN_PRODUCTS[plan]) {
      return NextResponse.json({ error: "Invalid plan. Choose 'starter' or 'pro'." }, { status: 400 });
    }

    // 3. Check for existing active subscription (skip if DB unavailable)
    if (userId) {
      try {
        const existingSub = await prisma.subscription.findFirst({
          where: { userId, status: "active" },
        });
        if (existingSub) {
          return NextResponse.json(
            { error: "You already have an active subscription. Manage it in your billing page." },
            { status: 409 }
          );
        }
      } catch (dbErr) {
        console.warn("DB subscription check skipped:", dbErr);
      }
    }

    // 4. Call CREEM API
    const apiKey = "creem_1Fq0MnS70A85MKZeBkWgIt";
    if (!apiKey) {
      return NextResponse.json(
        { error: "Payment system is not configured yet. Please try again later." },
        { status: 503 }
      );
    }

    // Build success URL — CREEM requires valid public URL format
    const vercelUrl = process.env.VERCEL_URL;
    const nextauthUrl = process.env.NEXTAUTH_URL;
    const origin = req.headers.get("origin") || "";
    let baseUrl = "https://pixelforgeai.club"; // safe default
    if (origin && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
      baseUrl = origin;
    } else if (nextauthUrl && nextauthUrl.startsWith("https://")) {
      baseUrl = nextauthUrl;
    } else if (vercelUrl) {
      baseUrl = `https://${vercelUrl}`;
    }

    console.log("CREEM checkout request:", {
      plan,
      productId: PLAN_PRODUCTS[plan],
      baseUrl,
      userId: userId || "anonymous",
    });

    const resp = await fetch("https://api.creem.io/v1/checkouts", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: PLAN_PRODUCTS[plan],
        success_url: `${baseUrl}/dashboard?upgraded=true`,
        ...(userEmail ? { customer: { email: userEmail } } : {}),
        metadata: {
          user_id: userId,
          plan: plan,
        },
      }),
    });

    if (!resp.ok) {
      let errDetail = "";
      try { errDetail = await resp.text(); } catch {}
      console.error("CREEM checkout error:", resp.status, errDetail);

      // Return the actual CREEM error to help debug
      let userMessage = "Failed to create checkout session. ";
      if (resp.status === 401) userMessage += "Payment API key is invalid.";
      else if (resp.status === 403) userMessage += "Payment provider review pending — your store may not be approved yet.";
      else if (resp.status === 404) userMessage += "Product not found — the subscription plan may not be configured correctly.";
      else if (resp.status === 422) userMessage += "Invalid request data. Please contact support.";
      else userMessage += `Payment provider returned error ${resp.status}. Please try again later.`;

      return NextResponse.json({ error: userMessage, detail: errDetail }, { status: 502 });
    }

    const data = await resp.json();
    const checkoutUrl = data.checkout_url || data.url;

    if (!checkoutUrl) {
      return NextResponse.json({ error: "No checkout URL returned from payment provider." }, { status: 502 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    console.error("Checkout error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
